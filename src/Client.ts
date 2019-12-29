import pako from 'pako';
import {
  BehaviorSubject,
  defer,
  identity,
  interval,
  Subject,
  Subscription,
  throwError,
  timer
} from 'rxjs';
import {
  flatMap,
  retryWhen,
  skipWhile,
  take,
  takeWhile,
  timeout
} from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import WebSocket from 'ws';

export class Client {
  private webSocketSubject!: WebSocketSubject<string>;

  private shouldReconnect: boolean;
  private readonly connectionSubject: BehaviorSubject<boolean>;

  private readonly startSubject: Subject<void>;
  private readonly closeSubject: Subject<void>;
  private readonly errorSubject: Subject<any>;
  private readonly messageSubject: Subject<string>;

  constructor(private retryAttempts: number) {
    this.shouldReconnect = false;
    this.connectionSubject = new BehaviorSubject<boolean>(false);

    this.startSubject = new Subject();
    this.closeSubject = new Subject();
    this.errorSubject = new Subject();
    this.messageSubject = new Subject();
  }

  public async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      defer(() => this.tryStart())
        .pipe(
          retryWhen(errors =>
            errors.pipe(
              flatMap((error, index) =>
                index > this.retryAttempts
                  ? throwError(error)
                  : timer((index + 1) * 5000)
              )
            )
          )
        )
        .subscribe(resolve, reject);
    });
  }

  public async send(data: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connectionSubject
        .pipe(
          skipWhile(connected => !connected),
          take(1),
          timeout(5000)
        )
        .subscribe(() => this.webSocketSubject.next(data), reject, resolve);
    });
  }

  public close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.shouldReconnect = false;
      const connection = this.connectionSubject.value;

      if (connection && !this.webSocketSubject.closed) {
        this.webSocketSubject.complete();
        this.connectionSubject
          .pipe(
            skipWhile(connected => connected),
            take(1),
            timeout(5000)
          )
          .subscribe(() => resolve(), reject);
      }
    });
  }

  public onStart(observer: () => void): Subscription {
    return this.startSubject.subscribe(observer);
  }

  public onClose(observer: () => void): Subscription {
    return this.closeSubject.subscribe(observer);
  }

  public onMessage(observer: (message: string) => void): Subscription {
    return this.messageSubject.subscribe(observer);
  }

  public onError(observer: (error: any) => void): Subscription {
    return this.errorSubject.subscribe(observer);
  }

  private async tryStart(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.shouldReconnect = true;
      this.webSocketSubject = webSocket({
        url: 'wss://m.iirose.com:443',
        binaryType: 'arraybuffer',
        WebSocketCtor: WebSocket,
        openObserver: {
          next: async () => {
            this.startSubject.next();
            this.connectionSubject.next(true);
            this.heartbeat();
            resolve();
          }
        },
        closeObserver: { next: reject },
        serializer: Client.pack,
        deserializer: event => Client.unpack(event.data)
      });

      this.webSocketSubject.subscribe(
        message => this.handleMessage(message),
        error => this.handleError(error),
        () => this.handleClose
      );
    });
  }

  private handleMessage(data: string): void {
    this.messageSubject.next(data);
    this.connectionSubject.next(true);
  }

  private handleError(err: Error): void {
    this.handleClose();
    this.errorSubject.next(err);
  }

  private handleClose(): void {
    this.closeSubject.next();

    // Handled by promise rejection if never started.
    const hasStarted = this.connectionSubject.value;
    if (hasStarted) {
      this.connectionSubject.next(false);

      if (this.shouldReconnect) {
        this.start();
      }
    }
  }

  private heartbeat(): void {
    interval(36e4)
      .pipe(
        flatMap(() => this.connectionSubject),
        takeWhile(identity)
      )
      .subscribe(() => this.send('u'));
  }

  private static pack(content: string): ArrayBuffer {
    const buffer = Buffer.from(content);
    const array = Uint8Array.from(buffer);

    if (array.length > 256) {
      const deflatedData = pako.gzip(content);
      const deflatedArray = new Uint8Array(deflatedData.length + 1);
      deflatedArray[0] = 1;
      deflatedArray.set(deflatedData, 1);
      return deflatedArray.buffer;
    } else {
      return array.buffer;
    }
  }

  private static unpack(data: ArrayBuffer): string {
    const array = new Uint8Array(data);

    if (array[0] === 1) {
      return pako.inflate(array.slice(1), { to: 'string' });
    } else {
      return Buffer.from(data).toString('utf8');
    }
  }
}

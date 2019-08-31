import pako from 'pako';
import { BehaviorSubject, defer, identity, interval, noop } from 'rxjs';
import {
  flatMap,
  retry,
  skipWhile,
  take,
  takeWhile,
  timeout
} from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import WebSocket from 'ws';

export class Client {
  private webSocketSubject!: WebSocketSubject<string>;
  private readonly connectionSubject: BehaviorSubject<boolean>;

  constructor(
    private onMessageCallback: (content: string) => void,
    private onErrorCallback: (err: Error) => void
  ) {
    this.connectionSubject = new BehaviorSubject<boolean>(false);
  }

  public async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.webSocketSubject = webSocket({
        url: 'wss://m.iirose.com:443',
        binaryType: 'arraybuffer',
        WebSocketCtor: WebSocket,
        openObserver: {
          next: () => {
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
        message => this.onMessage(message),
        error => this.onError(error),
        () => this.onClose
      );
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

  private onMessage(data: string): void {
    this.connectionSubject.next(true);
    this.onMessageCallback(data);
  }

  private onError(err: Error): void {
    this.onClose();
    this.onErrorCallback(err);
  }

  private onClose(): void {
    this.connectionSubject.next(false);

    defer(this.start)
      .pipe(retry(3))
      .subscribe(noop, this.onErrorCallback);
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

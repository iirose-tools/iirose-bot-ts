import pako from 'pako';
import ReconnectingWebSocket, { ErrorEvent } from 'reconnecting-websocket';
import { Subject, Subscription } from 'rxjs';
import WebSocket from 'ws';

export class Client {
  private socket: ReconnectingWebSocket;

  private readonly startSubject: Subject<void>;
  private readonly closeSubject: Subject<void>;
  private readonly errorSubject: Subject<any>;
  private readonly messageSubject: Subject<string>;

  constructor(retryAttempts?: number) {
    this.socket = new ReconnectingWebSocket('wss://m.iirose.com:443', [], {
      WebSocket,
      startClosed: true,
      maxRetries: retryAttempts
    });
    this.socket.binaryType = 'arraybuffer';

    this.startSubject = new Subject();
    this.closeSubject = new Subject();
    this.errorSubject = new Subject();
    this.messageSubject = new Subject();
  }

  public async start(): Promise<void> {
    return new Promise(resolve => {
      this.socket.reconnect();

      let interval: NodeJS.Timeout | null = null;

      this.socket.onopen = () => {
        this.startSubject.next();
        interval = this.heartbeat();

        resolve();
      };

      this.socket.onclose = () => {
        if (interval) {
          clearInterval(interval);
          interval = null;
        }

        this.handleClose();
      };

      this.socket.onerror = event => {
        this.handleError(event);
      };

      this.socket.onmessage = event => {
        const unpacked = Client.unpack(event.data);
        this.handleMessage(unpacked);
      };
    });
  }

  public send(data: string): void {
    const packed = Client.pack(data);
    this.socket.send(packed);
  }

  public close(): void {
    this.socket.close();
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

  private handleMessage(data: string): void {
    this.messageSubject.next(data);
  }

  private handleError(err: ErrorEvent): void {
    this.handleClose();
    this.errorSubject.next(err);
  }

  private handleClose(): void {
    this.closeSubject.next();
  }

  private heartbeat(): NodeJS.Timeout {
    return setInterval(() => {
      this.socket.send('');
    }, 12e4);
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

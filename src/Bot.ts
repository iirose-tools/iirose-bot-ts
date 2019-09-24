import { Subject } from 'rxjs';
import { Client } from './Client';
import { Event, EventTypeOf } from './events';
import { switchRoomHandler } from './handlers';
import { parseEvents } from './parser';
import {
  AuthService,
  MessageService,
  RoomService,
  UserService,
  WithServices
} from './services';
import { roomStore, userStore } from './stores';

interface BaseBotOptions {
  username: string;
  password: string;
  roomId?: string;
  color?: string;
}

type Unsubscriber = () => void;

export class Bot extends WithServices(
  AuthService,
  MessageService,
  RoomService,
  UserService
) {
  public readonly username: string;
  private readonly password: string;
  public roomId: string;
  public readonly color: string;

  protected readonly client: Client;

  private readonly messageSubject: Subject<string>;
  private handlers: Array<(event: Event) => any>;

  constructor(options: BaseBotOptions) {
    const messageSubject = new Subject<string>();
    const client = new Client(
      () => this.onStart(),
      message => messageSubject.next(message),
      error => console.error(error)
    );

    super(client);

    this.username = options.username;
    this.password = options.password;
    this.roomId = options.roomId || '5b792977089e7';
    this.color = options.color || 'f0f0f0';

    this.client = client;
    this.messageSubject = messageSubject;
    this.handlers = [];
  }

  public async start(): Promise<void> {
    const { updateUsersHandler } = userStore();
    const { updateRoomsHandler } = roomStore();

    this.subscribe(switchRoomHandler(this));
    this.on('BOT_SWITCH_ROOM', event => this.onSwitchRoom(event));
    this.subscribe(updateUsersHandler);
    this.subscribe(updateRoomsHandler);

    this.messageSubject.subscribe(message => this.onMessage(message));

    await this.client.start();
  }

  public on<T extends Event['type']>(
    type: T,
    handler: (event: EventTypeOf<T>) => any
  ): void {
    this.subscribe(async event => {
      if (event.type === type) {
        await handler(event as EventTypeOf<T>);
      }
    });
  }

  public awaitEvent<E extends Event['type']>(
    eventType: E
  ): Promise<EventTypeOf<E>>;
  public awaitEvent<E extends Event['type']>(
    eventType: E,
    timeout: number
  ): Promise<EventTypeOf<E> | null>;
  public awaitEvent<E extends Event>(
    checker: (event: E) => boolean
  ): Promise<E>;
  public awaitEvent<E extends Event>(
    checker: (event: E) => boolean,
    timeout: number
  ): Promise<E | null>;
  public awaitEvent(
    checker: Event['type'] | ((event: Event) => boolean),
    timeout?: number
  ): Promise<Event | null> {
    let unsubscribe: () => void;

    if (typeof checker !== 'function') {
      return this.awaitEvent(
        (event: Event) => event.type === checker,
        timeout as number
      );
    }

    const awaitPromise = new Promise<Event>(resolve => {
      unsubscribe = this.subscribe(event => {
        if (checker(event)) {
          resolve(event);
        }
      });
    });

    if (timeout) {
      const timeoutPromise = new Promise<null>(resolve =>
        setTimeout(() => {
          resolve(null);
          unsubscribe();
        }, timeout)
      );

      return Promise.race<Event | null>([awaitPromise, timeoutPromise]);
    }

    return awaitPromise;
  }

  public subscribe(handler: (event: Event) => any): Unsubscriber {
    this.handlers = [...this.handlers, handler];
    return () => {
      this.handlers = this.handlers.filter(fn => fn !== handler);
    };
  }

  private async onStart(): Promise<void> {
    await this.login({
      username: this.username,
      password: this.password,
      roomId: this.roomId
    });

    await this.awaitEvent(
      event =>
        event.type === 'UPDATE_ROOM_STORE' || event.type === 'UPDATE_USER_STORE'
    );
  }

  private async onMessage(content: string): Promise<void> {
    const oldRoomId = this.roomId;
    const events = parseEvents(this, content);

    for (const event of events) {
      if (this.roomId !== oldRoomId) {
        break;
      }

      for (const handler of this.handlers) {
        await handler(event);
      }
    }
  }

  private async onSwitchRoom(
    event: EventTypeOf<'BOT_SWITCH_ROOM'>
  ): Promise<void> {
    if (this.roomId !== event.targetRoomId) {
      this.roomId = event.targetRoomId;
      await this.switchRoom({ targetRoomId: event.targetRoomId });
      await this.client.close();
      await this.client.start();
    }
  }
}

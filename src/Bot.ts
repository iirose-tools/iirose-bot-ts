import { Subject } from 'rxjs';
import { Client } from './Client';
import {
  BaseEvent,
  BotChangeRoomEvent,
  UpdateRoomsEvent,
  UpdateUsersEvent
} from './events';
import { parseEvents } from './parser';
import {
  AuthService,
  MessageService,
  RoomService,
  UserService,
  WithServices
} from './services';
import { roomStore, userStore } from './stores';
import { Type } from './utils/types';

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
  private handlers: Array<(event: BaseEvent) => any>;

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

    this.on(BotChangeRoomEvent, event => this.onSwitchRoom(event));
    this.subscribe(updateUsersHandler);
    this.subscribe(updateRoomsHandler);

    this.messageSubject.subscribe(message => this.onMessage(message));

    await this.client.start();
  }

  public on<E extends BaseEvent>(
    EventType: Type<E>,
    handler: (event: E) => any
  ): void {
    this.subscribe(async event => {
      if (event instanceof EventType) {
        await handler(event as E);
      }
    });
  }

  public awaitEvent<E extends Type<BaseEvent>>(eventTypes: E[]): Promise<E>;
  public awaitEvent<E extends Type<BaseEvent>>(
    eventTypes: E[],
    timeout: number
  ): Promise<E | null>;
  public awaitEvent<E extends BaseEvent>(
    checker: (event: BaseEvent) => event is E
  ): Promise<E>;
  public awaitEvent<E extends BaseEvent>(
    checker: (event: BaseEvent) => event is E,
    timeout: number
  ): Promise<E | null>;
  public awaitEvent(checker: (event: BaseEvent) => boolean): Promise<BaseEvent>;
  public awaitEvent(
    checker: (event: BaseEvent) => boolean,
    timeout: number
  ): Promise<BaseEvent | null>;
  public awaitEvent<E extends BaseEvent>(
    eventTypesOrChecker:
      | Array<Type<E>>
      | ((event: BaseEvent) => event is E)
      | ((event: BaseEvent) => boolean),
    timeout?: number
  ): Promise<E | null> {
    let unsubscribe: () => void;

    if (Array.isArray(eventTypesOrChecker)) {
      return this.awaitEvent<E>(
        (event: BaseEvent): event is E => {
          for (const EventType of eventTypesOrChecker) {
            if (event instanceof EventType) {
              return true;
            }
          }

          return false;
        },
        timeout as number
      );
    }

    const awaitPromise = new Promise<E>(resolve => {
      unsubscribe = this.subscribe(event => {
        if (eventTypesOrChecker(event)) {
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

      return Promise.race<E | null>([awaitPromise, timeoutPromise]);
    }

    return awaitPromise;
  }

  public subscribe(handler: (event: BaseEvent) => any): Unsubscriber {
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

    await this.awaitEvent([UpdateRoomsEvent, UpdateUsersEvent]);
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

  private async onSwitchRoom(event: BotChangeRoomEvent): Promise<void> {
    if (this.roomId !== event.targetRoomId) {
      this.roomId = event.targetRoomId;
      await this.switchRoom({ targetRoomId: event.targetRoomId });
      await this.client.close();
      await this.client.start();
    }
  }
}

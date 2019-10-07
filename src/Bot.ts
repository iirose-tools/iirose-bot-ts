import { Client } from './Client';
import { EventEmitter } from './emitter/EventEmitter';
import {
  BaseEvent,
  BotChangeRoomEvent,
  ClientConnectedEvent,
  UpdateRoomsEvent,
  UpdateUsersEvent
} from './events';
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
  protected readonly eventEmitter: EventEmitter;

  constructor(options: BaseBotOptions) {
    const client = new Client();
    super(client);

    this.username = options.username;
    this.password = options.password;
    this.roomId = options.roomId || '5b792977089e7';
    this.color = options.color || 'f0f0f0';

    this.client = client;
    this.eventEmitter = new EventEmitter(this, client);
  }

  public async start(): Promise<void> {
    const { updateUsersHandler } = userStore();
    const { updateRoomsHandler } = roomStore();

    this.on(BotChangeRoomEvent, event => this.onSwitchRoom(event));
    this.subscribe(updateUsersHandler);
    this.subscribe(updateRoomsHandler);

    await this.client.start();
    await this.onStart();
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

  public subscribe(handler: (event: BaseEvent) => void): Unsubscriber {
    const subscription = this.eventEmitter.onEvent(handler);
    return () => {
      subscription.unsubscribe();
    };
  }

  private async onStart(): Promise<void> {
    await this.login({
      username: this.username,
      password: this.password,
      roomId: this.roomId
    });

    await this.awaitEvent([UpdateRoomsEvent, UpdateUsersEvent]);
    this.on(ClientConnectedEvent, () => this.onStart());
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

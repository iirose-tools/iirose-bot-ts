import * as botEvents from '../events/bot';
import * as messageEvents from '../events/message';
import * as updateEvents from '../events/update';
import * as userEvents from '../events/user';

type BotEvent = EventMapType<typeof botEvents>;
type MessageEvent = EventMapType<typeof messageEvents>;
type UpdateEvent = EventMapType<typeof updateEvents>;
type UserEvent = EventMapType<typeof userEvents>;

export type Event = BotEvent | MessageEvent | UpdateEvent | UserEvent;

export type EventTypeOf<T extends Event['type']> = Event extends infer E
    ? E extends Event
        ? E['type'] extends T
            ? E
            : never
        : never
    : never;

export const createEvent = <T extends string>(type: T) => <
    P extends object
>() => (payload: Readonly<P>) => ({ type, ...payload });

type EventMapType<T> = T extends EventCreatorMap
    ? { [K in keyof T]: ReturnType<T[K]> }[keyof T]
    : never;

type EventCreator = (payload: any) => { type: string };
type EventCreatorMap = Readonly<{ [key: string]: EventCreator }>;

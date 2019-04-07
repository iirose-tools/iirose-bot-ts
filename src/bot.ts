import { Api, api } from './api';
import { client } from './client';
import { Event, EventTypeOf } from './events';
import { switchRoomHandler } from './handlers';
import { parseEvents } from './parser';
import { RoomStore, roomStore, UserStore, userStore } from './stores';

export type Bot = BotData & Api & UserStore & RoomStore;

type BotData = Readonly<{
    username: string;
    color: string;
    roomId: () => string;

    awaitEvent: <
        C extends Event['type'] | ((event: Event) => boolean),
        T extends number | undefined = undefined
    >(
        checker: C,
        timeout?: T
    ) => Promise<
        (T extends undefined ? never : null) extends infer N
            ? C extends Event['type']
                ? EventTypeOf<C> | N
                : Event | N
            : never
    >;

    on: <T extends Event['type']>(
        type: T,
        handler: (event: EventTypeOf<T>) => any
    ) => void;

    switchRoom: (
        targetRoomId: string,
        roomPassword?: string | undefined
    ) => Promise<void>;

    subscribe: (listener: (event: Event) => any) => () => void;

    stop: () => Promise<void>;
}>;

export const iiroseBot = async ({
    username,
    password,
    roomId = '5b792977089e7',
    color = 'f0f0f0'
}: {
    username: string;
    password: string;
    roomId?: string;
    color?: string;
}): Promise<Bot> => {
    let handlers: Array<(event: Event) => any> = [];

    let botRoomId = roomId;

    const onStart = async () => {
        await bot.login(username, password, botRoomId);
        await bot.awaitEvent(
            event =>
                event.type === 'UPDATE_ROOM_STORE' ||
                event.type === 'UPDATE_USER_STORE'
        );
    };

    const onMessage = async (content: string) => {
        const oldRoomId = botRoomId;
        const events = parseEvents(bot, content);

        for (const event of events) {
            if (botRoomId !== oldRoomId) {
                break;
            }

            for (const handler of handlers) {
                await handler(event);
            }
        }
    };

    const onError = (err: Error) => console.error(err);

    const botClient = await client(onMessage, onError);
    const botApi = api(botClient);

    const { updateUsersHandler, api: userStoreApi } = userStore();
    const { updateRoomsHandler, api: roomStoreApi } = roomStore();

    const bot: Bot = {
        ...botApi,

        ...userStoreApi,
        ...roomStoreApi,

        username,
        color,
        roomId: () => botRoomId,

        // @ts-ignore
        awaitEvent: async (
            checker: Event['type'] | ((event: Event) => boolean),
            timeout?: number
        ) => {
            let unsubscribe: () => void;

            if (typeof checker !== 'function') {
                return bot.awaitEvent(
                    (event: Event) => event.type === checker,
                    timeout
                );
            }

            const awaitPromise = new Promise<Event>(resolve => {
                unsubscribe = bot.subscribe(event => {
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

                return Promise.race<Event | null>([
                    awaitPromise,
                    timeoutPromise
                ]);
            }

            return awaitPromise;
        },

        on: <T extends Event['type']>(
            type: T,
            handler: (event: EventTypeOf<T>) => any
        ) => {
            bot.subscribe(async event => {
                if (event.type === type) {
                    // @ts-ignore
                    await handler(event);
                }
            });
        },

        switchRoom: async (targetRoomId: string, roomPassword?: string) => {
            botRoomId = targetRoomId;

            await botApi.switchRoom(targetRoomId, roomPassword);
            await botClient.restart();

            await onStart();
        },

        subscribe: (handler: (event: Event) => any) => {
            handlers = [...handlers, handler];
            return () => {
                handlers = handlers.filter(fn => fn !== handler);
            };
        },

        stop: async () => {
            await botClient.stop();
        }
    };

    bot.subscribe(switchRoomHandler(bot));
    bot.subscribe(updateUsersHandler);
    bot.subscribe(updateRoomsHandler);

    await onStart();

    return bot;
};

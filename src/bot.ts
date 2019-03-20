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

    awaitEvent: (
        checker: (event: Event) => boolean,
        timeout?: number
    ) => Promise<Event | null>;

    on: <T extends Event['type']>(
        type: T,
        handler: (event: EventTypeOf<T>) => any
    ) => void;

    switchRoom: (targetRoomId: string) => Promise<void>;

    subscribe: (listener: (event: Event) => any) => () => void;
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

    const onMessage = async (content: string) => {
        const oldRoomId = botRoomId;
        const events = parseEvents(bot, content);

        for (const handler of handlers) {
            if (botRoomId !== oldRoomId) {
                break;
            }

            for (const event of events) {
                await handler(event);
            }
        }
    };

    const onError = (err: Error) => console.error(err);

    const botClient = await client(onMessage, onError);

    const { updateUsersHandler, api: userStoreApi } = userStore();
    const { updateRoomsHandler, api: roomStoreApi } = roomStore();

    const bot = {
        ...api(botClient),

        ...userStoreApi,
        ...roomStoreApi,

        username,
        color,
        roomId: () => botRoomId,

        awaitEvent: async (
            checker: (event: Event) => boolean,
            timeout?: number
        ) => {
            let unsubscribe: () => void;

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
            bot.subscribe(event => {
                if (event.type === type) {
                    // @ts-ignore
                    handler(event);
                }
            });
        },

        switchRoom: async (targetRoomId: string) => {
            botRoomId = targetRoomId;

            await botClient.restart();
            await bot.login(username, password, botRoomId);
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

    await bot.login(username, password, botRoomId);

    return bot;
};

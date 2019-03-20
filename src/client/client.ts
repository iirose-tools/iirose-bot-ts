import pako from 'pako';
import WebSocket = require('ws');
import { webSocket } from './websocket';

export type Client = ReturnType<typeof client> extends Promise<infer U>
    ? Readonly<U>
    : never;

export const client = async (
    onMessage: (content: string) => void,
    onError: (err: Error) => void
) => {
    let socket: WebSocket;
    let getWs: () => Promise<WebSocket>;

    const connect = async () => {
        let promises: Array<(ws: WebSocket) => void> = [];

        getWs = async () =>
            new Promise<WebSocket>(resolve => {
                promises = [...promises, resolve];
            });

        socket = await webSocket({
            onMessage: data => {
                if (data instanceof ArrayBuffer) {
                    const content = unpack(data);
                    onMessage(content);
                }
            },
            onError,
            onClose: connect
        });

        getWs = async () => socket;
        promises.forEach(resolve => resolve(socket));
    };

    await connect();

    const heartbeat = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send('u');
        }
    }, 36e4);

    return {
        restart: async () => {
            socket.removeAllListeners();
            socket.on('error', () => null);
            socket.close(1001);

            await connect();
        },

        send: async (content: string) => {
            const ws = await getWs();
            await new Promise((resolve, reject) => {
                ws.send(pack(content), err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        },

        stop: async () => {
            clearInterval(heartbeat);

            if (socket.readyState === WebSocket.OPEN) {
                socket.removeAllListeners();
                await new Promise(resolve => {
                    socket.on('error', () => null);
                    socket.on('close', resolve);
                    socket.close(1001);
                });
            }
        }
    };
};

const pack = (content: string): Uint8Array => {
    const buffer = Buffer.from(content);
    const array = Uint8Array.from(buffer);

    if (array.length > 256) {
        const deflatedData = pako.gzip(content);
        const deflatedArray = new Uint8Array(deflatedData.length + 1);
        deflatedArray[0] = 1;
        deflatedArray.set(deflatedData, 1);
        return deflatedArray;
    } else {
        return array;
    }
};

const unpack = (data: ArrayBuffer): string => {
    const array = new Uint8Array(data);

    if (array[0] === 1) {
        return pako.inflate(array.slice(1), { to: 'string' });
    } else {
        return Buffer.from(array).toString('utf8');
    }
};

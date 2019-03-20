import WebSocket = require('ws');

export const webSocket = (callbacks: {
    onMessage: (data: WebSocket.Data) => void;
    onError: (err: Error) => void;
    onClose: (code: number, reason: string) => void;
}): Promise<WebSocket> =>
    new Promise<WebSocket>((resolve, reject) => {
        const ws = new WebSocket('wss://m.iirose.com/');
        ws.binaryType = 'arraybuffer';

        ws.on('open', () => {
            ws.removeAllListeners();

            ws.on('message', callbacks.onMessage);
            ws.on('error', callbacks.onError);
            ws.on('close', callbacks.onClose);

            resolve(ws);
        });

        ws.on('error', err => {
            ws.removeAllListeners();
            reject(err);
        });
    });

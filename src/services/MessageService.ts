import { Client } from '../Client';
import { Constructor } from '../utils/types';
import { uniqueId } from '../utils/uniqueId';

export interface CreateMessageOptions {
  content: string;
  color: string;
}

export const MessageService = (Base: Constructor) => {
  let botClient: Client;

  return class extends Base {
    constructor(client: Client) {
      super(client);
      botClient = client;
    }

    public async createMessage(options: CreateMessageOptions): Promise<void> {
      const data = {
        m: options.content,
        mc: options.color,
        i: uniqueId()
      };

      await botClient.send(JSON.stringify(data));
    }
  };
};

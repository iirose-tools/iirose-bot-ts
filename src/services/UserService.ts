import { Client } from '../Client';
import { Constructor } from '../utils/types';
import { uniqueId } from '../utils/uniqueId';

export interface SendPmOptions {
  userId: string;
  content: string;
  color: string;
}

export const UserService = (Base: Constructor) => {
  let botClient: Client;

  return class extends Base {
    constructor(client: Client) {
      super(client);
      botClient = client;
    }

    public async sendPm(options: SendPmOptions): Promise<void> {
      const data = {
        g: options.userId,
        m: options.content,
        mc: options.color,
        i: uniqueId()
      };

      await botClient.send(JSON.stringify(data));
    }

    public async likeUser(username: string): Promise<void> {
      await botClient.send(`+*${username.toLowerCase()}`);
    }

    public async followUser(username: string): Promise<void> {
      await botClient.send(`+#0${username.toLowerCase()}`);
    }

    public async unfollowUser(username: string): Promise<void> {
      await botClient.send(`+#1${username.toLowerCase()}`);
    }
  };
};

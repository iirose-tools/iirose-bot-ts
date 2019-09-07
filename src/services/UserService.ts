import { Client } from '../Client';
import { uniqueId } from '../utils/uniqueId';

export interface SendPmOptions {
  userId: string;
  content: string;
  color: string;
}

export class UserService {
  protected readonly client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  public async sendPm(options: SendPmOptions): Promise<void> {
    const data = {
      g: options.userId,
      m: options.content,
      mc: options.color,
      i: uniqueId()
    };

    await this.client.send(JSON.stringify(data));
  }

  public async likeUser(username: string): Promise<void> {
    await this.client.send(`+*${username.toLowerCase()}`);
  }

  public async followUser(username: string): Promise<void> {
    await this.client.send(`+#0${username.toLowerCase()}`);
  }

  public async unfollowUser(username: string): Promise<void> {
    await this.client.send(`+#1${username.toLowerCase()}`);
  }
}

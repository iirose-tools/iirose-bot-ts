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

  public searchUserById(userId: string): void {
    this.client.send(`=--${userId.toLowerCase()}`);
  }

  public getUserProfile(username: string): void {
    this.client.send(`++${username.toLowerCase()}`);
  }

  public sendPm(options: SendPmOptions): void {
    const data = {
      g: options.userId,
      m: options.content,
      mc: options.color,
      i: uniqueId()
    };

    this.client.send(JSON.stringify(data));
  }

  public likeUser(username: string): void {
    this.client.send(`+*${username.toLowerCase()}`);
  }

  public followUser(username: string): void {
    this.client.send(`+#0${username.toLowerCase()}`);
  }

  public unfollowUser(username: string): void {
    this.client.send(`+#1${username.toLowerCase()}`);
  }
}

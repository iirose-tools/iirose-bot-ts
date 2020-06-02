import { Bot } from '../../Bot';
import { User } from '../user';

export interface PrivateMessageOptions {
  id: string;
  user: User;
  timestamp: number;
  content: string;
  color: string;
}

export class PrivateMessage {
  public bot: Bot;

  public id: string;
  public user: User;
  public timestamp: number;
  public content: string;
  public color: string;

  constructor(bot: Bot, options: PrivateMessageOptions) {
    this.bot = bot;

    this.id = options.id;
    this.user = options.user;
    this.timestamp = options.timestamp;
    this.content = options.content;
    this.color = options.color;
  }

  public async reply(content: string): Promise<void> {
    await this.user.pm(content);
  }
}

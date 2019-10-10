import { Bot } from '../../Bot';
import { User } from '../user';

export interface PrivateMessageOptions {
  id: string;
  user: User;
  content: string;
  color: string;
}

export class PrivateMessage {
  public bot: Bot;

  public id: string;
  public user: User;
  public content: string;
  public color: string;

  constructor(bot: Bot, options: PrivateMessageOptions) {
    this.bot = bot;

    this.id = options.id;
    this.user = options.user;
    this.content = options.content;
    this.color = options.color;
  }
}

import { Bot } from '../../Bot';

export interface AnonymousPrivateMessageOptions {
  id: string;
  timestamp: number;
  content: string;
}

export class AnonymousPrivateMessage {
  public bot: Bot;

  public id: string;
  public timestamp: number;
  public content: string;

  constructor(bot: Bot, options: AnonymousPrivateMessageOptions) {
    this.bot = bot;

    this.id = options.id;
    this.timestamp = options.timestamp;
    this.content = options.content;
  }
}

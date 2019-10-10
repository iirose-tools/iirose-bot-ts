import { Bot } from '../../Bot';

export interface AnonymousPrivateMessageOptions {
  id: string;
  content: string;
}

export class AnonymousPrivateMessage {
  public bot: Bot;

  public id: string;
  public content: string;

  constructor(bot: Bot, options: AnonymousPrivateMessageOptions) {
    this.bot = bot;

    this.id = options.id;
    this.content = options.content;
  }
}

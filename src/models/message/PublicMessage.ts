import { Bot } from '../../Bot';
import { User } from '../user';
import { ReferredMessage } from './ReferredMessage';

export interface PublicMessageOptions {
  id: string;
  user: User;
  timestamp: number;
  content: string;
  color: string;
  referredMessages: ReferredMessage[];
}

export class PublicMessage {
  public bot: Bot;

  public id: string;
  public user: User;
  public timestamp: number;
  public content: string;
  public color: string;
  public referredMessages: ReferredMessage[];

  constructor(bot: Bot, options: PublicMessageOptions) {
    this.bot = bot;

    this.id = options.id;
    this.user = options.user;
    this.timestamp = options.timestamp;
    this.content = options.content;
    this.color = options.color;
    this.referredMessages = options.referredMessages;
  }

  public getMentions(): string[] {
    return Array.from(this.content.match(/ \[\*([^<>'"\n]+?)\*] /g) || []);
  }
}

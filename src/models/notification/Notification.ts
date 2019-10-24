import { Bot } from '../../Bot';
import { NotificationUser } from './NotificationUser';

export interface NotificationOptions {
  timestamp: number;
  user: NotificationUser;
  cartTagImage: string;
}

export class Notification {
  public bot: Bot;

  public timestamp: number;
  public user: NotificationUser;
  public cartTagImage: string;

  constructor(bot: Bot, options: NotificationOptions) {
    this.bot = bot;

    this.timestamp = options.timestamp;
    this.user = options.user;
    this.cartTagImage = options.cartTagImage;
  }
}

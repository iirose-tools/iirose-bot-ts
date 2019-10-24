import { Bot } from '../../Bot';
import { Notification, NotificationOptions } from './Notification';

export interface ReceiveGoldNotificationOptions extends NotificationOptions {
  amount: number;
}

export class ReceiveGoldNotification extends Notification {
  public amount: number;

  constructor(bot: Bot, options: ReceiveGoldNotificationOptions) {
    super(bot, options);

    this.amount = options.amount;
  }
}

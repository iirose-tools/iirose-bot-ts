import { ReceiveGoldNotification } from '../../models';
import { NotificationEvent } from './NotificationEvent';

export interface ReceiveGoldNotificationEventOptions {
  notification: ReceiveGoldNotification;
}

export class ReceiveGoldNotificationEvent extends NotificationEvent {
  public notification: ReceiveGoldNotification;

  constructor(options: ReceiveGoldNotificationEventOptions) {
    super();

    this.notification = options.notification;
  }
}

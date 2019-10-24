import { Bot } from '../Bot';
import { BaseEvent, ReceiveGoldNotificationEvent } from '../events';
import {
  NotificationUser,
  ReceiveGoldNotification,
  UserGender
} from '../models';
import { decodeEntities } from '../utils/entities';
import { USER_GENDERS } from './constants';

export function* parseNotifications(
  bot: Bot,
  data: string
): IterableIterator<BaseEvent> {
  if (data[0] === '@') {
    if (data[1] === '*') {
      const notificationsData = data.substr(2).split('<');

      for (const notificationData of notificationsData) {
        yield* parseNotification(bot, notificationData);
      }
    }
  }
}

function* parseNotification(
  bot: Bot,
  data: string
): IterableIterator<BaseEvent> {
  const [
    username,
    avatar,
    gender,
    notificationData,
    cartTagImage,
    timestamp,
    userColor
  ] = data.split('>');

  const user = new NotificationUser(bot, {
    avatar: decodeEntities(avatar),
    username: decodeEntities(username),
    color: decodeEntities(userColor),
    gender: USER_GENDERS[parseInt(gender, 10)] || UserGender.None
  });

  if (notificationData[0] === "'") {
    if (notificationData[1] === '$') {
      const amount = notificationData.substr(2);
      const notification = new ReceiveGoldNotification(bot, {
        user,
        timestamp: parseInt(timestamp, 10),
        cartTagImage: decodeEntities(cartTagImage),
        amount: parseFloat(amount)
      });

      yield new ReceiveGoldNotificationEvent({ notification });
    }
  }
}

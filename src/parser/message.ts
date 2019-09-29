import { Bot } from '../Bot';
import {
  Event,
  publicMessageEvent,
  userJoinEvent,
  userLeaveEvent,
  userSwitchRoomEvent
} from '../events';
import { PublicMessage, User, UserGender, UserRank } from '../models';
import { decodeEntities } from '../utils/entities';
import { regexScan } from '../utils/regexScan';
import { USER_GENDERS, USER_RANKS } from './constants';

export function* parseMessages(
  bot: Bot,
  data: string
): IterableIterator<Event> {
  if (/^\d/.test(data)) {
    const messagesData = data.split('"')[0];
    const messages = messagesData.split('<').reverse();

    for (const messageData of messages) {
      yield* parseMessage(bot, messageData);
    }
  }
}

function* parseMessage(bot: Bot, data: string): IterableIterator<Event> {
  const [
    timestamp,
    avatar,
    username,
    text,
    messageColor,
    userColor,
    gender,
    coverImage,
    userId,
    rank,
    messageId
  ] = data.split('>');

  const userAttributes = {
    id: userId,
    avatar: decodeEntities(avatar),
    username: decodeEntities(username),
    color: decodeEntities(userColor),
    gender: USER_GENDERS[parseInt(gender, 10)] || UserGender.None,
    rank: USER_RANKS[parseInt(rank[0], 10)] || UserRank.Other
  };

  const otherAttributes =
    coverImage.length === 0 ? {} : { coverImage: decodeEntities(coverImage) };

  if (text[0] === "'") {
    switch (text[1]) {
      case '1':
        yield userJoinEvent({
          user: new User(bot, {
            ...userAttributes,
            ...otherAttributes,
            roomId: bot.roomId
          })
        });
        break;

      case '2':
        const roomId = text.substr(2);
        yield userSwitchRoomEvent({
          user: new User(bot, {
            ...userAttributes,
            ...otherAttributes,
            roomId
          }),
          targetRoomId: roomId
        });
        break;

      case '3':
        yield userLeaveEvent({
          user: new User(bot, { ...userAttributes, ...otherAttributes })
        });
        break;
    }
  } else {
    const rawContent = decodeEntities(text);

    const referredMessageData = regexScan(
      rawContent,
      /(.*?) \(_hr\) (.*?)_(\d+) \(hr_\) /g
    );
    const referredMessages = referredMessageData.map(messageData => ({
      username: messageData[1],
      timestamp: parseInt(messageData[2], 10),
      content: messageData[0]
    }));

    let content;
    if (referredMessages.length === 0) {
      content = rawContent;
    } else {
      const last = referredMessageData[referredMessageData.length - 1];
      const index =
        `${last[0]} (_hr) ${last[1]}_${last[2]} (hr_) `.length + last.index;

      content = rawContent.substr(index);
    }

    const user = new User(bot, {
      ...userAttributes,
      roomId: bot.roomId
    });

    const message = new PublicMessage(bot, {
      id: messageId,
      user,
      timestamp: parseInt(timestamp, 10),
      content,
      color: decodeEntities(messageColor),
      referredMessages
    });

    yield publicMessageEvent({ message });
  }
}

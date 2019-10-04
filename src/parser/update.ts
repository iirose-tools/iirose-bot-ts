import { Bot } from '../Bot';
import { BaseEvent } from '../events';
import { parseRoomUpdates } from './room';
import { parseUserUpdates } from './user';

export function* parseUpdates(
  bot: Bot,
  data: string
): IterableIterator<BaseEvent> {
  if (data[0] === '%') {
    if (data[1] === '*') {
      const [
        ,
        /* pmData */
        userRoomData
        /* profileData messageData currentRoomData */
      ] = data.substr(2).split('"');

      const [userData, roomData] = userRoomData.split("'");

      yield* parseUserUpdates(bot, userData);
      yield* parseRoomUpdates(bot, roomData);
    }
  }
}

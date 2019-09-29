import { Bot } from '../Bot';
import { Event, updateUserStoreEvent } from '../events';
import { User, UserGender } from '../models';
import { decodeEntities } from '../utils/entities';
import { USER_GENDERS, USER_STATES } from './constants';

export function* parseUserUpdates(
  bot: Bot,
  data: string
): IterableIterator<Event> {
  if (data) {
    const users = data.split('<').map(userData => {
      const [
        avatar,
        gender,
        username,
        color,
        roomId /* status sign */,
        ,
        ,
        ,
        id /* client pmImage */,
        ,
        ,
        stateChar
      ] = userData.split('>').map(e => decodeEntities(e));

      return new User(bot, {
        id,
        avatar,
        username,
        color,
        roomId,
        gender: USER_GENDERS[parseInt(gender, 10)] || UserGender.None,
        state: USER_STATES[stateChar]
      });
    });

    yield updateUserStoreEvent({ users });
  }
}

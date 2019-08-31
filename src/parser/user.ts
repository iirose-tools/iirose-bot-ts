import { Bot } from '../Bot';
import { createUser } from '../data';
import { Event, updateUserStoreEvent } from '../events';
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

      return createUser({
        bot,
        id,
        avatar,
        username,
        color,
        roomId,
        gender: USER_GENDERS[parseInt(gender, 10)] || 'NONE',
        state: USER_STATES[stateChar]
      });
    });

    yield updateUserStoreEvent({ users });
  }
}

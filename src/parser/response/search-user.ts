import { Bot } from '../../Bot';
import { BaseEvent, SearchUserResponseEvent } from '../../events';
import { User, UserGender } from '../../models';
import { decodeEntities } from '../../utils/entities';
import { USER_GENDERS } from '../constants';

export function* parseSearchUserResponse(
  bot: Bot,
  data: string
): IterableIterator<BaseEvent> {
  const usersData = data.split('<');
  const foundUsers = usersData.map(userData => parseUser(bot, userData));

  yield new SearchUserResponseEvent({ foundUsers });
}

function parseUser(bot: Bot, data: string): User {
  const [username, gender, , color, avatar, id] = data.split('>');

  return new User(bot, {
    id,
    username: decodeEntities(username),
    color: decodeEntities(color),
    avatar: decodeEntities(avatar),
    gender: USER_GENDERS[parseInt(gender, 10)] || UserGender.None
  });
}

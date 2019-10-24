import { Bot } from '../../Bot';
import { BaseEvent } from '../../events';
import { parseSearchUserResponse } from './search-user';
import { parseUserProfileResponse } from './user-profile';

export function* parseResponses(
  bot: Bot,
  data: string
): IterableIterator<BaseEvent> {
  if (data[0] === '+') {
    yield* parseUserProfileResponse(bot, data.substr(1));
  } else if (data[0] === '^') {
    yield* parseSearchUserResponse(bot, data.substr(1));
  }
}

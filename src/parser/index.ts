import { Bot } from '../Bot';
import { BaseEvent } from '../events';
import { parseMessages } from './message';
import { parseNotifications } from './notification';
import { parseResponses } from './response';
import { parseSwitchRoom } from './switch-room';
import { parseUpdates } from './update';

export function* parseEvents(
  bot: Bot,
  data: string
): IterableIterator<BaseEvent> {
  yield* parseSwitchRoom(data);
  yield* parseUpdates(bot, data);
  yield* parseMessages(bot, data);
  yield* parseNotifications(bot, data);
  yield* parseResponses(bot, data);
}

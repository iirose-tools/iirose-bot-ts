import { Bot } from '../Bot';
import { BaseEvent } from '../events';
import { parseMessages } from './message';
import { parseNotifications } from './notification';
import { parseResponses } from './response';
import { parseSwitchRoom } from './switch-room';
import { parseUpdates } from './update';

export function parseEvents(
  bot: Bot,
  data: string
): Array<IterableIterator<BaseEvent>> {
  return [
    parseSwitchRoom(data),
    parseUpdates(bot, data),
    parseMessages(bot, data),
    parseNotifications(bot, data),
    parseResponses(bot, data)
  ];
}

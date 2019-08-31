import { Bot } from '../Bot';
import { Event } from '../events';
import { parseMessages } from './message';
import { parseSwitchRoom } from './switch-room';
import { parseUpdates } from './update';

export function* parseEvents(bot: Bot, data: string): IterableIterator<Event> {
  yield* parseSwitchRoom(data);
  yield* parseUpdates(bot, data);
  yield* parseMessages(bot, data);
}

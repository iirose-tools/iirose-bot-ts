import { Bot } from '../bot';
import { Event } from '../events';
import { parseMessages } from './message';
import { parseSwitchRoom } from './switch-room';
import { parseUpdates } from './update';

export const parseEvents = (bot: Bot, data: string): Event[] => [
    ...parseSwitchRoom(data),
    ...parseUpdates(bot, data),
    ...parseMessages(bot, data)
];

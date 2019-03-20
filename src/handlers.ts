import { Bot } from './bot';
import { Event } from './events';

export const switchRoomHandler = (bot: Bot) => async (event: Event) => {
    if (
        event.type === 'BOT_SWITCH_ROOM' &&
        bot.roomId() !== event.targetRoomId
    ) {
        await bot.switchRoom(event.targetRoomId);
    }
};

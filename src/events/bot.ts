import { createEvent } from './event';

export const botSwitchRoomEvent = createEvent('BOT_SWITCH_ROOM')<{
  targetRoomId: string;
}>();

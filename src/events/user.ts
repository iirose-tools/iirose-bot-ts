import { User } from '../data';
import { createEvent } from './event';

export const userJoinEvent = createEvent('USER_JOIN')<{
    user: User;
}>();

export const userSwitchRoomEvent = createEvent('USER_SWITCH_ROOM')<{
    user: User;
    targetRoomId: string;
}>();

export const userLeaveEvent = createEvent('USER_LEAVE')<{
    user: User;
}>();

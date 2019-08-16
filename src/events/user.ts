import { User } from '../data';
import { createEvent } from './event';

export const userJoinEvent = createEvent('USER_JOIN')<{
  user: User;
  coverImage?: string;
}>();

export const userSwitchRoomEvent = createEvent('USER_SWITCH_ROOM')<{
  user: User;
  targetRoomId: string;
  coverImage?: string;
}>();

export const userLeaveEvent = createEvent('USER_LEAVE')<{
  user: User;
  coverImage?: string;
}>();

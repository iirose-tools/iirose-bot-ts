import { Room, User } from '../models';
import { createEvent } from './event';

export const updateRoomStoreEvent = createEvent('UPDATE_ROOM_STORE')<{
  rooms: ReadonlyArray<Room>;
}>();

export const updateUserStoreEvent = createEvent('UPDATE_USER_STORE')<{
  users: ReadonlyArray<User>;
}>();

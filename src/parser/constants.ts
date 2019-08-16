import {
  RoomLanguage,
  RoomProtection,
  RoomType,
  UserGender,
  UserRank,
  UserState
} from '../data';

export const ROOM_TYPES: RoomType[] = [
  'ORDINARY',
  'MUSIC_SHARE',
  'VIDEO_SHARE',
  'MUSIC',
  'VIDEO'
];

export const ROOM_LANGUAGES: RoomLanguage[] = [
  'JA',
  'EN',
  'ZH-HANT',
  'ZH-HANS',
  'KO',
  'FR'
];

export const ROOM_PROTECTIONS: { [key: string]: RoomProtection } = {
  '-1': 'OPEN',
  '0': 'LOCK',
  '1': 'LOCK_HIDE_PEOPLE',
  '2': 'LOCK_HIDE_PEOPLE_AMOUNT'
};

export const USER_GENDERS: UserGender[] = ['NONE', 'MALE', 'FEMALE', 'COUPLE'];

export const USER_STATES: { [key: string]: UserState } = {
  a: { type: 'BOT' },
  '': { type: 'AWAY' },
  '*': { type: 'ENTERING' },
  '0': { type: 'ACTIVE', minutes: 8 },
  '1': { type: 'ACTIVE', minutes: 6 },
  '2': { type: 'ACTIVE', minutes: 4 },
  '3': { type: 'ACTIVE', minutes: 2 },
  '4': { type: 'ACTIVE', minutes: 0 },
  '5': { type: 'CHATTING', minutes: 8 },
  '6': { type: 'CHATTING', minutes: 6 },
  '7': { type: 'CHATTING', minutes: 4 },
  '8': { type: 'CHATTING', minutes: 2 },
  '9': { type: 'CHATTING', minutes: 0 }
};

export const USER_RANKS: UserRank[] = [
  'PETAL',
  'RECEPTIONIST',
  'WAITER',
  'PROSECUTOR',
  'BOT',
  'ADMIN',
  'ASSISTANT',
  'BOSS'
];

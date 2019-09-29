import {
  RoomLanguage,
  RoomProtection,
  RoomType,
  UserActiveState,
  UserAwayState,
  UserBotState,
  UserChattingState,
  UserEnteringState,
  UserGender,
  UserRank,
  UserState
} from '../models';

export const ROOM_TYPES: RoomType[] = [
  RoomType.Ordinary,
  RoomType.MusicShare,
  RoomType.VideoShare,
  RoomType.Music,
  RoomType.Video
];

export const ROOM_LANGUAGES: RoomLanguage[] = [
  RoomLanguage.Japanese,
  RoomLanguage.English,
  RoomLanguage.TraditionalChinese,
  RoomLanguage.SimplifiedChinese,
  RoomLanguage.Korean,
  RoomLanguage.French
];

export const ROOM_PROTECTIONS: { [key: string]: RoomProtection } = {
  '-1': RoomProtection.Open,
  '0': RoomProtection.Locked,
  '1': RoomProtection.LockedHideUsers,
  '2': RoomProtection.LockedHideUserCount
};

export const USER_GENDERS: UserGender[] = [
  UserGender.None,
  UserGender.Male,
  UserGender.Female,
  UserGender.Couple
];

export const USER_STATES: { [key: string]: UserState } = {
  a: new UserBotState(),
  '': new UserAwayState(),
  '*': new UserEnteringState(),
  '0': new UserActiveState(8),
  '1': new UserActiveState(6),
  '2': new UserActiveState(4),
  '3': new UserActiveState(2),
  '4': new UserActiveState(0),
  '5': new UserChattingState(8),
  '6': new UserChattingState(6),
  '7': new UserChattingState(4),
  '8': new UserChattingState(2),
  '9': new UserChattingState(0)
};

export const USER_RANKS: UserRank[] = [
  UserRank.Petal,
  UserRank.Receptionist,
  UserRank.Waiter,
  UserRank.Prosecutor,
  UserRank.Bot,
  UserRank.Admin,
  UserRank.Assistant,
  UserRank.Boss
];

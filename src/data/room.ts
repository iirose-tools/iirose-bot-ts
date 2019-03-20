import { Bot } from '../bot';
import { UserGender } from './user';

export type RoomProtection =
    | 'OPEN'
    | 'LOCK'
    | 'LOCK_HIDE_PEOPLE'
    | 'LOCK_HIDE_PEOPLE_AMOUNT';
export type RoomLanguage =
    | 'ALL'
    | 'JA'
    | 'EN'
    | 'ZH-HANT'
    | 'ZH-HANS'
    | 'KO'
    | 'FR';
export type RoomType =
    | 'ORDINARY'
    | 'MUSIC_SHARE'
    | 'VIDEO_SHARE'
    | 'MUSIC'
    | 'VIDEO';

type RoomData = Readonly<{
    id: string;
    path: string;
    name: string;
    color: string;
    image: string;
    description: string;
    protection: RoomProtection;
    language: RoomLanguage;
    type: RoomType;
    isWeather: boolean;
    isRolePlay: boolean;
    owner: RoomOwner;
    members: ReadonlyArray<RoomMember>;
}>;

type RoomOwner = Readonly<{
    username: string;
    avatar: string;
    gender: UserGender;
}>;

type RoomMember = Readonly<{
    username: string;
    isAdmin: boolean;
}>;

export type Room = Readonly<ReturnType<typeof createRoom>>;

export const createRoom = (data: { bot: Bot } & RoomData) => ({
    ...data
});

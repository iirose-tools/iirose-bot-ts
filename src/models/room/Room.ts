import { Bot } from '../../Bot';
import { RoomMember } from './RoomMember';
import { RoomOwner } from './RoomOwner';

export enum RoomProtection {
  Open = 'OPEN',
  Locked = 'LOCKED',
  LockedHideUsers = 'LOCKED_HIDE_USERS',
  LockedHideUserCount = 'LOCKED_HIDE_USER_COUNT'
}

export enum RoomLanguage {
  All = 'ALL',
  Japanese = 'JA',
  English = 'EN',
  TraditionalChinese = 'ZH-HANT',
  SimplifiedChinese = 'ZH-HANS',
  Korean = 'KO',
  French = 'FR'
}

export enum RoomType {
  Ordinary = 'ORDINARY',
  MusicShare = 'MUSIC_SHARE',
  VideoShare = 'VIDEO_SHARE',
  Music = 'MUSIC',
  Video = 'VIDEO'
}

export interface RoomOptions {
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
  members: RoomMember[];
}

export class Room {
  public bot: Bot;

  public id: string;
  public path: string;
  public name: string;
  public color: string;
  public image: string;
  public description: string;
  public protection: RoomProtection;
  public language: RoomLanguage;
  public type: RoomType;
  public isWeather: boolean;
  public isRolePlay: boolean;
  public owner: RoomOwner;
  public members: RoomMember[];

  constructor(bot: Bot, options: RoomOptions) {
    this.bot = bot;

    this.id = options.id;
    this.path = options.path;
    this.name = options.name;
    this.color = options.color;
    this.image = options.image;
    this.description = options.description;
    this.protection = options.protection;
    this.language = options.language;
    this.type = options.type;
    this.isWeather = options.isWeather;
    this.isRolePlay = options.isRolePlay;
    this.owner = options.owner;
    this.members = options.members;
  }
}

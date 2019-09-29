import { Bot } from '../../Bot';
import { UserState } from './UserState';

export enum UserGender {
  None = 'NONE',
  Male = 'MALE',
  Female = 'FEMALE',
  Couple = 'COUPLE'
}

export enum UserRank {
  Petal = 'PETAL',
  Receptionist = 'RECEPTIONIST',
  Waiter = 'WAITER',
  Prosecutor = 'PROSECUTOR',
  Bot = 'BOT',
  Admin = 'ADMIN',
  Assistant = 'ASSISTANT',
  Boss = 'BOSS',
  Other = 'OTHER'
}

export interface UserOptions {
  id: string;
  avatar: string;
  username: string;
  color: string;
  roomId?: string;
  gender: UserGender;
  state?: UserState;
  rank?: UserRank;
}

export class User {
  public bot: Bot;

  public id: string;
  public avatar: string;
  public username: string;
  public color: string;
  public roomId?: string;
  public gender: UserGender;
  public state?: UserState;
  public rank?: UserRank;

  constructor(bot: Bot, options: UserOptions) {
    this.bot = bot;

    this.id = options.id;
    this.avatar = options.avatar;
    this.username = options.username;
    this.color = options.color;
    this.roomId = options.roomId;
    this.gender = options.gender;
    this.state = options.state;
    this.rank = options.rank;
  }

  public getMention(): string {
    return ` [*${this.username}*]  `;
  }

  public isBot(): boolean {
    return this.rank === 'BOT' || this.username === this.bot.username;
  }

  public async like(): Promise<void> {
    await this.bot.likeUser(this.username);
  }

  public async follow(): Promise<void> {
    await this.bot.followUser(this.username);
  }

  public async unfollow(): Promise<void> {
    await this.bot.unfollowUser(this.username);
  }
}

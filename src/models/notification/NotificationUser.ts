import { Bot } from '../../Bot';
import { BaseUser } from '../generic';
import { UserGender } from '../user';

export interface NotificationUserOptions {
  avatar: string;
  username: string;
  color: string;
  gender: UserGender;
}

export class NotificationUser extends BaseUser {
  public bot: Bot;

  public avatar: string;
  public username: string;
  public color: string;
  public gender: UserGender;

  constructor(bot: Bot, options: NotificationUserOptions) {
    super();

    this.bot = bot;

    this.avatar = options.avatar;
    this.username = options.username;
    this.color = options.color;
    this.gender = options.gender;
  }
}

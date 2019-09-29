import { UserGender } from '../user';

export interface RoomOwnerOptions {
  username: string;
  avatar: string;
  gender: UserGender;
}

export class RoomOwner {
  public username: string;
  public avatar: string;
  public gender: UserGender;

  constructor(options: RoomOwnerOptions) {
    this.username = options.username;
    this.avatar = options.avatar;
    this.gender = options.gender;
  }
}

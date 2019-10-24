export interface UserCommunityRoomOptions {
  id: string;
  isAdmin: boolean;
}

export class UserCommunityRoom {
  public id: string;
  public isAdmin: boolean;

  constructor(options: UserCommunityRoomOptions) {
    this.id = options.id;
    this.isAdmin = options.isAdmin;
  }
}

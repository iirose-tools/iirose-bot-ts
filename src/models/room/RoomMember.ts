export interface RoomMemberOptions {
  username: string;
  isAdmin: boolean;
}

export class RoomMember {
  public username: string;
  public isAdmin: boolean;

  constructor(options: RoomMemberOptions) {
    this.username = options.username;
    this.isAdmin = options.isAdmin;
  }
}

import { UserEvent, UserEventOptions } from './UserEvent';

export interface UserChangeRoomEventOptions extends UserEventOptions {
  targetRoomId: string;
  coverImage?: string;
}

export class UserChangeRoomEvent extends UserEvent {
  public targetRoomId: string;
  public coverImage?: string;

  constructor(options: UserChangeRoomEventOptions) {
    super(options);

    this.targetRoomId = options.targetRoomId;
    this.coverImage = options.coverImage;
  }
}

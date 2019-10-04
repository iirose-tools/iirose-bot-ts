import { UserEvent, UserEventOptions } from './UserEvent';

export interface UserJoinEventOptions extends UserEventOptions {
  coverImage?: string;
}

export class UserJoinEvent extends UserEvent {
  public coverImage?: string;

  constructor(options: UserJoinEventOptions) {
    super(options);

    this.coverImage = options.coverImage;
  }
}

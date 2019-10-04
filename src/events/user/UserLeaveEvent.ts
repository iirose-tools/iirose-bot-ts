import { UserEvent, UserEventOptions } from './UserEvent';

export interface UserLeaveEventOptions extends UserEventOptions {
  coverImage?: string;
}

export class UserLeaveEvent extends UserEvent {
  public coverImage?: string;

  constructor(options: UserLeaveEventOptions) {
    super(options);

    this.coverImage = options.coverImage;
  }
}

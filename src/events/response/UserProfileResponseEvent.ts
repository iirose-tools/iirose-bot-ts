import { UserProfile } from '../../models';
import { ResponseEvent } from './ResponseEvent';

export interface UserProfileResponseEventOptions {
  userProfile: UserProfile;
}

export class UserProfileResponseEvent extends ResponseEvent {
  public userProfile: UserProfile;

  constructor(options: UserProfileResponseEventOptions) {
    super();

    this.userProfile = options.userProfile;
  }
}

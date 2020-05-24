import { UserProfile } from '../../models';
import { ResponseEvent } from './ResponseEvent';

export interface UserProfileResponseEventOptions {
  userProfile: UserProfile | null;
}

export class UserProfileResponseEvent extends ResponseEvent {
  public userProfile: UserProfile | null;

  constructor(options: UserProfileResponseEventOptions) {
    super();

    this.userProfile = options.userProfile;
  }
}

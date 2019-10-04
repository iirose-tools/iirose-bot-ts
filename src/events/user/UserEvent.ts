import { User } from '../../models';
import { BaseEvent } from '../BaseEvent';

export interface UserEventOptions {
  user: User;
}

export abstract class UserEvent extends BaseEvent {
  public user: User;

  constructor(options: UserEventOptions) {
    super();

    this.user = options.user;
  }
}

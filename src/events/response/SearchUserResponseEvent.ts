import { User } from '../../models';
import { ResponseEvent } from './ResponseEvent';

export interface SearchUserResponseEventOptions {
  foundUsers: User[];
}

export class SearchUserResponseEvent extends ResponseEvent {
  public foundUsers: User[];

  constructor(options: SearchUserResponseEventOptions) {
    super();

    this.foundUsers = options.foundUsers;
  }
}

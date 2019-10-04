import { User } from '../../models';
import { UpdateEvent } from './UpdateEvent';

export interface UpdateUsersEventOptions {
  users: User[];
}

export class UpdateUsersEvent extends UpdateEvent {
  public users: User[];

  constructor(options: UpdateUsersEventOptions) {
    super();

    this.users = options.users;
  }
}

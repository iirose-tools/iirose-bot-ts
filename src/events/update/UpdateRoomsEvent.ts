import { Room } from '../../models';
import { UpdateEvent } from './UpdateEvent';

export interface UpdateRoomsEventOptions {
  rooms: Room[];
}

export class UpdateRoomsEvent extends UpdateEvent {
  public rooms: Room[];

  constructor(options: UpdateRoomsEventOptions) {
    super();

    this.rooms = options.rooms;
  }
}

import { BotEvent } from './BotEvent';

export interface BotChangeRoomEventOptions {
  targetRoomId: string;
}

export class BotChangeRoomEvent extends BotEvent {
  public targetRoomId: string;

  constructor(options: BotChangeRoomEventOptions) {
    super();

    this.targetRoomId = options.targetRoomId;
  }
}

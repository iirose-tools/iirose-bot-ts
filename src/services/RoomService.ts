import { Client } from '../Client';
import { Constructor } from '../utils/types';

export interface SwitchRoomOptions {
  targetRoomId: string;
  password?: string;
}

export const RoomService = (Base: Constructor) => {
  let botClient: Client;

  return class extends Base {
    constructor(client: Client) {
      super(client);
      botClient = client;
    }

    public async switchRoom(options: SwitchRoomOptions): Promise<void> {
      await botClient.send(
        `m${options.targetRoomId}${
          options.password ? `>${options.password}` : ''
        }`
      );
    }
  };
};

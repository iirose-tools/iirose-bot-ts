import { Client } from '../Client';

export interface SwitchRoomOptions {
  targetRoomId: string;
  password?: string;
}

export class RoomService {
  protected readonly client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  public async switchRoom(options: SwitchRoomOptions): Promise<void> {
    await this.client.send(
      `m${options.targetRoomId}${
        options.password ? `>${options.password}` : ''
      }`
    );
  }
}

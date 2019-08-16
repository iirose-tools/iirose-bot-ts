import { Client } from '../client';

export const roomApi = (client: Client) => ({
  switchRoom: async (targetRoomId: string, password?: string) => {
    await client.send(`m${targetRoomId}${password ? `>${password}` : ''}`);
  }
});

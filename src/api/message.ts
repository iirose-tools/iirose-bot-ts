import { Client } from '../client';
import { generateUniqueId } from '../utils';

export const messageApi = (client: Client) => ({
  createMessage: async ({
    content,
    color
  }: {
    content: string;
    color: string;
  }) => {
    const data = {
      m: content,
      mc: color,
      i: generateUniqueId()
    };

    await client.send(JSON.stringify(data));
  }
});

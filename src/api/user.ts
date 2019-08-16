import { Client } from '../client';
import { generateUniqueId } from '../utils';

export const userApi = (client: Client) => ({
  createPm: async (userId: string, content: string, color: string) => {
    const data = {
      g: userId,
      m: content,
      mc: color,
      i: generateUniqueId()
    };

    await client.send(JSON.stringify(data));
  },

  likeUser: async (username: string) => {
    await client.send(`+*${username.toLowerCase()}`);
  },

  followUser: async (username: string) => {
    await client.send(`+#0${username.toLowerCase()}`);
  },

  unfollowUser: async (username: string) => {
    await client.send(`+#1${username.toLowerCase()}`);
  }
});

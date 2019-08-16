import { Client } from '../client';

export const authApi = (client: Client) => ({
  login: async (username: string, password: string, roomId: string) => {
    const data = {
      r: roomId,
      n: username,
      p: password,
      st: 'n',
      mo: '',
      mb: '',
      mu: '01'
    };

    await client.send(`*${JSON.stringify(data)}`);
  }
});

import { Client } from '../Client';
import { Constructor } from '../utils/types';

export interface LoginOptions {
  username: string;
  password: string;
  roomId: string;
}

export const AuthService = (Base: Constructor) => {
  let botClient: Client;

  return class extends Base {
    constructor(client: Client) {
      super(client);
      botClient = client;
    }

    public async login(options: LoginOptions): Promise<void> {
      const data = {
        r: options.roomId,
        n: options.username,
        p: options.password,
        st: 'n',
        mo: '',
        mb: '',
        mu: '01'
      };

      await botClient.send(`*${JSON.stringify(data)}`);
    }
  };
};

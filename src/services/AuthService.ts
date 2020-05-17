import { Client } from '../Client';

export interface LoginOptions {
  username: string;
  password: string;
  roomId: string;
}

export class AuthService {
  protected readonly client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  public login(options: LoginOptions): void {
    const data = {
      r: options.roomId,
      n: options.username,
      p: options.password,
      st: 'n',
      mo: '',
      mb: '',
      mu: '01'
    };

    this.client.send(`*${JSON.stringify(data)}`);
  }
}

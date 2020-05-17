import { Client } from '../Client';
import { uniqueId } from '../utils/uniqueId';

export interface CreateMessageOptions {
  content: string;
  color: string;
}

export class MessageService {
  protected readonly client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  public createMessage(options: CreateMessageOptions): void {
    const data = {
      m: options.content,
      mc: options.color,
      i: uniqueId()
    };

    this.client.send(JSON.stringify(data));
  }
}

export interface ReferredMessageOptions {
  username: string;
  timestamp: number;
  content: string;
}

export class ReferredMessage {
  public username: string;
  public timestamp: number;
  public content: string;

  constructor(options: ReferredMessageOptions) {
    this.username = options.username;
    this.timestamp = options.timestamp;
    this.content = options.content;
  }
}

import { PrivateMessage } from '../../models';
import { MessageEvent } from './MessageEvent';

export interface PrivateMessageEventOptions {
  message: PrivateMessage;
}

export class PrivateMessageEvent extends MessageEvent {
  public message: PrivateMessage;

  constructor(options: PrivateMessageEventOptions) {
    super();

    this.message = options.message;
  }
}

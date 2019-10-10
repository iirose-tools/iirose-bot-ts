import { AnonymousPrivateMessage } from '../../models';
import { MessageEvent } from './MessageEvent';

export interface AnonymousPrivateMessageOptions {
  message: AnonymousPrivateMessage;
}

export class AnonymousPrivateMessageEvent extends MessageEvent {
  public message: AnonymousPrivateMessage;

  constructor(options: AnonymousPrivateMessageOptions) {
    super();

    this.message = options.message;
  }
}

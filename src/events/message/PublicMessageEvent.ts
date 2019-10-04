import { PublicMessage } from '../../models';
import { MessageEvent } from './MessageEvent';

export interface PublicMessageEventOptions {
  message: PublicMessage;
}

export class PublicMessageEvent extends MessageEvent {
  public message: PublicMessage;

  constructor(options: PublicMessageEventOptions) {
    super();

    this.message = options.message;
  }
}

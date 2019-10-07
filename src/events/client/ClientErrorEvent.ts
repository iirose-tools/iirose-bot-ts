import { ClientEvent } from './ClientEvent';

export interface ClientErrorEventOptions {
  error: any;
}

export class ClientErrorEvent extends ClientEvent {
  public error: any;

  constructor(options: ClientErrorEventOptions) {
    super();

    this.error = options.error;
  }
}

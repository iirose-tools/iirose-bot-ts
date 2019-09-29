import { PublicMessage } from '../models';
import { createEvent } from './event';

export const publicMessageEvent = createEvent('PUBLIC_MESSAGE')<{
  message: PublicMessage;
}>();

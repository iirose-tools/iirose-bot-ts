import { PublicMessage } from '../data';
import { createEvent } from './event';

export const publicMessageEvent = createEvent('PUBLIC_MESSAGE')<{
    message: PublicMessage;
}>();

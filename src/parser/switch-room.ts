import { BaseEvent, BotChangeRoomEvent } from '../events';

export function* parseSwitchRoom(data: string): IterableIterator<BaseEvent> {
  let roomId;

  if (/^-\*/.test(data)) {
    roomId = data.substr(2).split('>')[0];
  } else if (/^%\*"s/.test(data)) {
    roomId = data.substr(4).split('>')[0];
  } else {
    return;
  }

  yield new BotChangeRoomEvent({ targetRoomId: roomId });
}

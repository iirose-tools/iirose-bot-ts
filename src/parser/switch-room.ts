import { botSwitchRoomEvent, Event } from '../events';

export const parseSwitchRoom = (data: string): Event[] => {
    let roomId;

    if (/^-\*/.test(data)) {
        roomId = data.substr(2).split('>')[0];
    } else if (/^%\*"s/.test(data)) {
        roomId = data.substr(4).split('>')[0];
    } else {
        return [];
    }

    return [botSwitchRoomEvent({ targetRoomId: roomId })];
};

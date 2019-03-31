import { Bot } from '../bot';
import { Event } from '../events';
import { parseRoomUpdates } from './room';
import { parseUserUpdates } from './user';

export const parseUpdates = (bot: Bot, data: string): Event[] => {
    if (data[0] === '%') {
        if (data[1] === '*') {
            const [
                ,
                /* pmData */
                userRoomData
                /* profileData messageData currentRoomData */
            ] = data.substr(2).split('"');

            const [userData, roomData] = userRoomData.split("'");

            return [
                ...parseUserUpdates(bot, userData),
                ...parseRoomUpdates(bot, roomData)
            ];
        }
    }

    return [];
};

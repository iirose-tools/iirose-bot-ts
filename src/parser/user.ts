import { Bot } from '../bot';
import { createUser } from '../data';
import { Event, updateUserStoreEvent } from '../events';
import { decodeEntities } from '../utils';
import { USER_GENDERS, USER_STATES } from './constants';

export const parseUserUpdates = (bot: Bot, data: string): Event[] => {
    if (!data) {
        return [];
    }

    const users = data.split('<').map(userData => {
        const [
            avatar,
            gender,
            username,
            color,
            roomId /* status sign */,
            ,
            ,
            ,
            id /* client pmImage */,
            ,
            ,
            stateChar
        ] = userData.split('>').map(e => decodeEntities(e));

        return createUser({
            bot,
            id,
            avatar,
            username,
            color,
            roomId,
            gender: USER_GENDERS[parseInt(gender, 10)] || 'NONE',
            state: USER_STATES[stateChar]
        });
    });

    return [updateUserStoreEvent({ users })];
};

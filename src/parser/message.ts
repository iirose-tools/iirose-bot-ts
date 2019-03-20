import { Bot } from '../bot';
import { createPublicMessage, createUser } from '../data';
import {
    Event,
    publicMessageEvent,
    userJoinEvent,
    userLeaveEvent,
    userSwitchRoomEvent
} from '../events';
import { decodeEntities, regexScan } from '../utils';
import { USER_GENDERS, USER_RANKS } from './constants';

export const parseMessages = (bot: Bot, data: string): Event[] => {
    if (/^\d/.test(data)) {
        const messagesData = data.split('"')[0];
        return messagesData
            .split('<')
            .reduceRight<Event[]>((array, messageData) => {
                const message = parseMessage(bot, messageData);

                return message === null ? array : [...array, message];
            }, []);
    }

    return [];
};

const parseMessage = (bot: Bot, data: string) => {
    const [
        timestamp,
        avatar,
        username,
        text,
        messageColor,
        userColor,
        gender,
        coverImage,
        userId,
        rank,
        messageId
    ] = data.split('>');

    const userAttributes = {
        bot,
        id: userId,
        avatar: decodeEntities(avatar),
        username: decodeEntities(username),
        color: decodeEntities(userColor),
        gender: USER_GENDERS[parseInt(gender, 10)] || 'NONE',
        rank: USER_RANKS[parseInt(rank[0], 10)] || 'OTHER',
        ...(coverImage.length === 0
            ? {}
            : { coverImage: decodeEntities(coverImage) })
    };

    if (text[0] === "'") {
        switch (text[1]) {
            case '1':
                return userJoinEvent({
                    user: createUser({
                        ...userAttributes,
                        roomId: bot.roomId()
                    })
                });

            case '2':
                const roomId = text.substr(2);
                return userSwitchRoomEvent({
                    user: createUser({ ...userAttributes, roomId }),
                    targetRoomId: roomId
                });

            case '3':
                return userLeaveEvent({
                    user: createUser({ ...userAttributes })
                });

            default:
                return null;
        }
    } else {
        const rawContent = decodeEntities(text);

        const referredMessageData = regexScan(
            rawContent,
            /(.*?) \(_hr\) (.*?)_(\d+) \(hr_\) /g
        );
        const referredMessages = referredMessageData.map(messageData => ({
            username: messageData[1],
            timestamp: parseInt(messageData[2], 10),
            content: messageData[0]
        }));

        let content;
        if (referredMessages.length === 0) {
            content = rawContent;
        } else {
            const last = referredMessageData[referredMessageData.length - 1];
            const index =
                `${last[0]} (_hr) ${last[1]}_${last[2]} (hr_) `.length +
                last.index;

            content = rawContent.substr(index);
        }

        const user = createUser({
            bot,
            ...userAttributes,
            roomId: bot.roomId()
        });

        const message = createPublicMessage({
            bot,
            id: messageId,
            user,
            timestamp: parseInt(timestamp, 10),
            content,
            color: decodeEntities(messageColor),
            referredMessages
        });

        return publicMessageEvent({ message });
    }
};

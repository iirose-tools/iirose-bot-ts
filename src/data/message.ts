import { Bot } from '../bot';

import { User } from './user';

type BaseMessageData = Readonly<{
    id: string;
    user: User;
    timestamp: number;
}>;

type PublicMessageData = BaseMessageData &
    Readonly<{
        content: string;
        color: string;
        referredMessages: ReadonlyArray<ReferredMessage>;
    }>;

type ReferredMessage = Readonly<{
    username: string;
    timestamp: number;
    content: string;
}>;

export type PublicMessage = Readonly<ReturnType<typeof createPublicMessage>>;

export const createPublicMessage = (
    data: { bot: Bot } & PublicMessageData
) => ({
    ...data,
    mentions: Array.from(data.content.match(/ \[\*([^<>'"\n]+?)\*] /g) || [])
});

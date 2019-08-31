import { Bot } from '../Bot';

export type UserGender = 'NONE' | 'MALE' | 'FEMALE' | 'COUPLE';
export type UserRank =
  | 'PETAL'
  | 'RECEPTIONIST'
  | 'WAITER'
  | 'PROSECUTOR'
  | 'BOT'
  | 'ADMIN'
  | 'ASSISTANT'
  | 'BOSS'
  | 'OTHER';

export type UserState =
  | Readonly<{ type: 'BOT' | 'AWAY' | 'ENTERING' }>
  | ActiveState
  | ChattingState;

type ActiveState = Readonly<{
  type: 'ACTIVE';
  minutes: 0 | 2 | 4 | 6 | 8;
}>;

type ChattingState = Readonly<{
  type: 'CHATTING';
  minutes: 0 | 2 | 4 | 6 | 8;
}>;

type UserData = Readonly<{
  id: string;
  avatar: string;
  username: string;
  color: string;
  roomId?: string;
  gender: UserGender;
  state?: UserState;
  rank?: UserRank;
}>;

export type User = Readonly<ReturnType<typeof createUser>>;

export const createUser = (data: { bot: Bot } & UserData) => ({
  ...data,

  mention: ` [*${data.username}*]  `,

  isBot: data.rank === 'BOT' || data.username === data.bot.username,

  like: async () => data.bot.likeUser(data.username),

  follow: async () => data.bot.followUser(data.username),

  unfollow: async () => data.bot.unfollowUser(data.username),

  pm: (content: string) => data.bot.createPm(data.id, content, data.bot.color)
});

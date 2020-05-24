import { Bot } from '../../Bot';
import { SearchUserResponseEvent } from '../../events';
import { User, UserGender } from './User';
import { UserCommunityRoom } from './UserCommunityRoom';

export interface UserProfileOptions {
  id: string;
  color: string;
  avatar: string;
  gender: UserGender;
  email: string;
  firstName: string;
  lastName: string;
  homePage: string;
  hobbies: string;
  friends: string;
  selfIntroduction: string;
  backgroundImage: string;
  albumImages: string[];
  lastLoginTime: number;
  visits: number;
  likes: number;
  lastLikeUserNames: string[];
  golds: number;
  ownedRoomIds: string[];
  communityRooms: UserCommunityRoom[];
  registrationTime: number;
  onlineDuration: number;
}

export class UserProfile {
  public bot: Bot;

  public id: string;
  public color: string;
  public avatar: string;
  public gender: UserGender;
  public email: string;
  public firstName: string;
  public lastName: string;
  public homePage: string;
  public hobbies: string;
  public friends: string;
  public selfIntroduction: string;
  public backgroundImage: string;
  public albumImages: string[];
  public lastLoginTime: number;
  public visits: number;
  public likes: number;
  public lastLikeUserNames: string[];
  public golds: number;
  public ownedRoomIds: string[];
  public communityRooms: UserCommunityRoom[];
  public registrationTime: number;
  public onlineDuration: number;

  private user: User | null = null;

  constructor(bot: Bot, options: UserProfileOptions) {
    this.bot = bot;

    this.id = options.id;
    this.color = options.color;
    this.avatar = options.avatar;
    this.gender = options.gender;
    this.email = options.email;
    this.firstName = options.firstName;
    this.lastName = options.lastName;
    this.homePage = options.homePage;
    this.hobbies = options.hobbies;
    this.friends = options.friends;
    this.selfIntroduction = options.selfIntroduction;
    this.backgroundImage = options.backgroundImage;
    this.albumImages = options.albumImages;
    this.lastLoginTime = options.lastLoginTime;
    this.visits = options.visits;
    this.likes = options.likes;
    this.lastLikeUserNames = options.lastLikeUserNames;
    this.golds = options.golds;
    this.ownedRoomIds = options.ownedRoomIds;
    this.communityRooms = options.communityRooms;
    this.registrationTime = options.registrationTime;
    this.onlineDuration = options.onlineDuration;
  }

  public async getUser(): Promise<User> {
    if (!this.user) {
      this.user = await this.getUserPromise();
    }

    return this.user;
  }

  private async getUserPromise(): Promise<User> {
    await this.bot.searchUserById(this.id);
    const searchEvent = await this.bot.awaitEvent(
      (event): event is SearchUserResponseEvent =>
        event instanceof SearchUserResponseEvent &&
        event.foundUsers.length === 1 &&
        event.foundUsers[0].id === this.id
    );

    return searchEvent.foundUsers[0];
  }
}

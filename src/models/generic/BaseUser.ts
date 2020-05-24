import { BehaviorSubject } from 'rxjs';
import { first, flatMap } from 'rxjs/operators';
import { Bot } from '../../Bot';
import { UserProfileResponseEvent } from '../../events';
import { UserProfile } from '../user';

export abstract class BaseUser {
  public abstract bot: Bot;
  public abstract username: string;

  private profile: UserProfile | null = null;

  private static getProfileLock: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  public async getProfile(): Promise<UserProfile | null> {
    if (!this.profile) {
      this.profile = await this.getProfilePromise();
    }

    return this.profile;
  }

  private async getProfilePromise(): Promise<UserProfile | null> {
    return BaseUser.getProfileLock
      .pipe(
        first(locked => !locked),
        flatMap(async () => {
          await this.bot.getUserProfileByUsername(this.username);
          const response = await this.bot.awaitEvent(
            [UserProfileResponseEvent],
            10000
          );

          return response ? response.userProfile : null;
        })
      )
      .toPromise();
  }
}

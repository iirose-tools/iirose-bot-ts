import { from } from 'rxjs';
import { filter, flatMap, map, timeout } from 'rxjs/operators';
import { Bot } from '../../Bot';
import { UserProfileResponseEvent } from '../../events';
import { UserProfile } from '../user';

export abstract class BaseUser {
  public abstract bot: Bot;
  public abstract username: string;

  private profile: UserProfile | null = null;

  public async getProfile(): Promise<UserProfile> {
    if (!this.profile) {
      this.profile = await this.getProfilePromise();
    }

    return this.profile;
  }

  private async getProfilePromise(): Promise<UserProfile> {
    await this.bot.getUserProfile(this.username);
    return from(this.bot.awaitEvent([UserProfileResponseEvent]))
      .pipe(
        flatMap(event =>
          from(event.userProfile.getUser()).pipe(
            map(user => [event.userProfile, user] as const)
          )
        ),
        filter(([, user]) => user.username === this.username),
        timeout(10000),
        map(([profile]) => profile)
      )
      .toPromise();
  }
}

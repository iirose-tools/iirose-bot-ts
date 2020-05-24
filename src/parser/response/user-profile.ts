import { Bot } from '../../Bot';
import { BaseEvent, UserProfileResponseEvent } from '../../events';
import { UserCommunityRoom, UserGender, UserProfile } from '../../models';
import { decodeEntities } from '../../utils/entities';
import { USER_GENDERS } from '../constants';

export function* parseUserProfileResponse(
  bot: Bot,
  data: string
): IterableIterator<BaseEvent> {
  if (data) {
    const [
      color,
      avatar,
      gender,
      id,
      email,
      firstName,
      lastName,
      ,
      ,
      homePage,
      hobbies,
      friends,
      selfIntroduction,
      backgroundImage,
      album,
      ,
      lastLoginTime,
      visits,
      ,
      ,
      likesData,
      golds,
      ,
      ,
      ownedRooms,
      communityRoomsData,
      ,
      ,
      registrationTime,
      onlineDuration
    ] = data.split('>').map(e => decodeEntities(e));

    const albumImages = album.split(' ');
    const [likes, lastLikeUserNames] = likesData.split('"');
    const ownedRoomIds = ownedRooms.split('"');
    const communityRooms = communityRoomsData.split('"').map(roomData => {
      if (roomData[0] === '@') {
        return new UserCommunityRoom({ id: roomData.substr(1), isAdmin: true });
      } else {
        return new UserCommunityRoom({ id: roomData, isAdmin: false });
      }
    });

    const userProfile = new UserProfile(bot, {
      id,
      color,
      avatar,
      gender: USER_GENDERS[parseInt(gender, 10)] || UserGender.None,
      email,
      firstName,
      lastName,
      homePage,
      hobbies,
      friends,
      selfIntroduction,
      backgroundImage,
      albumImages,
      lastLoginTime: parseInt(lastLoginTime, 10),
      visits: parseInt(visits, 10),
      likes: parseInt(likes, 10),
      lastLikeUserNames: lastLikeUserNames.split("'"),
      golds: parseFloat(golds),
      ownedRoomIds,
      communityRooms,
      registrationTime: parseInt(registrationTime, 10),
      onlineDuration: parseInt(onlineDuration, 10)
    });

    yield new UserProfileResponseEvent({ userProfile });
  } else {
    yield new UserProfileResponseEvent({ userProfile: null });
  }
}

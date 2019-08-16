import { Bot } from '../bot';
import { createRoom } from '../data';
import { Event, updateRoomStoreEvent } from '../events';
import { decodeEntities } from '../utils';
import {
  ROOM_LANGUAGES,
  ROOM_PROTECTIONS,
  ROOM_TYPES,
  USER_GENDERS
} from './constants';

export const parseRoomUpdates = (bot: Bot, data: string): Event[] => {
  if (!data) {
    return [];
  }

  const rooms = data.split('<').map(roomData => {
    const [path, name, color, attributes, protectionNum, info] = roomData.split(
      '>'
    );

    const pathArray = path.split('_');
    const id = pathArray[pathArray.length - 1];

    return createRoom({
      bot,
      id,
      path,
      name: decodeEntities(name),
      color: decodeEntities(color),
      protection: ROOM_PROTECTIONS[protectionNum] || 'OPEN',
      ...parseRoomAttributes(attributes),
      ...parseRoomInfo(info)
    });
  });

  return [updateRoomStoreEvent({ rooms })];
};

const parseRoomAttributes = (data: string) => {
  const [type, weather, rolePlay, language] = data;

  return {
    type: ROOM_TYPES[parseInt(type, 10)] || 'ORDINARY',
    isWeather: weather === '1',
    isRolePlay: rolePlay === '1',
    language: ROOM_LANGUAGES[parseInt(language, 10)] || 'ALL'
  };
};

const parseRoomInfo = (data: string) => {
  const [content, ownerName, ownerGender, ownerAvatar, memberData] = data.split(
    '&&'
  );

  const index = content.indexOf(' ');
  const image = content.substr(0, index);
  const description = content.substr(index + 1);

  const owner = {
    username: decodeEntities(ownerName),
    avatar: decodeEntities(ownerAvatar),
    gender: USER_GENDERS[parseInt(ownerGender, 10)] || 'NONE'
  };

  const members = memberData.split(' & ').map(member => ({
    username: decodeEntities(member.substr(1)),
    isAdmin: member[0] === '1'
  }));

  return {
    image: decodeEntities(image),
    description: decodeEntities(description),
    owner,
    members
  };
};

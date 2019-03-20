import { Room } from '../data';
import { Event } from '../events';

type RoomMap = Readonly<{
    [id: string]: Room | undefined;
}>;

type RoomTree = Readonly<{
    [id: string]:
        | Readonly<{
              room: Room;
              childRooms: RoomTree;
          }>
        | undefined;
}>;

export type RoomStore = Readonly<{
    getRooms: () => ReadonlyArray<Room>;
    getRoomById: (id: string) => Room | undefined;
    getChildRooms: (id: string) => RoomTree | undefined;
}>;

export const roomStore = () => {
    let rooms: ReadonlyArray<Room>;
    let roomsById: RoomMap;
    let roomTree: RoomTree;

    const addToTree = (
        tree: RoomTree,
        room: Room,
        path: string[]
    ): RoomTree => {
        const [currentId, ...childPath] = path;

        if (childPath.length === 0) {
            return {
                ...tree,
                [currentId]: { room, childRooms: {} }
            };
        } else {
            const currentSubtree = tree[currentId] || { childRooms: {} };

            return {
                ...tree,
                [currentId]: {
                    // @ts-ignore
                    room: currentSubtree.room,
                    childRooms: addToTree(
                        currentSubtree.childRooms,
                        room,
                        childPath
                    )
                }
            };
        }
    };

    return {
        updateRoomsHandler: (event: Event): void => {
            if (event.type === 'UPDATE_ROOM_STORE') {
                rooms = event.rooms;

                roomsById = rooms.reduce(
                    (res, room) => ({ ...res, [room.id]: room }),
                    {}
                );

                roomTree = rooms.reduce(
                    (res, room) => addToTree(res, room, room.path.split('_')),
                    {}
                );
            }
        },

        api: {
            getRooms: () => rooms,

            getRoomById: (id: string) => roomsById[id],

            getChildRooms: (id: string): RoomTree | undefined => {
                const room = roomsById[id];

                if (room) {
                    const path = room.path.split('_');

                    return path.reduce((tree, currentId) => {
                        const node = tree[currentId];
                        return node ? node.childRooms : {};
                    }, roomTree);
                }

                return undefined;
            }
        }
    };
};

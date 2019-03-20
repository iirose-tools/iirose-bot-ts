import { User } from '../data';
import { Event } from '../events';

type UserMap = Readonly<{ [key: string]: User | undefined }>;

export type UserStore = Readonly<{
    getUsers: () => ReadonlyArray<User>;
    getUserById: (id: string) => User | undefined;
    getUserByUsername: (username: string) => User | undefined;
}>;

export const userStore = () => {
    let users: ReadonlyArray<User>;
    let usersById: UserMap;
    let usersByUsername: UserMap;

    return {
        updateUsersHandler: (event: Event): void => {
            if (event.type === 'UPDATE_USER_STORE') {
                users = event.users;

                usersById = users.reduce(
                    (res, user) => ({ ...res, [user.id]: user }),
                    {}
                );

                usersByUsername = users.reduce(
                    (res, user) => ({ ...res, [user.username]: user }),
                    {}
                );
            }
        },

        api: {
            getUsers: () => users,
            getUserById: (id: string) => usersById[id],
            getUserByUsername: (username: string) => usersByUsername[username]
        }
    };
};

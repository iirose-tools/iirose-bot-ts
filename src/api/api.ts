import { Client } from '../client';

import { authApi } from './auth';
import { messageApi } from './message';
import { userApi } from './user';

export type Api = Readonly<ReturnType<typeof api>>;

export const api = (client: Client) => ({
    ...authApi(client),
    ...messageApi(client),
    ...userApi(client)
});

import type { profil } from '$lib/types/User';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    const user:profil = {
        userName: 'mabu2807',
        nickName: 'Marcel Bulling',
        bio: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At',
        avatar: '/default-avatar.png',
        follower: 123,
        followed: 234,
        posts: 2
    };

    return { user: user };
}) satisfies PageServerLoad;
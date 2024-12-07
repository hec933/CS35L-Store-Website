import { fetchWithAuthToken } from '@/utils/auth';

type Params = {
    followerId: string;
    followedId: string;
};

export async function getIsFollowedByShopId({
    followerId,
    followedId,
}: Params): Promise<{ data: boolean }> {
    const response = await fetchWithAuthToken(
        `/api/followers/check?followerId=${followerId}&followedId=${followedId}`,
        'GET'
    );
    return response;
}

export async function followShop(shopId: string): Promise<void> {
    await fetchWithAuthToken('/api/followers', 'POST', { shopId });
}

export async function unfollowShop(shopId: string): Promise<void> {
    await fetchWithAuthToken(`/api/followers?shopId=${shopId}`, 'DELETE');
}

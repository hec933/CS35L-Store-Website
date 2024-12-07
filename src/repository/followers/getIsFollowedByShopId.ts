import { getAuthToken } from '@/utils/auth';
import { Shop } from '@/types';
import { User } from '@/types';

type Params = {
    followerId: string;
    followedId: string;
};

//getif followed
export async function getIsFollowedByShopId({
    followerId,
    followedId,
}: Params): Promise<{ data: boolean }> {
    const token = await getAuthToken()
    const response = await fetch(
        `/api/followers/check?followerId=${followerId}&followedId=${followedId}`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    )
    if (!response.ok) throw new Error('Failed to check follow status')
    return await response.json()
}



//follow
export async function followShop(shopId: string): Promise<void> {
    const token = await getAuthToken()
    const response = await fetch('/api/followers', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ shopId })
    })
    if (!response.ok) throw new Error('Failed to follow shop')
}
//unfollow shops
export async function unfollowShop(shopId: string): Promise<void> {
    const token = await getAuthToken()
    const response = await fetch(`/api/followers?shopId=${shopId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    if (!response.ok) throw new Error('Failed to unfollow shop')
}



//get the users followed shops
export async function getFollowedShops({
    fromPage = 0,
    toPage = 1,
}: {
    fromPage?: number;
    toPage?: number;
} = {}): Promise<{ data: Shop[] }> {
    const token = await getAuthToken();
    const response = await fetch(
        `/api/followers/following?fromPage=${fromPage}&toPage=${toPage}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
    );
    if (!response.ok) throw new Error('Failed to fetch followed shops');
    return await response.json();
}




//get the followers
export async function getShopFollowers({
    shopId,
    fromPage = 0,
    toPage = 1
}: {
    shopId: string
    fromPage?: number
    toPage?: number
}): Promise<{ data: User[] }> {
    const token = await getAuthToken()
    const response = await fetch(
        `/api/followers?shopId=${shopId}&fromPage=${fromPage}&toPage=${toPage}`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    )
    if (!response.ok) throw new Error('Failed to fetch shop followers')
    return await response.json()
}




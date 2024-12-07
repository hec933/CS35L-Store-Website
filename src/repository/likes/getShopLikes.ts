import { fetchWithAuthToken } from '@/utils/auth';
import { Like } from '@/types';

type Params = {
    shopId: string;
    fromPage?: number;
    toPage?: number;
};

export async function getShopLikes({
    shopId,
    fromPage = 0,
    toPage = 1,
}: Params): Promise<{ data: Like[] }> {
    const response = await fetchWithAuthToken(
        `/api/cart?shopId=${shopId}&fromPage=${fromPage}&toPage=${toPage}`,
        'GET'
    );
    return response;
}

export async function getShopLikeCount(shopId: string): Promise<{ data: number }> {
    const response = await fetchWithAuthToken(`/api/cart/count?shopId=${shopId}`, 'GET');
    return { data: response.total };
}

export async function getIsLikedWithProductIdAndShopId({
    productId,
    shopId,
}: {
    productId: string;
    shopId: string;
}): Promise<{ data: boolean }> {
    const response = await fetchWithAuthToken(
        `/api/cart/check?productId=${productId}&shopId=${shopId}`,
        'GET'
    );
    return response;
}

export async function updateLikeQuantity({
    likeId,
    quantity,
}: {
    likeId: string;
    quantity: number;
}): Promise<void> {
    await fetchWithAuthToken(`/api/cart/${likeId}`, 'PUT', { quantity });
}

export async function addToCart(productId: string): Promise<void> {
    await fetchWithAuthToken('/api/cart', 'POST', { productId });
}

export async function removeFromCart(likeId: string): Promise<void> {
    await fetchWithAuthToken(`/api/cart/${likeId}`, 'DELETE');
}

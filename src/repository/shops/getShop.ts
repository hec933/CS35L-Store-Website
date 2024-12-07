import { Shop, Product } from '@/types';
import { fetchWithAuthToken } from '@/utils/auth';

//get a shop
export async function getShop(shopId: string): Promise<{ data: Shop }> {
    return fetchWithAuthToken(`/api/shops?id=${shopId}`, 'GET');
}

//get followers of a shop
export async function getShopFollowerCount(shopId: string): Promise<{ data: number }> {
    const response = await fetchWithAuthToken(`/api/shops/${shopId}/followers/count`, 'GET');
    return { data: response.data.total };
}

//get product quantity of a shop
export async function getShopProductCount(shopId: string): Promise<{ data: number }> {
    const response = await fetchWithAuthToken(`/api/shops/${shopId}/products/count`, 'GET');
    return { data: response.data.total };
}

//get the products of a shop
export async function getShopProducts({
    shopId,
    fromPage = 0,
    toPage = 1,
}: {
    shopId: string;
    fromPage?: number;
    toPage?: number;
}): Promise<{ data: Product[] }> {
    return fetchWithAuthToken(
        `/api/shops/${shopId}/products?fromPage=${fromPage}&toPage=${toPage}`,
        'GET'
    );
}

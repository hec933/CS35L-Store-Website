import { fetchWithAuthToken } from '@/utils/auth';

export async function getShopReviews({
    shopId,
    fromPage = 0,
    toPage = 10,
}: {
    shopId: string;
    fromPage: number;
    toPage: number;
}): Promise<{ data: any[] }> {
    const response = await fetchWithAuthToken(
        `/api/shop-reviews?shopId=${shopId}&fromPage=${fromPage}&toPage=${toPage}`,
        'GET'
    );
    return response;
}

export async function getShopReviewCount(shopId: string): Promise<{ data: number }> {
    const response = await fetchWithAuthToken(`/api/shop-reviews/count?shopId=${shopId}`, 'GET');
    return { data: response.total };
}

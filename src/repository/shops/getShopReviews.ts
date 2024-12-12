import { fetchWithAuthToken } from '@/utils/auth';

export async function getShopReviews({
  shopId,
  fromPage = 0,
  toPage = 1,
}: {
  shopId: string;
  fromPage: number;
  toPage: number;
}): Promise<{ data: any[] }> {
  return await fetchWithAuthToken('/api/reviews', 'POST', {
    action: 'fetch',
    shopId,
    fromPage,
    toPage,
  });
}

export async function getShopReviewCount(shopId: string): Promise<{ data: number }> {
  const response = await fetchWithAuthToken('/api/reviews', 'POST', {
    action: 'fetch',
    shopId,
    countOnly: true,
  });
  return { data: response.total };
}

import { fetchWithAuthToken } from '@/utils/auth';

type Params = {
  shopId: string;
  fromPage?: number;
  toPage?: number;
  countOnly?: boolean;
};

export async function getShopReviews({
  shopId,
  fromPage = 0,
  toPage = 1,
  countOnly = false,
}: Params): Promise<{ data: any[] | number }> {
  const response = await fetchWithAuthToken('/api/reviews', 'POST', {
    action: 'fetch',
    shopId,
    fromPage,
    toPage,
    countOnly,
  });
  return countOnly ? { data: response.total } : { data: response.data };
}

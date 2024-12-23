import { fetchWithAuthToken } from '@/utils/auth';

type Params = {
  productId: string;
  shopId: string;
};

export async function getIsLikedWithProductIdAndShopId({
  productId,
  shopId,
}: Params): Promise<{ data: boolean }> {
  const response = await fetchWithAuthToken('/api/cart/check', 'POST', {
    productId,
    shopId,
  });
  return response;
}

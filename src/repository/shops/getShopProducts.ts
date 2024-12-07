import { Product } from '@/types';
import { fetchWithAuthToken } from '@/utils/auth';

export async function getShopProducts({
  shopId,
  fromPage = 0,
  toPage = 1,
}: {
  shopId: string;
  fromPage?: number;
  toPage?: number;
}): Promise<{ data: Product[] }> {
  return await fetchWithAuthToken(
    `/api/products?shopId=${shopId}&fromPage=${fromPage}&toPage=${toPage}`,
    'GET',
  );
}

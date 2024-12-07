import { Shop, Product } from '@/types';
import { fetchWithAuthToken } from '@/utils/auth';


export async function getShop(shopId: string): Promise<{ data: Shop }> {
  return fetchWithAuthToken(
    `/api/shops`, 
    'POST', 
    { id: shopId }
  );
}

export async function getShopFollowerCount(shopId: string): Promise<{ data: number }> {
  const response = await fetchWithAuthToken(
    `/api/shops/${shopId}/followers/count`, 
    'POST'
  );
  return { data: response.data.total };
}

export async function getShopProductCount(shopId: string): Promise<{ data: number }> {
  const response = await fetchWithAuthToken(
    `/api/shops/${shopId}/products/count`, 
    'POST'
  );
  return { data: response.data.total };
}

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
    `/api/shops/${shopId}/products`, 
    'POST', 
    { fromPage, toPage }
  );
}




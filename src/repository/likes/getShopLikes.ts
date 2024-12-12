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
  const response = await fetchWithAuthToken('/api/cart', 'POST', {
    action: 'fetch',
    shopId,
    fromPage,
    toPage,
  });
  return response;
}

export async function getShopLikeCount(shopId: string): Promise<{ data: number }> {
  const response = await fetchWithAuthToken('/api/cart', 'POST', {
    action: 'fetch',
    shopId,
    countOnly: true,
  });
  return { data: response.total };
}

export async function getIsLikedWithProductIdAndShopId({
  productId,
  shopId,
}: {
  productId: string;
  shopId: string;
}): Promise<{ data: boolean }> {
  const response = await fetchWithAuthToken('/api/cart', 'POST', {
    action: 'fetch',
    productId,
    shopId,
    checkLike: true,
  });
  return response;
}

export async function updateLikeQuantity({
  productId,
  quantity,
}: {
  productId: string;
  quantity: number;
}): Promise<void> {
  await fetchWithAuthToken('/api/cart', 'POST', {
    action: 'update',
    productId,
    quantity,
  });
}

export async function addToCart(productId: string): Promise<void> {
  await fetchWithAuthToken('/api/cart', 'POST', {
    action: 'add',
    productId,
    quantity: 1,
  });
}

export async function removeFromCart(productId: string): Promise<void> {
  await fetchWithAuthToken('/api/cart', 'POST', {
    action: 'remove',
    productId,
  });
}

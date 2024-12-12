import { fetchWithAuthToken } from '@/utils/auth';

export async function getProducts(params: {
  productId?: string;
  keyword?: string;
  tag?: string;
  fromPage?: number;
  toPage?: number;
}) {
  const { productId, keyword, tag, fromPage = 0, toPage = 1 } = params;

  const response = await fetchWithAuthToken('/api/products', 'POST', {
    productId,
    keyword,
    tag,
    fromPage,
    toPage,
  });

  if (!response || !response.data) {
    throw new Error('Failed to fetch products');
  }

  return response;
}

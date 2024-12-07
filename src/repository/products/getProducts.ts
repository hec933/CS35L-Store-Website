import { Product } from '@/types';
import { fetchWithAuthToken } from '@/utils/auth';

// Get a list of products
export async function getProducts({
  fromPage = 0,
  toPage = 1,
}: {
  fromPage?: number;
  toPage?: number;
}): Promise<{ data: Product[] }> {
  return await fetchWithAuthToken(
    `/api/products?fromPage=${fromPage}&toPage=${toPage}`,
    'GET',
  );
}

// Get products by keyword
export async function getProductsByKeyword({
  query,
  fromPage = 0,
  toPage = 1,
}: {
  query: string;
  fromPage?: number;
  toPage?: number;
}): Promise<{ data: Product[] }> {
  return await fetchWithAuthToken(
    `/api/products?keyword=${encodeURIComponent(query)}&fromPage=${fromPage}&toPage=${toPage}`,
    'GET',
  );
}

// Get products by tag
export async function getProductsByTag(tag: string): Promise<{ data: Product[] }> {
  return await fetchWithAuthToken(
    `/api/products?tag=${encodeURIComponent(tag)}`,
    'GET',
  );
}

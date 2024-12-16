import { fetchWithAuthToken } from '@/utils/auth';

export default async function getProducts({
  productId = null,
  fromPage = null,
  toPage = null,
  keyword = null,
  tag = null,
}: {
  productId?: string | null;
  fromPage?: number | null;
  toPage?: number | null;
  keyword?: string | null;
  tag?: string | null;
}) {
  try {
    if (keyword) {
      const { data } = await fetchWithAuthToken('/api/products', 'POST', {
        action: 'fetchKeyword',
        keyword,
      });
      if (data && data.length > 0) {
        console.log('Found:', data.length, 'products with keyword:', keyword);
        return data;
      } else if (data && data.length === 0) {
        throw new Error(`No products found with keyword: ${keyword}`);
      } else {
        throw new Error(`No response for action: fetchKeyword and keyword: ${keyword}`);
      }
    } else if (tag) {
      const { data } = await fetchWithAuthToken('/api/products', 'POST', {
        action: 'fetchTag',
        tag,
      });
      if (data && data.length > 0) {
        console.log('Found:', data.length, 'products with tag:', tag);
        return data;
      } else if (data && data.length === 0) {
        throw new Error(`No products found with tag: ${tag}`);
      } else {
        throw new Error(`No response for action: fetchTag and tag: ${tag}`);
      }
    } else if (fromPage !== null && toPage !== null) {
      const { data } = await fetchWithAuthToken('/api/products', 'POST', {
        action: 'fetchAll',
        fromPage,
        toPage,
      });
      if (data && data.length > 0) {
        console.log('Found:', data.length, 'products from page:', fromPage, 'to page:', toPage);
        return data;
      } else if (data && data.length === 0) {
        throw new Error(`No products found from page: ${fromPage} to page: ${toPage}`);
      } else {
        throw new Error(`No response for action: fetchAll and pages: ${fromPage} to ${toPage}`);
      }
    } else if (productId) {
      const { data } = await fetchWithAuthToken('/api/products', 'POST', {
        action: 'fetchProduct',
        id: productId,
      });
      if (data && data.length > 0) {
        console.log('Found product with ID:', productId);
        return data;
      } else if (data && data.length === 0) {
        throw new Error(`No product found with ID: ${productId}`);
      } else {
        throw new Error(`No response for action: fetchProduct and ID: ${productId}`);
      }
    } else {
      throw new Error('Unsupported search format');
    }
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return '$0'; // Return a default or error token as fallback
  }
}

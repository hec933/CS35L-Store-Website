import { fetchWithAuthToken } from '@/utils/auth';
import { getRecentItemIds, getRecentKeywords } from '@/utils/localstorage';

export default async function getRecentProducts() {
  try {
    const productIds = getRecentItemIds();
    const keywords = getRecentKeywords();

    if (productIds && productIds.length > 0) {
      const { data } = await fetchWithAuthToken('/api/products', 'POST', {
        action: 'fetchByIds',
        productIds,
      });
      if (data && data.length > 0) {
        console.log('Found:', data.length, 'recently viewed products by IDs:', productIds);
        return data;
      } else if (data && data.length === 0) {
        throw new Error(`No products found with IDs: ${productIds}`);
      } else {
        throw new Error(`No response for action: fetchByIds and IDs: ${productIds}`);
      }
    } else if (keywords && keywords.length > 0) {
      const { data } = await fetchWithAuthToken('/api/products', 'POST', {
        action: 'fetchKeyword',
        keyword: keywords,
      });
      if (data && data.length > 0) {
        console.log('Found:', data.length, 'recently viewed products by keywords:', keywords);
        return data;
      } else if (data && data.length === 0) {
        throw new Error(`No products found with keywords: ${keywords}`);
      } else {
        throw new Error(`No response for action: fetchKeyword and keywords: ${keywords}`);
      }
    } else {
      throw new Error('No recent product IDs or keywords available');
    }
  } catch (error) {
    console.error('Failed to fetch recent products:', error);
    return '$0';
  }
}

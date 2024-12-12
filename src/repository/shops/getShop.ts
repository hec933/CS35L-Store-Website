import { fetchWithAuthToken } from '@/utils/auth';
import { Shop } from '@/types';

type Params = {
  shopId?: string;
  includeProductCount?: boolean;
  includeLikes?: boolean;
  includeFollowerCount?: boolean;
  likeOptions?: {
    fromPage?: number;
    toPage?: number;
    countOnly?: boolean;
  };
  keyword?: string;
  fromPage?: number;
  toPage?: number;
  countOnly?: boolean;
};

export const getShop = async ({
  shopId,
  includeProductCount = false,
  includeLikes = false,
  includeFollowerCount = false,
  likeOptions,
  keyword,
  fromPage = 0,
  toPage = 1,
  countOnly = false,
}: Params): Promise<{ data: Shop[] | number }> => {
  if (keyword) {
    const action = countOnly ? 'countByKeyword' : 'fetchByKeyword';
    return await fetchWithAuthToken('/api/shops', 'POST', {
      action,
      keyword,
      fromPage,
      toPage,
    });
  }

  const promises: Array<Promise<any>> = [
    shopId ? fetchWithAuthToken(`/api/shops/${shopId}`, 'POST') : null,
  ].filter(Boolean);

  if (includeProductCount) {
    promises.push(
      fetchWithAuthToken(`/api/shops/${shopId}/products/count`, 'POST')
    );
  }

  if (includeLikes && likeOptions) {
    const likeUrl = likeOptions.countOnly
      ? `/api/shops/${shopId}/likes/count`
      : `/api/shops/${shopId}/likes`;

    promises.push(
      fetchWithAuthToken(likeUrl, 'POST', likeOptions.countOnly ? undefined : likeOptions)
    );
  }

  if (includeFollowerCount) {
    promises.push(
      fetchWithAuthToken(`/api/shops/${shopId}/followers/count`, 'POST')
    );
  }

  const [shop, productCount, likes, followerCount] = await Promise.all(promises);

  return {
    shop: shopId ? (shop as Shop) : undefined,
    productCount: includeProductCount ? (productCount as number) : undefined,
    likes: includeLikes
      ? {
          count: likeOptions?.countOnly ? (likes as number) : undefined,
          list: likeOptions?.countOnly ? [] : (likes as Array<any>),
        }
      : undefined,
    followerCount: includeFollowerCount ? (followerCount as number) : undefined,
  };
};

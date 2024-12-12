import { fetchWithAuthToken } from '@/utils/auth';
import { Shop, Like } from '@/types';

export const getShop = async ({
  shopId,
  includeProductCount = false,
  includeLikes = false,
  includeFollowerCount = false,
  likeOptions,
}: {
  shopId: string;
  includeProductCount?: boolean;
  includeLikes?: boolean;
  includeFollowerCount?: boolean;
  likeOptions?: {
    fromPage?: number;
    toPage?: number;
    countOnly?: boolean;
  };
}) => {
  const promises: Array<Promise<any>> = [
    fetchWithAuthToken(`/api/shops/${shopId}`, 'POST'),
  ];

  if (includeProductCount) {
    promises.push(
      fetchWithAuthToken(`/api/shops/${shopId}/products/count`, 'POST')
    );
  }

  if (includeLikes && likeOptions) {
    const likeUrl = likeOptions.countOnly
      ? `/api/shops/${shopId}/likes/count`
      : `/api/shops/${shopId}/likes`;

    const likeOptionsBody = likeOptions.countOnly
      ? undefined
      : { fromPage: likeOptions.fromPage, toPage: likeOptions.toPage };

    promises.push(
      fetchWithAuthToken(likeUrl, 'POST', likeOptionsBody)
    );
  }

  if (includeFollowerCount) {
    promises.push(
      fetchWithAuthToken(`/api/shops/${shopId}/followers/count`, 'POST')
    );
  }

  const [shop, productCount, likes, followerCount] = await Promise.all(promises);

  return {
    shop: shop as Shop,
    productCount: includeProductCount ? (productCount as number) : undefined,
    likes: includeLikes
      ? {
          count: likeOptions?.countOnly ? (likes as number) : undefined,
          list: likeOptions?.countOnly ? [] : (likes as Like[]),
        }
      : undefined,
    followerCount: includeFollowerCount ? (followerCount as number) : undefined,
  };
};
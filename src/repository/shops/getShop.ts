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
    fetchWithAuthToken(`/api/shops/${shopId}`, { method: 'POST' }),
  ];

  if (includeProductCount) {
    promises.push(
      fetchWithAuthToken(`/api/shops/${shopId}/products/count`, {
        method: 'POST',
      })
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
      fetchWithAuthToken(likeUrl, {
        method: 'POST',
        ...(likeOptionsBody && { body: JSON.stringify(likeOptionsBody) }),
      })
    );
  }

  if (includeFollowerCount) {
    promises.push(
      fetchWithAuthToken(`/api/shops/${shopId}/followers/count`, {
        method: 'POST',
      })
    );
  }

  const

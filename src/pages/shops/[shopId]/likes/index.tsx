import { useEffect, useState } from 'react';
import LikeList from './_components/LikeList';
import Text from '@/components/common/Text';
import { getShop } from '@/repository/shops/getShop';
import { getAuthToken } from '@/utils/auth';
import { Shop } from '@/types';

export const getServerSideProps = async (context) => {
  const shopId = context.query.shopId as string;
  let token: string | null = null;

  try {
    token = await getAuthToken();
  } catch {}

  const { shop, productCount, likes, followerCount } = await getShop({
    shopId,
    includeProductCount: true,
    includeLikes: true,
    includeFollowerCount: true,
    likeOptions: { fromPage: 0, toPage: 1 },
  });

  return {
    props: {
      shop: shop || null,
      productCount: productCount || 0,
      likeCount: likes?.count || 0,
      likes: likes?.list || [],
      followerCount: followerCount || 0,
    },
  };
};

export default function LikesPage({
  shop,
  productCount,
  likeCount,
  likes: initialLikes,
  followerCount,
}: {
  shop: Shop | null;
  productCount: number;
  likeCount: number;
  likes: any[];
  followerCount: number;
}) {
  return (
    <div className="my-8">
      <div className="flex flex-col items-center">
        <div className="mb-5 text-center">
          <Text size="xl" color="darkestBlue">
            Shop: {shop?.name || 'Unknown Shop'}
          </Text>
          <Text size="lg">Followers: {followerCount}</Text>
          <Text size="lg">Products: {productCount}</Text>
          <Text size="lg">
            {likeCount} like{likeCount > 1 ? 's' : ''}
          </Text>
        </div>
        <div className="grid gap-4 justify-center items-center">
          <LikeList
            initialLikes={initialLikes}
            count={likeCount}
            shopId={shop?.id || ''}
          />
        </div>
      </div>
    </div>
  );
}

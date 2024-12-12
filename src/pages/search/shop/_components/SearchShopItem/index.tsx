import { useEffect, useState } from 'react';
import Shop from '@/components/common/Shop';
import Spinner from '@/components/common/Spinner';
import { fetchWithAuthToken } from '@/utils/auth';

type Props = {
  id: string;
  name: string;
  profileImageUrl?: string;
};

//render the searched shop (item is a shop)
export default function SearchShopItem({ id, name, profileImageUrl }: Props) {
  const [followerCount, setFollowerCount] = useState<number | null>(null);
  const [productCount, setProductCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        const { data } = await fetchWithAuthToken('/api/shops', 'POST', {
          shopId: id,
        });

        if (data && data.length > 0) {
          const shop = data[0];
          setFollowerCount(shop.followerCount || 0);
          setProductCount(shop.productCount || 0);
        } else {
          console.error('No shop data found for the provided ID.');
        }
      } catch (error) {
        console.error('Error fetching shop details:', error);
      }
    };

    fetchShopDetails();
  }, [id]);

  //dont print empty counts
  if (followerCount === null || productCount === null) {
    return (
      <div className="border border-lighterBlue h-28 flex justify-center items-center rounded-lg">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="border border-lighterBlue p-5 rounded-lg">
      <Shop
        type="row"
        name={name}
        productCount={productCount}
        followerCount={followerCount}
        profileImageUrl={profileImageUrl}
      />
    </div>
  );
}

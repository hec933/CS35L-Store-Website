import { useEffect, useState } from 'react';
import Spinner from '@/components/common/Spinner';
import Text from '@/components/common/Text';
import RecentItem from './_components/RecentItem';
import getRecentProducts from '@/repository/products/getRecentProducts';
import { Product as TProduct } from '@/types';

export default function Recent() {
  const [recentProducts, setRecentProducts] = useState<TProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRecentProducts = async () => {
      setIsLoading(true);
      const data = await getRecentProducts();
      if (data !== '$0') {
        setRecentProducts(data);
      } else {
        console.error('No recent products found or failed to fetch.');
      }
      setIsLoading(false);
    };

    fetchRecentProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner />
      </div>
    );
  }

  if (!recentProducts.length) {
    return (
      <div className="text-center mt-2">
        <Text size="xs" color="grey">
          No recently viewed products.
        </Text>
      </div>
    );
  }

  return (
    <div className="border border-uclaBlue p-2 bg-white flex flex-col items-center text-center">
      <Text size="sm">Your Browsing History</Text>
      <div className="border-t border-lightestBlue border-dashed pt-3 mt-2 flex flex-col gap-2">
        {recentProducts.map(({ id, title, price, image_urls }) => (
          <RecentItem
            key={id}
            id={id}
            title={title}
            price={price}
            imageUrl={image_urls[0] || ''}
          />
        ))}
      </div>
    </div>
  );
}

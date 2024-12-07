import { useCallback, useEffect, useMemo, useState } from 'react';
import RecentItem from './_components/RecentItem';
import Spinner from '@/components/common/Spinner';
import Text from '@/components/common/Text';
import { getAuthToken } from '@/utils/auth';
import { RECENT_ITEM_IDS_KEY, getRecentItemIds } from '@/utils/localstorage';

import { Product } from '@/types';

export default function Recent() {
  const [isLoading, setIsLoading] = useState(false);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  //3 items per page
  const totalPage = useMemo(
    () => Math.max(Math.ceil(recentProducts.length / 3) - 1, 0),
    [recentProducts]
  );

  useEffect(() => {
    setCurrentPage((current) => Math.min(current, totalPage));
  }, [totalPage]);

  const handleUpdateRecentProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const recentIds = getRecentItemIds();
      if (recentIds.length === 0) {
        setRecentProducts([]); // No recent products to fetch
        return;
      }

      const token = await getAuthToken();
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productIds: recentIds }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }

      const { data } = await response.json();
      setRecentProducts(data);
    } catch (error) {
      console.error('Error updating recent products:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    handleUpdateRecentProducts();
  }, [handleUpdateRecentProducts]);

  useEffect(() => {
    const eventHandler = () => handleUpdateRecentProducts();
    window.addEventListener(RECENT_ITEM_IDS_KEY, eventHandler);
    return () => window.removeEventListener(RECENT_ITEM_IDS_KEY, eventHandler);
  }, [handleUpdateRecentProducts]);

  return (
    <div className="border border-uclaBlue p-2 bg-white flex flex-col items-center text-center">
      <Text size="sm">Your Browsing History</Text>
      {isLoading ? (
        <div className="py-5">
          <Spinner />
        </div>
      ) : recentProducts.length === 0 ? (
        <div className="mt-2 text-center">
          <Text size="xs" color="grey" className="block">
            No recently viewed products.
          </Text>
        </div>
      ) : (
        <>
          <Text size="sm" color="red" weight="bold">
            {recentProducts.length}
          </Text>
          <div className="border-t border-lightestBlue border-dashed pt-3 mt-2 flex flex-col gap-2">
            {recentProducts
              .slice(currentPage * 3, (currentPage + 1) * 3)
              .map(({ id, title, price, image_urls }) => (
                <RecentItem
                  key={id}
                  id={id}
                  title={title}
                  price={price}
                  imageUrl={image_urls[0]} // Use the first image from the array
                />
              ))}
          </div>
          <div className="flex justify-between items-center mt-2 gap-1">
            <button
              className="border border-uclaBlue h-5 w-5 flex justify-center items-center"
              disabled={currentPage === 0}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <Text size="xs" color="uclaBlue">
                {'<'}
              </Text>
            </button>
            <Text size="xs" color="uclaBlue">
              {currentPage + 1} / {totalPage + 1}
            </Text>
            <button
              className="border border-uclaBlue h-5 w-5 flex justify-center items-center"
              disabled={currentPage === totalPage}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <Text size="xs" color="uclaBlue">
                {'>'}
              </Text>
            </button>
          </div>
        </>
      )}
    </div>
  );
}



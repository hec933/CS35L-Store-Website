import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import Product from '@/components/common/Product';
import Spinner from '@/components/common/Spinner';
import { fetchWithAuthToken } from '@/utils/auth';
import { Product as TProduct } from '@/types';

type Props = {
  initialProducts: TProduct[] | null | undefined;
};

export default function ProductList({ initialProducts = [] }: Props) {
  const [products, setProducts] = useState<TProduct[]>(initialProducts || []);
  const MAX_ITEMS = 20;
  const { ref, inView } = useInView({ threshold: 1 });
  const [isLoading, setIsLoading] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);

  const handleGetProducts = useCallback(
    async ({ fromPage, toPage }: { fromPage: number; toPage: number }) => {
      try {
        setIsLoading(true);
        const response = await fetchWithAuthToken('/api/products', 'POST', {
          action: 'fetchAll',
          fromPage,
          toPage,
        });
        const { data }: { data: TProduct[] } = response;
        setProducts((prevProducts) => {
          const updatedProducts = [...prevProducts, ...data];
          return updatedProducts.slice(0, MAX_ITEMS);
        });

        if (data.length === 0 || products.length >= MAX_ITEMS) {
          setIsLastPage(true);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [MAX_ITEMS, products]
  );

  useEffect(() => {
    handleGetProducts({ fromPage: 0, toPage: 1 });
  }, [handleGetProducts]);

  useEffect(() => {
    if (inView && !isLastPage && !isLoading) {
      (async () => {
        await handleGetProducts({
          fromPage: Math.floor(products.length / 10),
          toPage: Math.floor(products.length / 10) + 1,
        });
      })();
    }
  }, [inView, isLastPage, isLoading, products.length, handleGetProducts]);

  return (
    <div className="my-8">
      {products.length ? (
        <div className="grid grid-cols-5 gap-4">
          {products.map(({ id, title, price, image_urls, created_at, quantity }) => (
            <Link
              key={id}
              className="rounded-lg overflow-hidden border"
              href={`/products/${id}`}
            >
              <Product
                title={title}
                price={price}
                image_url={image_urls[0] || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAgEB/krH/aQAAAAASUVORK5CYII='}
                created_at={created_at}
                quantity={quantity}
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <Spinner />
        </div>
      )}
      {!isLastPage && !!products?.length && products.length < MAX_ITEMS && <div ref={ref} />}
    </div>
  );
}

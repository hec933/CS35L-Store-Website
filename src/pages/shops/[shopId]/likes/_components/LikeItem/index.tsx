import { useEffect, useState } from 'react';
import Product from '@/components/common/Product';
import Spinner from '@/components/common/Spinner';
import { fetchWithAuthToken } from '@/utils/auth';
import { Product as TProduct } from '@/types';

type Props = {
  productId: string;
};

export default function LikeItem({ productId }: Props) {
  const [product, setProduct] = useState<TProduct>();

  //fetch
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchWithAuthToken('/api/products/getProduct', 'POST', { productId });
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    })();
  }, [productId]);

  //loading
  if (!product) {
    return (
      <div className="border border-dashed flex justify-center items-center h-56">
        <Spinner />
      </div>
    );
  }

  //render
  return (
    <Product
      title={product.title}
      price={product.price}
      createdAt={product.createdAt}
      imageUrl={product.imageUrls[0]}
      isSoldOut={!!product.purchaseBy}
    />
  );
}

import { useEffect, useState } from 'react';
import Product from '@/components/common/Product';
import Spinner from '@/components/common/Spinner';
import { getProduct } from '@/repository/products'; // Use your utility function
import { Product as TProduct } from '@/types';

type Props = {
  productId: string;
};

//get item details and render it
export default function LikeItem({ productId }: Props) {
  const [product, setProduct] = useState<TProduct>();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getProduct(productId); // Use getProduct
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    })();
  }, [productId]);

  if (!product) {
    return (
      <div className="border border-dashed flex justify-center items-center h-56">
        <Spinner />
      </div>
    );
  }

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

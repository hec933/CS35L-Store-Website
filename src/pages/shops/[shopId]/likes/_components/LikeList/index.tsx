import { useEffect, useState } from 'react';
import { fetchWithAuthToken } from '@/utils/auth';
import LikeItem from '../LikeItem';
import Text from '@/components/common/Text';
import Button from '@/components/common/Button';
import { getProducts } from '@/repository/products';
import { Like, Product } from '@/types';

type Props = {
  initialLikes: Like[];
  count: number;
  shopId: string;
};

type LikeWithProduct = Like & {
  product?: Product;
};

export default function LikeList({ initialLikes, count, shopId }: Props) {
  const [likes, setLikes] = useState<LikeWithProduct[]>(initialLikes || []);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getProducts({ tag: shopId });
        if (Array.isArray(data)) {
          setLikes(
            data.map(id => ({
              id: crypto.randomUUID(),
              productId: id,
              userId: '',
              quantity: 1,
              createdAt: new Date().toISOString()
            }))
          );
        } else {
          setLikes([]);
        }
      } catch (error) {
        console.error('Error fetching product IDs:', error);
        setLikes([]);
      }
    })();
  }, [shopId]);

  useEffect(() => {
    const priceSum = likes.reduce((sum, item) => 
      sum + (item.product?.price || 0) * item.quantity, 0);
    setTotalPrice(priceSum);
  }, [likes]);

  const handleQuantityChange = (productId: string, delta: number) => {
    setLikes((prevLikes) =>
      prevLikes.map((item) => {
        if (item.productId === productId) {
          const updatedQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: updatedQuantity };
        }
        return item;
      })
    );
  };

  const handlePurchase = async () => {
    try {
      await fetchWithAuthToken('/api/cart', 'POST', {
        action: 'purchase',
        likes,
      });
      alert('Thanks for testing!');
    } catch (error) {
      console.error('Error completing purchase:', error);
      alert('Failed to complete purchase.');
    }
  };

  return (
    <div>
      <Text size="lg" weight="bold">
        Likes ({count})
      </Text>
      <div className="like-list">
        {likes.length > 0 ? (
          likes.map((like) => (
            <LikeItem
              key={like.id}
              productId={like.productId}
              quantity={like.quantity}
              onQuantityChange={handleQuantityChange}
            />
          ))
        ) : (
          <Text>No likes found.</Text>
        )}
      </div>
      <div className="total-price">
        <Text>Total Price: ${totalPrice.toFixed(2)}</Text>
      </div>
      <Button onClick={handlePurchase}>Purchase</Button>
    </div>
  );
}

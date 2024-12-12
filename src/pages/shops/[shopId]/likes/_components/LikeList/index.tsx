import { useEffect, useState } from 'react';
import LikeItem from '../LikeItem';
import Text from '@/components/common/Text';
import Button from '@/components/common/Button';
import { getProducts } from '@/repository/products'; // Fetch product IDs
import { Like } from '@/types';

type Props = {
  initialLikes: Like[];
  count: number;
  shopId: string;
};


//this is the front end cart
export default function LikeList({ initialLikes, count, shopId }: Props) {
  const [likes, setLikes] = useState(
    (initialLikes || []).map((item) => ({ ...item, quantity: 1 }))
  );
  const [totalPrice, setTotalPrice] = useState<number>(0);

  //get products from the list and map them
  useEffect(() => {
    (async () => {
      try {
        const { data } = await getProducts({ tag: shopId });
        if (Array.isArray(data)) {
          setLikes(
            data.map((id) => ({
              id: id.id, // Map only product IDs
              quantity: 1,
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

  //update price display on additions to likes
  useEffect(() => {
    const priceSum = likes.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(priceSum);
  }, [likes]);

  const handleQuantityChange = (id: string, delta: number) => {
    setLikes((prevLikes) =>
      prevLikes.map((item) => {
        if (item.id === id) {
          const updatedQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: updatedQuantity };
        }
        return item;
      })
    );
  };

  //TODO
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
      <Text size="large" weight="bold">
        Likes ({count})
      </Text>
      <div className="like-list">
        {likes.length > 0 ? (
          likes.map((like) => (
            <LikeItem
              key={like.id}
              productId={like.id}
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


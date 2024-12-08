import { useEffect, useState } from 'react';
import LikeItem from '../LikeItem';
import Text from '@/components/common/Text';
import Button from '@/components/common/Button';
import { fetchWithAuthToken } from '@/utils/auth';
import { Like } from '@/types';

type Props = {
 initialLikes: Like[];
 count: number;
 shopId: string;
};

export default function LikeList({ initialLikes, count, shopId }: Props) {
 const [likes, setLikes] = useState(
   (initialLikes || []).map((item) => ({ ...item, quantity: 1 }))
 );
 const [totalPrice, setTotalPrice] = useState<number>(0);

 useEffect(() => {
   (async () => {
     try {
       const { data } = await fetchWithAuthToken('/api/cart', 'POST', {
         action: 'getShopLikes',
         shopId,
       });
       if (Array.isArray(data)) {
         setLikes(data.map((item) => ({ ...item, quantity: 1 })));
         const priceSum = data.reduce((sum, item) => sum + item.price * 1, 0);
         setTotalPrice(priceSum);
       } else {
         setLikes([]);
         setTotalPrice(0);
       }
     } catch (error) {
       console.error('Error fetching likes:', error);
       setLikes([]);
       setTotalPrice(0);
     }
   })();
 }, [shopId]);

 const handleQuantityChange = (id: string, delta: number) => {
   setLikes((prevLikes) => {
     const updatedLikes = prevLikes
       .map((item) => {
         if (item.id === id) {
           const updatedQuantity = Math.max(1, item.quantity + delta);
           return { ...item, quantity: updatedQuantity };
         }
         return item;
       })
       .filter((item) => item.quantity > 0);
     return updatedLikes;
   });
 };

 useEffect(() => {
   const priceSum = likes.reduce(
     (sum, item) => sum + item.price * item.quantity,
     0
   );
   setTotalPrice(priceSum);
 }, [likes]);

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


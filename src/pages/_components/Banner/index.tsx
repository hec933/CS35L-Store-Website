import { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import Image from 'next/image';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Product } from '@/types'; 
import { fetchWithAuthToken } from '@/utils/auth';

export default function Banner() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); 

  useEffect(() => {
    const fetchMostLikedProducts = async () => {
      if (error) return;
      
      try {
        const response = await fetchWithAuthToken('/api/products', 'POST', {
          action: 'mostLiked',
        });
        
        if (!response?.data) {
          setError(true);
          return;
        }

        const validProducts = response.data.filter(product => 
          product && product.image_urls && product.image_urls.length > 0
        );
        
        const shuffled = [...validProducts].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 5);
        setProducts(selected);

      } catch (error) {
        console.error('Failed to fetch most liked products:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMostLikedProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span>loading banner</span>
      </div>
    );
  }

  if (error || products.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <span>no banner items</span>
      </div>
    );
  }

  return (
    <Carousel
      className="my-8"
      infiniteLoop
      showThumbs={false}
      showStatus={false}
    >
      {products.map((product) => (
        <div key={product.id} className="h-96">
          <Image
            src={product.image_urls?.[0] || '/placeholder-image.png'} 
            className="w-full h-full rounded-lg object-cover"
            fill
            alt={product.title || 'Product image'}
          />
        </div>
      ))}
    </Carousel>
  );
}
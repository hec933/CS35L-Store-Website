import { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import Image from 'next/image';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Product } from '@/types'; 

export default function Banner() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // fetch most liked products
  useEffect(() => {
    const fetchMostLikedProducts = async () => {
      try {
        const response = await fetch('/api/market');
        const { most_liked } = await response.json();

        // Select 10 random items
        const shuffled = most_liked.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 10);
        setProducts(selected);
      } catch (error) {
        console.error('Failed to fetch most liked products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMostLikedProducts();
  }, []);

  //loading banner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span>loading banner</span>
      </div>
    );
  }

  //empty banner
  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <span>no banner items</span>
      </div>
    );
  }

  //render carousel
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
            src={product.imageUrls[0]} 
            className="w-full h-full rounded-lg object-cover"
            fill
            alt={product.title}
          />
        </div>
      ))}
    </Carousel>
  );
}

import { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import Image from 'next/image';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { getProducts } from '@/repository/products/getProducts';

//states
export default function Banner() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    //fetch most liked
    useEffect(() => {
        const fetchMostLikedProducts = async () => {
            try {
                //fetch products
                const { data } = await getProducts({ fromPage: 0, toPage: 1, mostLiked: true });
                setProducts(data || []);
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
                //product image
                <div key={product.id} className="h-96">
                    <Image
                        src={product.image_urls[0]}
                        className="w-full h-full rounded-lg object-cover"
                        fill
                        alt={product.title}
                    />
                </div>
            ))}
        </Carousel>
    );
}

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import Product from '@/components/common/Product';
import Spinner from '@/components/common/Spinner';
import { getProducts } from '@/repository/products/getProducts';
import { Product as TProduct } from '@/types';

type Props = {
    initialProducts: TProduct[];
};

//render a list of products
export default function ProductList({ initialProducts }: Props) {
    const [products, setProducts] = useState<TProduct[]>(initialProducts);
    const MAX_ITEMS = 20;
    const { ref, inView } = useInView({ threshold: 1 });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLastPage, setIsLastPage] = useState<boolean>(false);

    const handleGetProducts = useCallback(
        async ({ fromPage, toPage }: { fromPage: number; toPage: number }) => {
            try {
                setIsLoading(true);
                const { data } = await getProducts({ fromPage, toPage });
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
                    {products.map(({ id, title, price, imageUrls, createdAt }) => (
                        <Link
                            key={id}
                            className="rounded-lg overflow-hidden border"
                            href={`/products/${id}`}
                        >
                            <Product
                                title={title}
                                price={price}
                                imageUrl={imageUrls[0]}
                                createdAt={createdAt}
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


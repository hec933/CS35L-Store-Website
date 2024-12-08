import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import ProductImage from './_components/ProductImage';
import Button from '@/components/common/Button';
import Product from '@/components/common/Product';
import Shop from '@/components/common/Shop';
import Text from '@/components/common/Text';
import Container from '@/components/layout/Container';
import Wrapper from '@/components/layout/Wrapper';
import ReviewItem from './_components/ReviewItem';
import { fetchWithAuthToken } from '@/utils/auth';
import { Review, Product as TProduct, Shop as TShop } from '@/types';
import { addRecentItemId } from '@/utils/localstorage';

dayjs.extend(relativeTime).locale('en');

export const getServerSideProps: GetServerSideProps<{
    product: TProduct;
    shop: TShop;
    productCount: number;
    followerCount: number;
    shopProducts: TProduct[];
    reviews: Review[];
    reviewCount: number;
}> = async (context) => {
    const productId = context.query.productId as string;

    const [
        { data: product },
        { data: shop },
        { data: productCount },
        { data: followerCount },
        { data: reviews },
        { data: reviewCount },
        { data: shopProducts },
    ] = await Promise.all([
        fetchWithAuthToken('/api/products', 'POST', { 
            action: 'fetch',
            productId 
        }),
        fetchWithAuthToken('/api/shops', 'POST', { 
            action: 'fetch',
            shopId: productId 
        }),
        fetchWithAuthToken('/api/shops', 'POST', { 
            action: 'getProductCount',
            shopId: productId 
        }),
        fetchWithAuthToken('/api/shops', 'POST', { 
            action: 'getFollowerCount',
            shopId: productId 
        }),
        fetchWithAuthToken('/api/reviews', 'POST', { 
            action: 'fetch',
            shopId: productId 
        }),
        fetchWithAuthToken('/api/reviews', 'POST', { 
            action: 'getCount',
            shopId: productId 
        }),
        fetchWithAuthToken('/api/products', 'POST', { 
            action: 'fetch',
            shopId: productId 
        }),
    ]);

    return {
        props: {
            product,
            shop,
            productCount,
            followerCount,
            shopProducts,
            reviews,
            reviewCount,
        },
    };
};

export default function ProductDetail({
    product,
    shop,
    productCount,
    followerCount,
    shopProducts,
    reviews,
    reviewCount,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [isLiked, setIsLiked] = useState(false);
    const [isFollowed, setIsFollowed] = useState(false);

    const router = useRouter();

    useEffect(() => {
        addRecentItemId(product.id);
    }, [product.id]);


    const handleToggleLike = async () => {
    try {
        if (isLiked) {
            await fetchWithAuthToken('/api/cart', 'DELETE', { productId: product.id });
        } else {
            await fetchWithAuthToken('/api/cart', 'POST', { 
                action: 'add',
                productId: product.id,
                quantity: 1 
            });
        }
        setIsLiked(prev => !prev);
    } catch (error) {
        console.error('Error toggling cart:', error);
    }
    };

    const handleToggleFollow = () => setIsFollowed((prev) => !prev);

    return (
        <Wrapper>
            <Container>
                <div className="flex gap-6 my-6">
                    <div className="w-96 h-96 shrink-0">
                        <ProductImage imageUrls={product.imageUrls} />
                    </div>
                    <div className="flex flex-col justify-between flex-1">
                        <div>
                            <Text size="4xl" weight="bold">{product.title}</Text>
                            <div className="my-6 flex items-center">
                                <Text size="2xl">$</Text>
                                <Text size="3xl">{product.price.toLocaleString()}</Text>
                            </div>
                            <Text color="uclaBlue">{dayjs(product.createdAt).fromNow()}</Text>
                        </div>
                        <div className="flex gap-4">
                            <Button onClick={handleToggleLike}>
                                {isLiked ? 'Remove from Cart' : 'Add to Cart'}
                            </Button>
                            <Button>Buy Now</Button>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <Text size="xl" weight="bold">Seller Information</Text>
                    <Shop
                        name={shop.name}
                        profileImageUrl={shop.imageUrl || undefined}
                        productCount={productCount}
                        followerCount={followerCount}
                    />
                </div>

                <div className="mt-6">
                    <Text size="xl" weight="bold">Product Reviews ({reviewCount})</Text>
                    {reviews.map(({ id, contents, createdBy, createdAt }) => (
                        <ReviewItem
                            key={id}
                            contents={contents}
                            createdBy={createdBy}
                            createdAt={createdAt}
                        />
                    ))}
                </div>
            </Container>
        </Wrapper>
    );
}



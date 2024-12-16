import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useState } from 'react';
import ProductImage from './_components/ProductImage';
import Button from '@/components/common/Button';
import Text from '@/components/common/Text';
import Shop from '@/components/common/Shop';
import Wrapper from '@/components/layout/Wrapper';
import Container from '@/components/layout/Container';
import ReviewItem from './_components/ReviewItem';
import { fetchWithAuthToken } from '@/utils/auth';
import { Product as TProduct, Shop as TShop, Review as TReview } from '@/types';
import { useRouter } from 'next/router';

dayjs.extend(relativeTime).locale('en');

export default function ProductDetail() {
  const [product, setProduct] = useState<TProduct | null>(null);
  const [shop, setShop] = useState<TShop | null>(null);
  const [reviews, setReviews] = useState<TReview[]>([]);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { productId } = router.query;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user first to ensure authentication
        const userResponse = await fetchWithAuthToken('/api/user', 'POST', {});
        if (!userResponse || !userResponse.user) {
          router.push('/login');
          return;
        }

        if (!productId || typeof productId !== 'string') {
          router.push('/404');
          return;
        }

        // Fetch product to get shop_id
        const productResponse = await fetchWithAuthToken('/api/products', 'POST', { id: productId });
        if (!productResponse || !productResponse.data) {
          router.push('/404');
          return;
        }
        const productData = productResponse.data;
        setProduct(productData);

        // Fetch related data in parallel
        const [shopResponse, reviewsResponse, reviewCountResponse] = await Promise.all([
          fetchWithAuthToken('/api/shops', 'POST', { id: productData.shop_id }),
          fetchWithAuthToken('/api/reviews', 'POST', { sid: productData.shop_id }),
          fetchWithAuthToken('/api/reviews', 'POST', { sid: productData.shop_id, count: true }),
        ]);

        if (shopResponse?.data) {
          setShop(shopResponse.data);
        }

        if (reviewsResponse?.data) {
          setReviews(reviewsResponse.data);
        }

        if (reviewCountResponse?.data) {
          setReviewCount(reviewCountResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        router.push('/500');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId, router]);

  const handleToggleLike = async () => {
    try {
      if (isLiked) {
        await fetchWithAuthToken(`/api/cart?productId=${product?.id}`, 'DELETE');
      } else {
        await fetchWithAuthToken('/api/cart', 'POST', { productId: product?.id, quantity: 1 });
      }
      setIsLiked((prev) => !prev);
    } catch (error) {
      console.error('Error toggling cart:', error);
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!product || !shop) {
    return <Text>Error loading product or shop details.</Text>;
  }

  return (
    <Wrapper>
      <Container>
        <div className="flex gap-6 my-6">
          <div className="w-96 h-96 shrink-0">
            <ProductImage imageUrls={product.image_urls} />
          </div>
          <div className="flex flex-col justify-between flex-1">
            <div>
              <Text size="4xl" weight="bold">{product.title}</Text>
              <div className="my-6 flex items-center">
                <Text size="2xl">$</Text>
                <Text size="3xl">{product.price.toLocaleString()}</Text>
              </div>
              <Text color="uclaBlue">{dayjs(product.created_at).fromNow()}</Text>
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
            followerCount={shop.followers || 0}
            productCount={shop.product_count || 0}
          />
        </div>

        <div className="mt-6">
          <Text size="xl" weight="bold">Product Reviews ({reviewCount})</Text>
          {reviews.map(({ id, content, userName, createdAt }) => (
            <ReviewItem
              key={id}
              contents={content}
              createdBy={userName}
              createdAt={createdAt}
            />
          ))}
        </div>
      </Container>
    </Wrapper>
  );
}

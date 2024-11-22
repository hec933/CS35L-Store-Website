import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { GetServerSideProps } from 'next'
import 'dayjs/locale/en'
import Image from 'next/image'
import Link from 'next/link'
import ProductImage from './_components/ProductImage'
import ReviewItem from './_components/ReviewItem'
import Button from '@/components/common/Button'
import Product from '@/components/common/Product'
import Shop from '@/components/common/Shop'
import Text from '@/components/common/Text'
import Container from '@/components/layout/Container'
import Wrapper from '@/components/layout/Wrapper'
import { getProduct } from '@/repository/products/getProduct'
import { getShop } from '@/repository/shops/getShop'
import { Product as TProduct, Shop as TShop } from '@/types'

export const getServerSideProps: GetServerSideProps = async (context) => {
    const productId = context.query.productId as string;
    const { data: product } = await getProduct(productId);
    const { data: shop } = await getShop(product.createdBy);

    return {
        props: {
            product,
            shop,
        },
    };
};

dayjs.extend(relativeTime).locale('en')

export default function ProductDetail({ 
    product,
    shop
}: {
    product: TProduct;
    shop: TShop;
}) {
    const router = useRouter()

    const handleToggleLike = () => {
        alert('Need to implement')
    }

    const handleChat = () => {
        alert('Start Chat')
    }

    const handlePruchase = () => {
        alert('Purchase Now')
    }

    const handleToggleFollow = () => {
        alert('Need to implement')
    }

    return (
        <Wrapper key={typeof router.query.productId === 'string' ? router.query.productId : undefined}>
            <Container>
                <div className="flex gap-6 my-6">
                    {/* Product image section */}
                    <div className="w-96 h-96 shrink-0">
                        <ProductImage imageUrls={product.imageUrls} />
                    </div>
                    <div
                        className="flex flex-col justify-between flex-1"
                        style={{ minWidth: 0 }}
                    >
                        <div>
                            {/* Product title */}
                            <div className="truncate">
                                <Text size="4xl" weight="bold">
                                    {product.title}
                                </Text>
                            </div>
                            {/* Product price */}
                            <div className="my-6">
                                <Text size="2xl"> $ </Text>
                                <Text size="3xl">
                                    {product.price.toLocaleString()}
                                </Text>
                            </div>
                            {/* Product creation date */}
                            <div className="border-t border-lightestBlue py-4 flex gap-1 items-center">
                                <Text color="uclaBlue" className="flex">
                                    <span
                                        className="material-symbols-outlined"
                                        style={{
                                            fontSize: '1.25rem',
                                        }}
                                    >
                                        schedule
                                    </span>
                                </Text>
                                <Text color="uclaBlue">
                                    {dayjs(product.createdAt).fromNow()}
                                </Text>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2">
                            {/* Add to Cart */}
                            <Button
                                fullWidth
                                color="uclaBlue"
                                className="flex justify-center items-center gap-1 rounded-full"
                                onClick={handleToggleLike}
                            >
                                <span
                                    style={{ fontSize: '1.25rem' }}
                                    className="material-symbols-outlined"
                                >
                                    shopping_cart
                                </span>
                                <Text color="white">Add to Cart</Text>
                            </Button>

                            {/* Chat */}
                            <Button
                                fullWidth
                                color="darkestGold"
                                className="flex justify-center items-center gap-1 rounded-full"
                                onClick={handleChat}
                            >
                                <span
                                    style={{ fontSize: '1rem' }}
                                    className="material-symbols-outlined"
                                >
                                    chat_bubble
                                </span>
                                <Text color="white">Chat</Text>
                            </Button>

                            {/* Buy Now */}
                            <Button
                                fullWidth
                                disabled={!!product.purchaseBy}
                                color="uclaBlue"
                                className="flex justify-center items-center gap-1 rounded-full"
                                onClick={handlePruchase}
                            >
                                <Text color="white">
                                    {!!product.purchaseBy ? 'Sold Out' : 'Buy Now'}
                                </Text>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Product description and details */}
                <div className="flex border-t border-lighterBlue pt-5">
                    <div className="w-4/6 pr-2">
                        {/* Product Information */}
                        <div className="border-b border-lighterBlue pb-3">
                            <Text size="xl">Product Information</Text>
                        </div>
                        {/* Description */}
                        <div className="mt-5 mb-10">{product.description}</div>
                        <div className="border-y border-lighterBlue justify-center py-4 flex gap-2">
                            {/* Used or New Product */}
                            <div className="rounded-full bg-lightestBlue px-3 py-1 text-sm">
                                {product.isUsed ? 'Used Product' : 'New Product'}
                            </div>

                            {/* Exchangeable */}
                            <div className="rounded-full bg-lightestBlue px-3 py-1 text-sm">
                                {product.isChangable ? 'Exchangeable' : 'Not Exchangeable'}
                            </div>
                        </div>
                        {/* Location and Tag */}
                        <div className="flex py-4 border-b mb-10 border-lighterBlue">
                            <div className="flex-1 flex flex-col items-center gap-2">
                                <Text size="lg" color="darkerBlue">
                                    Location
                                </Text>
                                <Text color="uclaBlue">{product.address}</Text>
                            </div>
                            <div className="flex-1 flex flex-col items-center gap-2">
                                <Text size="lg" color="darkerBlue">
                                    Tags
                                </Text>
                                <div className="flex gap-2 flex-wrap justify-center">
                                    {product.tags === null ? (
                                        <Text color="uclaBlue">No product tags available.</Text>
                                    ) : (
                                        product.tags.map((tag: string) => (
                                            <div
                                                key={tag}
                                                className="bg-lightestBlue rounded-xl px-2 text-sm"
                                            >
                                                {tag}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom-Right Seller Information */}
                    <div className="w-2/6 border-l border-lighterBlue pl-2">
                        <div className="border-b border-lighterBlue pb-3 text-center">
                            <Text size="xl">Seller Information</Text>
                        </div>
                        <div className="p-10">
                            <Shop
                                name={shop.name}
                                profileImageUrl={shop.imageUrl || undefined}
                                productCount={0}
                                followerCount={0}
                                type="row"
                                handleClickTitle={() => alert('handleClickTitle')}
                                handleClickProfileImage={() => alert('handleClickProfileImage')}
                                handleClickProductCount={() => alert('handleClickProductCount')}
                                handleClickFollowerCount={() => alert('handleClickFollowerCount')}
                            />
                        </div>
                        {/* Follow Button */}
                        <Button
                            className="rounded-full"
                            color="uclaBlue"
                            fullWidth
                            onClick={handleToggleFollow}
                        >
                            <Text
                                color="white"
                                className="flex justify-center items-center gap-4"
                            >
                                <span className="material-symbols-outlined">person_add</span>
                                Follow
                            </Text>
                        </Button>

                        {/* Button */}
                        <div className="flex gap-1 my-7">
                            <Button
                                fullWidth
                                color="orange"
                                className="flex justify-center items-center gap-1 rounded-full"
                                onClick={handleChat}
                            >
                                <span
                                    style={{ fontSize: '1rem' }}
                                    className="material-symbols-outlined"
                                >
                                    chat_bubble
                                </span>
                                <Text color="white">Chat</Text>
                            </Button>
                            <Button
                                fullWidth
                                color="red"
                                className="flex justify-center items-center gap-1 rounded-full"
                                disabled={!!product.purchaseBy}
                                onClick={handlePruchase}
                            >
                                <Text color="white">
                                    {!!product.purchaseBy ? 'Sold Out' : 'Buy Now'}
                                </Text>
                            </Button>
                        </div>
                    </div>
                </div>
            </Container>
        </Wrapper>
    )
}
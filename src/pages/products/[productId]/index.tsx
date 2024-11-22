import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import 'dayjs/locale/en'
import Link from 'next/link'
import { useState } from 'react'
import ProductImage from './_components/ProductImage'
import Button from '@/components/common/Button'
import Product from '@/components/common/Product'
import Text from '@/components/common/Text'
import Container from '@/components/layout/Container'
import Wrapper from '@/components/layout/Wrapper'
import { getIsLikedWithProductIdAndShopId } from '@/repository/likes/getIsLikedWithProductIdAndShopId'
import { getMe } from '@/repository/me/getMe'
import { getProduct } from '@/repository/products/getProduct'
import { getProductsByTag } from '@/repository/products/getProductsByTag'
import { Product as TProduct } from '@/types'
import { useRouter } from 'next/router'


/**
 * Fetch product details, user information, and like status from the server
 * 서버에서 제품 정보, 사용자 정보, 찜 상태를 가져옴
 */
export const getServerSideProps: GetServerSideProps<{
    product: TProduct // Product data to be passed to the component (컴포넌트에 전달할 제품 데이터)
    myShopId: string | null // User's shop ID or null if not logged in (사용자의 상점 ID 또는 로그인이 안 된 경우 null)
    isLiked: boolean // Whether the product is liked by the user (사용자가 제품을 찜했는지 여부)
    suggest: TProduct[]
}> = async (context) => {
    const productId = context.query.productId as string

    // Fetch product data from the repository (리포지토리에서 제품 데이터를 가져옴)
    const { data: product } = await getProduct(productId)
    const {
        data: { shopId: myShopId },
    } = await getMe()


    // Check if the product is liked by the user's shop (사용자의 상점이 제품을 찜했는지 확인)
    const { data: isLiked } =
        myShopId !== null
            ? await getIsLikedWithProductIdAndShopId({
                  productId,
                  shopId: myShopId,
              })
            : { data: false }

    /**
     * Fetch products by each tag using Promise.all to handle asynchronous operations concurrently
     * 각 태그별로 제품을 가져오기 위해 Promise.all을 사용하여 비동기 작업을 동시에 처리
     */
    const productsByTagsResult = await Promise.all(
        (product.tags || []).map((tag) => getProductsByTag(tag)),
    )

    /**
     * Extract the data from each result and flatten the array to get a list of suggested products
     * 각 결과에서 데이터를 추출하고 배열을 평탄화하여 추천 제품 목록을 생성
     */
    const suggest = productsByTagsResult.map(({ data }) => data).flat()

    return {
        props: { product, myShopId, isLiked, suggest }, // Return the fetched data as props (가져온 데이터를 props로 반환)
    }
}

// Extend dayjs with the relativeTime plugin and set locale to us
dayjs.extend(relativeTime).locale('en')

// Main component for the Product Detail page (상품 상세 페이지의 메인 컴포넌트)
export default function ProductDetail({
    product,
    myShopId,
    suggest,
    isLiked: initialIsLiked,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [isLiked, setIsLiked] = useState(initialIsLiked)

    // Function to check if the user is authenticated before performing an action
    // 사용자가 인증되었는지 확인한 후 작업을 수행하는 함수
    const checkAuth = (func: Function) => () => {
        if (!myShopId) {
            alert('You need to login.')
            return
        }
        func()
    }

    // Handle like action (찜하기 동작 처리)
    const handleLike = checkAuth(() => {
        setIsLiked((prev) => !prev)
        // TODO : Send request to the server (서버에 요청을 보냄)
    })

    // Handle chat action (채팅하기 동작 처리)
    const handleChat = checkAuth(() => {
        alert('Start Chat')
    })

    // Handle purchase action (구매하기 동작 처리)
    const handlePruchase = checkAuth(() => {
        alert('Purchase Now')
    })

    return (
        <Wrapper>
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
                            <div className="border-t border-lighterBlue py-4 flex gap-1 items-center">
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

                        {/* Action buttons  (getIsLikedWithProductIdAndShopId) */}
                        <div className="flex gap-2">
                            {/* Add to Cart */}
                            <Button
                                fullWidth
                                color="uclaBlue"
                                className="flex justify-center items-center gap-1 rounded-full"
                                onClick={() => handleLike()}
                            >
                                <span
                                    style={{ fontSize: '1.25rem' }}
                                    className="material-symbols-outlined"
                                >
                                    shopping_cart
                                </span>
                                <Text color="white">
                                    {isLiked ? 'Delete' : 'Add to Cart'}
                                </Text>{' '}
                            </Button>

                            {/* Chat */}
                            <Button
                                fullWidth
                                color="darkestGold"
                                className="flex justify-center items-center gap-1 rounded-full"
                                onClick={() => handleChat()}
                            >
                                <span
                                    style={{ fontSize: '1rem' }}
                                    className="material-symbols-outlined"
                                >
                                    chat_bubble
                                </span>
                                <Text color="white"> Chat </Text>{' '}
                            </Button>

                            {/* Buy Now */}
                            <Button
                                fullWidth
                                disabled={!!product.purchaseBy}
                                color="uclaBlue"
                                className="flex justify-center items-center gap-1 rounded-full"
                                onClick={() => handlePruchase()}
                            >
                                <Text color="white">
                                    {!!product.purchaseBy
                                        ? 'Sold Out'
                                        : 'Buy Now'}{' '}
                                </Text>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Product description and details (제품 설명 및 상세 정보) */}
                <div className="flex border-t border-lighterBlue pt-10">
                    <div className="w-4/6">
                        {/* Product Information */}
                        <div className="border-b border-lighterBlue pb-3">
                            <Text size="xl">Product Information</Text>{' '}
                        </div>
                        {/* Description */}
                        <div className="mt-5 mb-10">{product.description}</div>
                        <div className="border-y border-lighterBlue justify-center py-4 flex gap-2 ">
                            {/* Used or New Product */}
                            <div className="rounded-full bg-lightestBlue px-3 py-1 text-sm ">
                                {product.isUsed
                                    ? 'Used Product'
                                    : 'New Product'}{' '}
                            </div>

                            {/* Exchangeable */}
                            <div className="rounded-full bg-lightestBlue px-3 py-1 text-sm">
                                {product.isChangable
                                    ? 'Exchangeable'
                                    : 'Not Exchangeable'}{' '}
                            </div>
                        </div>
                        {/* Location and Tag */}
                        <div className="flex py-4 border-b mb-10 border-lighterBlue">
                            <div className="flex-1 flex flex-col items-center gap-2">
                                <Text size="lg" color="darkerBlue">
                                    Location
                                </Text>
                                <Text color="uclaBlue">
                                    {' '}
                                    {product.address}{' '}
                                </Text>{' '}
                            </div>
                            <div className="flex-1 flex flex-col items-center gap-2">
                                <Text size="lg" color="darkerBlue">
                                    Tags
                                </Text>
                                <div className="flex gap-2 flex-wrap justify-center">
                                    {product.tags === null ? (
                                        <Text color="uclaBlue">
                                            {' '}
                                            No product tags available.{' '}
                                        </Text>
                                    ) : (
                                        product.tags.map((tag) => (
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

                        {/* Similar Tag Products */}
                        {suggest.length === 0 ? null : (
                            <div>
                                {/* Title */}
                                <div>
                                    <Text size="xl">
                                        {' '}
                                        Products related to this item
                                    </Text>
                                </div>

                                {/* related products List */}
                                <div className="my-5 flex gap-3 flex-wrap">
                                    {suggest
                                        .slice(0, 3)
                                        .map(
                                            ({
                                                id,
                                                title,
                                                price,
                                                createdAt,
                                                imageUrls,
                                            }) => (
                                                  <Link href={`/products/${id}`} passHref>
						    <div className="w-48">
						        <Product
							      title={title}
							      price={price}
							      createdAt={createdAt}
							      imageUrl={imageUrls[0]}
							 />
						    </div>
						  </Link>
                                            ),
                                        )}
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Buttom-Right Seller Review Information */}
                    <div className="w-2/6"> Seller Information </div>{' '}
                </div>
            </Container>
        </Wrapper>
    )
}

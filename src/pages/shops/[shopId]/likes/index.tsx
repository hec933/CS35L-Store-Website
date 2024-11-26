import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import LikeList from './_components/LikeList'

import Text from '@/components/common/Text'
import { getShop } from '@/repository/shops/getShop'
import { getShopLikeCount } from '@/repository/shops/getShopLikeCount'
import { getShopLikes } from '@/repository/shops/getShopLikes'
import { getShopProductCount } from '@/repository/shops/getShopProductCount'
import { Like, Shop } from '@/types'

/**
 * Server-side data fetching for cart-related information
 */
export const getServerSideProps: GetServerSideProps<{
    shop: Shop // Shop information (상점 정보)
    productCount: number // Number of products in the shop
    likeCount: number // Number of liked items in the cart
    likes: Like[] // List of liked products in the cart
}> = async (context) => {
    // Extract shopId from query parameters
    const shopId = context.query.shopId as string

    // Fetch shop-related data in parallel
    const [
        { data: shop },
        { data: productCount },
        { data: likeCount },
        { data: likes },
    ] = await Promise.all([
        getShop(shopId), // Fetch shop information
        getShopProductCount(shopId), // Fetch product count
        getShopLikeCount(shopId), // Fetch like count
        getShopLikes({ shopId, fromPage: 0, toPage: 1 }), // Fetch list of liked products
    ])

    return {
        props: {
            shop, // Shop information
            productCount, // Product count
            likeCount, // Like count
            likes, // Liked products list
        },
    }
}

/**
 * Cart Page Component
 */
export default function CartPage({
    shop, // Shop information
    productCount, // Product count
    likeCount, // Like count
    likes: initialLikes, // Initial list of liked products
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <div className="my-8 ">
            <div className="flex flex-col items-center">
                {/* Page Header */}
                <div className="mb-5 text-center">
                    {' '}
                    <Text size="xl" color="darkestBlue">
                        Shopping Cart :{' '}
                    </Text>
                    <Text size="xl">
                        {likeCount} item{likeCount > 1 ? 's' : ''} in your cart.
                    </Text>
                </div>

                {/* Liked Products List */}
                <div className="grid gap-4 justify-center items-center">
                    <LikeList
                        initialLikes={initialLikes} // Initial liked products list
                        count={likeCount} // Total like count
                        shopId={shop.id} // Current shop ID
                    />
                </div>
            </div>
        </div>
    )
}

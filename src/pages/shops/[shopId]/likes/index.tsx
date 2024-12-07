import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import LikeList from './_components/LikeList'
import Text from '@/components/common/Text'
import { getShop } from '@/repository/shops/getShop'
import { getShopLikeCount } from '@/repository/shops/getShopLikeCount'
import { getShopLikes } from '@/repository/shops/getShopLikes'
import { getShopProductCount } from '@/repository/shops/getShopProductCount'
import { Like, Shop } from '@/types'
import { getAuthToken } from '@/utils/auth'


//list
export const getServerSideProps: GetServerSideProps<{
    shop: Shop
    productCount: number
    likeCount: number
    likes: Like[]
}> = async (context) => {
    const shopId = context.query.shopId as string

    let token: string | null = null
    try {
        token = await getAuthToken(context.req, context.res)
    } catch {
        //user is not authed
    }

    if (!token) {
        //user is not authed
        const { data: shop } = await getShop(shopId)
        const { data: productCount } = await getShopProductCount(shopId)
        return {
            props: {
                shop,
                productCount,
                likeCount: 0,
                likes: [],
            },
        }
    }

    //user is authed
    const [
        { data: shop },
        { data: productCount },
        { data: likeCount },
        { data: likes },
    ] = await Promise.all([
        getShop(shopId),
        getShopProductCount(shopId),
        getShopLikeCount(shopId),
        getShopLikes({ shopId, fromPage: 0, toPage: 1 }),
    ])

    return {
        props: {
            shop,
            productCount,
            likeCount,
            likes,
        },
    }
}

//cart view
export default function CartPage({
    shop,
    productCount,
    likeCount,
    likes: initialLikes,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <div className="my-8 ">
            <div className="flex flex-col items-center">
                <div className="mb-5 text-center">
                    <Text size="xl" color="darkestBlue">
                        Shopping Cart :{' '}
                    </Text>
                    <Text size="xl">
                        {likeCount} item{likeCount > 1 ? 's' : ''} in your cart.
                    </Text>
                </div>

                <div className="grid gap-4 justify-center items-center">
                    <LikeList
                        initialLikes={initialLikes}
                        count={likeCount}
                        shopId={shop.id}
                    />
                </div>
            </div>
        </div>
    )
}

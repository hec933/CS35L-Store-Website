import Link from 'next/link'
import { useEffect, useState } from 'react'

import Spinner from '@/components/common/Spinner'
import Text from '@/components/common/Text'
import { getMe } from '@/repository/me/getMe'
import { getShopLikeCount } from '@/repository/shops/getShopLikeCount'

/**
 * Likes Component (Cart Component)
 * Fetches and displays the number of products added to the cart for the current user's shop.
 */
export default function Likes() {
    const [shopId, setShopId] = useState<string | null>(null) // User's shop ID state
    const [likeCount, setLikeCount] = useState<number>() // Number of liked products

    useEffect(() => {
        // Fetch the user's shop ID and the number of liked products when the component mounts
        ;(async () => {
            const {
                data: { shopId },
            } = await getMe()

            if (!shopId) {
                setLikeCount(0) // If the user doesn't have a shop, set the like count to 0
                return
            }

            // Fetch the like count for the user's shop
            const { data: likeCount } = await getShopLikeCount(shopId)
            setShopId(shopId)
            setLikeCount(likeCount)
        })()
    }, [])

    return (
        <Link
            href={!shopId ? '#' : `/shops/${shopId}/likes`}
            className="p-4 flex items-center justify-between cursor-pointer hover:scale-110 transition-transform duration-200"
            aria-label="Cart Section"
        >
            {/* 아이콘 및 좋아요 개수 */}
            <div className="flex items-center gap-3 mr-2">
                <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '1.5rem' }}
                >
                    shopping_cart
                </span>
                {likeCount === undefined ? (
                    <Spinner />
                ) : (
                    <Text size="lg" color="uclaBlue">
                        {likeCount}
                    </Text>
                )}
            </div>

            {/* Cart 텍스트 */}
            <Text size="md">Cart</Text>
        </Link>
    )
}

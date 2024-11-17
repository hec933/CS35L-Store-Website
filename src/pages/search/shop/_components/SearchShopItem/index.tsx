import { useEffect, useState } from 'react'

import Shop from '@/components/common/Shop'
import Spinner from '@/components/common/Spinner'
import { getShopFollowerCount } from '@/repository/shops/getShopFollowerCount'
import { getShopProductCount } from '@/repository/shops/getShopProductCount'

type Props = {
    id: string // Shop ID used to fetch additional data
    name: string // Shop name to display
    profileImageUrl?: string // URL for the shop's profile image
}

// SearchShopItem component to display shop information and load counts
export default function SearchShopItem({ id, name, profileImageUrl }: Props) {
    // State to store the follower count
    const [followerCount, setFollowerCount] = useState<number | undefined>()

    // State to store the product count
    const [productCount, setProductCount] = useState<number | undefined>()

    useEffect(() => {
        ;(async () => {
            // Fetch follower and product counts asynchronously
            const [{ data: followerCount }, { data: productCount }] =
                await Promise.all([
                    getShopFollowerCount(id),
                    getShopProductCount(id),
                ])

            setFollowerCount(followerCount) // Update the follower count state (
            setProductCount(productCount) // Update the product count state
        })()
    }, [id])

    // Show a loading spinner if data is not yet loaded
    if (followerCount === undefined || productCount === undefined) {
        return (
            <div className="border border-lighterBlue h-28 flex justify-center items-center rounded-lg">
                <Spinner />
            </div>
        )
    }

    // Render the Shop component with the loaded data
    return (
        <div className="border border-lighterBlue p-5 rounded-lg">
            <Shop
                type="row"
                name={name}
                productCount={productCount}
                followerCount={followerCount}
                profileImageUrl={profileImageUrl}
            />
        </div>
    )
}

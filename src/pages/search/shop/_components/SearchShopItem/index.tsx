import { useEffect, useState } from 'react'
import Shop from '@/components/common/Shop'
import Spinner from '@/components/common/Spinner'
import { getAuthToken } from '@/utils/auth'
import { getShopFollowerCount } from '@/repository/shops/getShopFollowerCount'
import { getShopProductCount } from '@/repository/shops/getShopProductCount'

type Props = {
    id: string
    name: string
    profileImageUrl?: string
}

//search for an item at a shop
export default function SearchShopItem({ id, name, profileImageUrl }: Props) {
    const [followerCount, setFollowerCount] = useState<number | undefined>()
    const [productCount, setProductCount] = useState<number | undefined>()

    useEffect(() => {
        ;(async () => {
            try {
                const token = await getAuthToken()
                const [{ data: followerCount }, { data: productCount }] =
                    await Promise.all([
                        getShopFollowerCount(id, token),
                        getShopProductCount(id, token),
                    ])

                setFollowerCount(followerCount)
                setProductCount(productCount)
            } catch (error) {
                console.error('Error fetching shop data:', error)
            }
        })()
    }, [id])

    if (followerCount === undefined || productCount === undefined) {
        return (
            <div className="border border-lighterBlue h-28 flex justify-center items-center rounded-lg">
                <Spinner />
            </div>
        )
    }

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
 


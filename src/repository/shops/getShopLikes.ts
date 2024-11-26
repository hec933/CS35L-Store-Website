import { Like } from '@/types'
import { getMockLikeData } from '@/utils/mock'
import { getShopLikeCount } from './getShopLikeCount'

type Params = {
    shopId: string
    fromPage?: number
    toPage?: number
}

// Like Cart page
export async function getShopLikes({
    shopId,
}: Params): Promise<{ data: Like[] }> {
    // Fetch the total number of likes dynamically
    const { data: totalLikes } = await getShopLikeCount(shopId)

    // Generate the number of likes based on the total count
    const data: Like[] = Array.from({ length: totalLikes }).map(() =>
        getMockLikeData({ createdBy: shopId }),
    )

    return Promise.resolve({ data })
}

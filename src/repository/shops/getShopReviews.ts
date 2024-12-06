import { Review } from '@/types'
import { getAuthToken } from '@/utils/auth'

type Params = {
    shopId: string
    fromPage?: number
    toPage?: number
}

//get reviews of a shop
export async function getShopReviews({
    shopId,
    fromPage = 0,
    toPage = 1,
}: Params): Promise<{ data: Review[] }> {
    const token = await getAuthToken()
    const response = await fetch(
        `/api/reviews?shopId=${shopId}&fromPage=${fromPage}&toPage=${toPage}`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    )
    if (!response.ok) throw new Error('Failed to fetch reviews')
    return await response.json()
}
//count
export async function getShopReviewCount(shopId: string): Promise<{ data: number }> {
    const token = await getAuthToken()
    const response = await fetch(`/api/reviews/count?shopId=${shopId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    if (!response.ok) throw new Error('Failed to fetch review count')
    const data = await response.json()
    return { data: data.total }
}
//add
export async function addReview(shopId: string, content: string): Promise<void> {
    const token = await getAuthToken()
    const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ shopId, content })
    })
    if (!response.ok) throw new Error('Failed to add review')
}

//update rev
export async function updateReview(reviewId: string, content: string): Promise<void> {
    const token = await getAuthToken()
    const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
    })
    if (!response.ok) throw new Error('Failed to update review')
}

//del rev
export async function deleteReview(reviewId: string): Promise<void> {
    const token = await getAuthToken()
    const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    if (!response.ok) throw new Error('Failed to delete review')
}


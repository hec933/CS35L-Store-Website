import { getAuthToken } from '@/utils/auth'

export async function getShopFollowerCount(
    shopId: string,
    token?: string
): Promise<{ data: number }> {
    try {
        if (!token) {
            token = await getAuthToken()
        }
        const response = await fetch(`/api/shops/${shopId}/followers`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        if (!response.ok) {
            throw new Error(`Failed to fetch follower count: ${response.statusText}`)
        }
        const result = await response.json()
        return { data: result.count }
    } catch (error) {
        console.error('Error fetching shop follower count:', error)
        throw error
    }
}

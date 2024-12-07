import { getAuthToken } from '@/utils/auth'

export async function getShopFollowerCount(
  shopId: string,
  token?: string
): Promise<{ data: number }> {
  try {
   
    if (!token) {
      token = await getAuthToken()
    }

    const response = await fetchWithAuthToken(
      `/api/shops/${shopId}/followers`, 
      'POST', 
      {},
      token
    )

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

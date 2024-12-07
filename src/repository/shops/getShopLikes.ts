import { Like } from '@/types'
import { fetchWithAuthToken } from '@/utils/auth'

// get shop likes
export async function getShopLikes({
  shopId,
  fromPage = 0,
  toPage = 1,
}: {
  shopId: string
  fromPage?: number
  toPage?: number
}): Promise<{ data: Like[] }> {
  return await fetchWithAuthToken(
    '/api/cart',
    'POST',
    {
      shopId,
      fromPage,
      toPage,
    }
  )
}

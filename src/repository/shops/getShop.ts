import { Shop, Product } from '@/types'
import { getAuthToken } from '@/utils/auth'


//get shop
export async function getShop(shopId: string): Promise<{ data: Shop }> {
  const token = await getAuthToken()
  const response = await fetch(`/api/shop?id=${shopId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  if (!response.ok) throw new Error('Failed to fetch shop')
  return await response.json()
}

//get followers of a shop
export async function getShopFollowerCount(shopId: string): Promise<{ data: number }> {
  const token = await getAuthToken()
  const response = await fetch(`/api/followers?shopId=${shopId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  if (!response.ok) throw new Error('Failed to fetch follower count')
  const data = await response.json()
  return { data: data.total }
}

//get product quantity of a shop
export async function getShopProductCount(shopId: string): Promise<{ data: number }> {
  const token = await getAuthToken()
  const response = await fetch(`/api/products?shopId=${shopId}&count=true`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  if (!response.ok) throw new Error('Failed to fetch product count')
  const data = await response.json()
  return { data: data.total }
}

//get the products of a shop
export async function getShopProducts({
  shopId,
  fromPage = 0,
  toPage = 1,
}: {
  shopId: string
  fromPage?: number
  toPage?: number
}): Promise<{ data: Product[] }> {
  const token = await getAuthToken()
  const response = await fetch(
    `/api/products?shopId=${shopId}&fromPage=${fromPage}&toPage=${toPage}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  )
  if (!response.ok) throw new Error('Failed to fetch shop products')
  return await response.json()
}


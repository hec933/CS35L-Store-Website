import { Product } from '@/types'
import { getAuthToken } from '@/utils/auth'

//get a product
export async function getProduct(productId: string): Promise<{ data: Product }> {
  const token = await getAuthToken()
  const response = await fetch(`/api/products?id=${productId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  if (!response.ok) throw new Error('Failed to fetch product')
  return await response.json()
}


//get a list of products
export async function getProducts({
  fromPage = 0,
  toPage = 1
}: {
  fromPage?: number
  toPage?: number
}): Promise<{ data: Product[] }> {
  const token = await getAuthToken()
  const response = await fetch(
    `/api/products?fromPage=${fromPage}&toPage=${toPage}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  )
  if (!response.ok) throw new Error('Failed to fetch products')
  return await response.json()
}

//get products by yusing a keyword
export async function getProductsByKeyword({
  query,
  fromPage = 0,
  toPage = 1,
}: {
  query: string
  fromPage?: number
  toPage?: number
}): Promise<{ data: Product[] }> {
  const token = await getAuthToken()
  const response = await fetch(
    `/api/products?keyword=${encodeURIComponent(query)}&fromPage=${fromPage}&toPage=${toPage}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  )
  if (!response.ok) throw new Error('Failed to fetch products by keyword')
  return await response.json()
}

//get the products by category
export async function getProductsByTag(tag: string): Promise<{ data: Product[] }> {
  const token = await getAuthToken()
  const response = await fetch(
    `/api/products?tag=${encodeURIComponent(tag)}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  )
  if (!response.ok) throw new Error('Failed to fetch products by tag')
  return await response.json()
}

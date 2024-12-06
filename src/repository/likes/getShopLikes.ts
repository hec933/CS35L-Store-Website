import { Like } from '@/types'
import { getAuthToken } from '@/utils/auth'

type Params = {
    shopId: string
    fromPage?: number
    toPage?: number
}

//LIKES ARE ADDED TO CART

//get a shop likes
export async function getShopLikes({
    shopId,
    fromPage = 0,
    toPage = 1,
}: Params): Promise<{ data: Like[] }> {
    const token = await getAuthToken()
    const response = await fetch(
        `/api/cart?shopId=${shopId}&fromPage=${fromPage}&toPage=${toPage}`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    )
    if (!response.ok) throw new Error('Failed to fetch cart items')
    return await response.json()
}

//get a count of the shops likes
export async function getShopLikeCount(shopId: string): Promise<{ data: number }> {
    const token = await getAuthToken()
    const response = await fetch(`/api/cart/count?shopId=${shopId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    if (!response.ok) throw new Error('Failed to fetch cart count')
    const data = await response.json()
    return { data: data.total }
}

//get if liked of a certain product with shop because a user should purchase it from the shop they select it from
export async function getIsLikedWithProductIdAndShopId({
    productId,
    shopId,
}: {
    productId: string
    shopId: string
}): Promise<{ data: boolean }> {
    const token = await getAuthToken()
    const response = await fetch(
        `/api/cart/check?productId=${productId}&shopId=${shopId}`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    )
    if (!response.ok) throw new Error('Failed to check if item is in cart')
    return await response.json()
}

//update the list of likes
export async function updateLikeQuantity({
    likeId,
    quantity
}: {
    likeId: string,
    quantity: number
}): Promise<void> {
    const token = await getAuthToken()
    const response = await fetch(`/api/cart/${likeId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity })
    })
    if (!response.ok) throw new Error('Failed to update cart quantity')
}


//add an tiem to cart
export async function addToCart(productId: string): Promise<void> {
    const token = await getAuthToken()
    const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId })
    })
    if (!response.ok) throw new Error('Failed to add item to cart')
}

//remove an item from cart
export async function removeFromCart(likeId: string): Promise<void> {
    const token = await getAuthToken()
    const response = await fetch(`/api/cart/${likeId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    if (!response.ok) throw new Error('Failed to remove item from cart')
}





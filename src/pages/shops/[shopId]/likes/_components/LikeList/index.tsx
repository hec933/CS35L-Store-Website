import { useEffect, useState } from 'react'

import LikeItem from '../LikeItem'

import Text from '@/components/common/Text'
import Button from '@/components/common/Button'
import { getShopLikes } from '@/repository/shops/getShopLikes'
import { Like } from '@/types'

type Props = {
    initialLikes: Like[] 
    count: number
    shopId: string
}


export default function LikeList({ initialLikes, count, shopId }: Props) {
    const [likes, setLikes] = useState(
        (initialLikes || []).map((item) => ({ ...item, quantity: 1 })), 
    )
    const [totalPrice, setTotalPrice] = useState<number>(0) 

    useEffect(() => {
        ;(async () => {
            const { data } = await getShopLikes({
                shopId,
                fromPage: 0,
                toPage: 1,
            })
            if (Array.isArray(data)) { // Ensure data is an array
                setLikes(data.map((item) => ({ ...item, quantity: 1 })))
                const priceSum = data.reduce((sum, item) => sum + item.price * 1, 0) // Assume quantity = 1 initially
                setTotalPrice(priceSum)
            } else {
                setLikes([])
                setTotalPrice(0)
            }
        })()
    }, [shopId]) 
    
    //update quantity
    const handleQuantityChange = (id: string, delta: number) => {
        setLikes((prevLikes) => {
            const updatedLikes = prevLikes
                .map((item) => {
                    if (item.id === id) {
                        const updatedQuantity = Math.max(1, item.quantity + delta)
                        return { ...item, quantity: updatedQuantity }
                    }
                    return item
                })
                .filter((item) => item.quantity > 0) // Remove items with quantity 0
            return updatedLikes
        })
    }

    
    //calculate total
    useEffect(() => {
        const priceSum = likes.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
        )
        setTotalPrice(priceSum)
    }, [likes])

    
    //purchase TODO NOT IMPLEMENTED
    const handlePurchase = () => {
        alert('Purchase completed!')
    }



    
    return (
        <div>
            {likes.length === 0 ? ( // If no liked products exist
                <Text color="uclaBlue"> Cart is empty. </Text>
            ) : (
                <>
                    {/* Grid layout for displaying liked products */}
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {likes.map(({ id, productId, price, quantity }) => (
                            <div
                                key={id}
                                className="max-w-[180px] w-full mx-auto"
                            >
                                <LikeItem productId={productId} />

                                {/* Count */}
                                <div className="flex justify-between items-center mt-2 ">
                                    {/* - Button */}
                                    <Button
                                        className="p-2 bg-uclaBlue text-sm"
                                        onClick={() =>
                                            handleQuantityChange(id, -1)
                                        }
                                    >
                                        -
                                    </Button>

                                    {/* quantity */}
                                    <Text size="md">{quantity}</Text>

                                    {/* + Button */}
                                    <Button
                                        className="p-2 bg-uclaBlue text-sm"
                                        onClick={() =>
                                            handleQuantityChange(id, 1)
                                        }
                                    >
                                        +
                                    </Button>
                                </div>
                                <Text size="md" className="py-5 text-right">
                                    Price : ${(price * quantity).toFixed(2)}
                                </Text>
                            </div>
                        ))}
                    </div>

                    {/* Total Price and Purchase Button */}
                    <div className="mt-6 flex flex-col items-end">
                        {/* Display total price */}
                        <Text
                            size="lg"
                            color="darkestBlue"
                            className="mb-2 mr-4"
                        >
                            Total Price :{' '}
                            {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                            }).format(totalPrice)}
                        </Text>

                        {/* Purchase button */}
                        <Button
                            onClick={handlePurchase}
                            color="uclaBlue"
                            className="rounded-full"
                        >
                            Proceed to checkout
                        </Button>
                    </div>
                </>
            )}
        </div>
    )
}



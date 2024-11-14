import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { throttle } from 'lodash'

import Product from '@/components/common/Product'
import Spinner from '@/components/common/Spinner'
import { getProducts } from '@/repository/products/getProducts'
import { Product as TProduct } from '@/types'

type Props = {
    /** Initial product list */
    initialProducts: TProduct[]
}

export default function ProductList({ initialProducts }: Props) {
    // State to manage the product list
    const [products, setProducts] = useState<TProduct[]>(initialProducts)

    // Maximum number of items to display
    const MAX_ITEMS = 50

    // react-intersection-observer to detect when elements come into view
    const { ref, inView } = useInView({ threshold: 1 })
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isLastPage, setIsLastPage] = useState<boolean>(false)

    // Function to fetch products and append them to the list
    const fetchProducts = async ({
        fromPage,
        toPage,
    }: {
        fromPage: number
        toPage: number
    }) => {
        try {
            setIsLoading(true)
            const { data } = await getProducts({ fromPage, toPage })

            // Append new data to the previous product list, limiting to MAX_ITEMS
            setProducts((prevProducts) => {
                const updatedProducts = [...prevProducts, ...data]
                if (updatedProducts.length > MAX_ITEMS) {
                    return updatedProducts.slice(0, MAX_ITEMS)
                }
                return updatedProducts
            })

            // If no more data or maximum items reached, set isLastPage to true
            if (data.length === 0 || products.length >= MAX_ITEMS) {
                setIsLastPage(true)
            }
        } catch (error) {
            // Log an error message if the API request fails
            console.error('Failed to fetch products:', error)
        } finally {
            setIsLoading(false)
        }
    }

    // Throttle the fetchProducts function to limit how often it can be called
    const handleGetProducts = throttle(fetchProducts, 1000) // 1000ms throttle time

    useEffect(() => {
        // When the component mounts, fetch products up to page 2

        handleGetProducts({ fromPage: 0, toPage: 2 })
    }, [handleGetProducts])

    // Assume that the products are already loaded up to page 2
    const [page, setPage] = useState<number>(2)

    useEffect(() => {
        if (inView && !isLastPage) {
            // When inView becomes true and not the last page, fetch the next page
            handleGetProducts({ fromPage: page, toPage: page + 1 })
            setPage(page + 1)
        }
    }, [inView, isLastPage, handleGetProducts, page])

    // If there are no initial products and loading is not happening, show a message
    if (initialProducts.length === 0 && !isLoading) {
        return <div className="text-center">No products available</div>
        // empty
    }

    return (
        <div className="my-8">
            <div className="grid grid-cols-5 gap-4 my-3">
                {products.map(({ id, title, price, imageUrls, createdAt }) => (
                    <div key={id} className="rounded-lg overflow-hidden border">
                        <Product
                            title={title}
                            price={price}
                            // Use fallback image if image URL is missing
                            imageUrl={imageUrls[0] || 'fallback-image-url.jpg'}
                            createdAt={createdAt}
                        />
                    </div>
                ))}
            </div>
            {isLoading && (
                // Show a loading spinner when data is being loaded
                <div className="text-center mt-2">
                    <Spinner />
                </div>
            )}
            {!isLastPage &&
                !!products.length &&
                products.length < MAX_ITEMS && (
                    // Render an invisible div to track when it comes into view
                    <div ref={ref} />
                )}
        </div>
    )
}

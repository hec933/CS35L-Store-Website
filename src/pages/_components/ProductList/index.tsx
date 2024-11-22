import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useCallback } from 'react'
import { useInView } from 'react-intersection-observer'
import Product from '@/components/common/Product'
import Spinner from '@/components/common/Spinner'
import { getProducts } from '@/repository/products/getProducts'
import { Product as TProduct } from '@/types'

type Props = {
    initialProducts: TProduct[]
}

export default function ProductList({ initialProducts }: Props) {
    const [products, setProducts] = useState<TProduct[]>(initialProducts)
    // Maximum number of items to display
    const MAX_ITEMS = 50
    // react-intersection-observer to detect when elements come into view
    const { ref, inView } = useInView({ threshold: 1 })
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isLastPage, setIsLastPage] = useState<boolean>(false)

    // Function to fetch products and append them to the list
    const handleGetProducts = useCallback(
        async ({ fromPage, toPage }: { fromPage: number; toPage: number }) => {
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
                console.error('Error fetching products:', error)
                // Handle the error, e.g., display an error message
            } finally {
                setIsLoading(false)
            }
        },
        [MAX_ITEMS, products],
    )

    useEffect(() => {
        // When the component mounts, it fetches products up to page 2
        handleGetProducts({ fromPage: 0, toPage: 2 })
    }, [handleGetProducts])

    useEffect(() => {
        // Fetch more products when the user scrolls to the bottom of the page
        if (inView && !isLastPage && !isLoading) {
            (async () => {
                await handleGetProducts({
                    fromPage: Math.floor(products.length / 10),
                    toPage: Math.floor(products.length / 10) + 1,
                })
            })()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView])

    return (
        <div className="my-8 ">
            {products ? (
                <div className="grid grid-cols-5 gap-4 ">
                    {products.map(({ id, title, price, imageUrls, createdAt }) => (
                        <Link
                            key={id}
                            className="rounded-lg overflow-hidden border"
                            href={`/products/${id}`}
                        >
                            <Product
                                title={title}
                                price={price}
                                imageUrl={imageUrls[0]}
                                createdAt={createdAt}
                            />
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center">
                    <Spinner />
                </div>
            )}
            {!isLastPage &&
                !!products?.length &&
                products.length < MAX_ITEMS && <div ref={ref} />}
        </div>
    )
}

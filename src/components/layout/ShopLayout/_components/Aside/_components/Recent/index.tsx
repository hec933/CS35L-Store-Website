import { useCallback, useEffect, useMemo, useState } from 'react'
import RecentItem from './_components/RecentItem'
import Spinner from '@/components/common/Spinner'
import Text from '@/components/common/Text'
import { getProduct } from '@/repository/products/getProduct'
import { Product } from '@/types'
import { RECENT_ITEM_IDS_KEY, getRecentItemIds } from '@/utils/localstorage'
/**
 * Recent Products Component
 * Displays a list of recently viewed products, fetched from local storage, with pagination support.
 */
export default function Recent() {
    // Loading state for product data
    const [isLoading, setIsLoading] = useState(false)
    // List of recent products
    const [recentProducts, setRecentProducts] = useState<Product[]>([])
    // Current page in pagination
    const [currentPage, setCurrentPage] = useState(0)
    // Calculate total number of pages for pagination
    const totalPage = useMemo(
        () => Math.max(Math.ceil(recentProducts.length / 3) - 1, 0), // Each page contains 3 items
        [recentProducts],
    )
    // Adjust the current page if the total number of pages decreases
    useEffect(() => {
        setCurrentPage((_curPage) => Math.min(_curPage, totalPage))
    }, [totalPage])
    /**
     * Fetch and update recent products
     */
    const handleUpdateRecentProducts = useCallback(async () => {
        try {
            setIsLoading(true) // Show loading spinner
            const recentIds = getRecentItemIds() // Get recent product IDs from local storage
            const results = await Promise.all(
                recentIds.map((productId) => getProduct(productId)), // Fetch product data for each ID
            )
            const products = results.map(({ data }) => data) // Extract product data from API results
            setRecentProducts(products) // Update the state with recent products
        } finally {
            setIsLoading(false) // Hide loading spinner
        }
    }, [])
    /**
     * Fetch recent products when the component mounts
     */
    useEffect(() => {
        handleUpdateRecentProducts()
    }, [handleUpdateRecentProducts])
    useEffect(() => {
        // Define an event handler to trigger handleUpdateRecentProducts when the event RECENT_ITEM_IDS_KEY is dispatched
        const eventHandler = () => handleUpdateRecentProducts()

        // Add an event listener for RECENT_ITEM_IDS_KEY when the component mounts
        window.addEventListener(RECENT_ITEM_IDS_KEY, eventHandler)
        return () =>
            // Clean up: Remove the event listener when the component unmounts or when dependencies change
            window.removeEventListener(RECENT_ITEM_IDS_KEY, eventHandler)
    }, [handleUpdateRecentProducts])
    return (
        <div className="border border-uclaBlue p-2 bg-white flex flex-col items-center text-center">
            {/* Title */}
            <Text size="sm">Your Browsing History</Text>
            {/* Show loading spinner during data fetching  */}
            {isLoading ? (
                <div className="py-5">
                    <Spinner />
                </div>
            ) : recentProducts.length === 0 ? ( // No recent products found
                <div className="mt-2 text-center">
                    <Text size="xs" color="grey" className="block">
                        No recently viewed products.
                    </Text>
                </div>
            ) : (
                <>
                    {/* Total number of recent products */}
                    <Text size="sm" color="red" weight="bold">
                        {recentProducts.length}
                    </Text>
                    {/* Product list with pagination */}
                    <div className="border-t border-lightestBlue border-dashed pt-3 mt-2 flex flex-col gap-2">
                        {recentProducts
                            .slice(currentPage * 3, (currentPage + 1) * 3) // Show 3 items per page
                            .map(({ id, title, price, imageUrls }) => (
                                <RecentItem
                                    key={id}
                                    id={id}
                                    title={title}
                                    price={price}
                                    imageUrl={imageUrls[0]}
                                />
                            ))}
                    </div>
                    {/* Pagination controls  */}
                    <div className="flex justify-between items-center mt-2 gap-1">
                        {/* Previous page button  */}
                        <button
                            className="border border-uclaBlue h-5 w-5 flex justify-center items-center"
                            disabled={currentPage === 0} // Disable if on the first page
                            onClick={() => setCurrentPage(currentPage - 1)} // Navigate to previous page
                        >
                            <Text size="xs" color="uclaBlue">
                                {'<'}
                            </Text>
                        </button>
                        {/* Current page / Total pages  */}
                        <Text size="xs" color="uclaBlue">
                            {currentPage + 1} / {totalPage + 1}
                        </Text>
                        {/* Next page button  */}
                        <button
                            className="border border-uclaBlue h-5 w-5 flex justify-center items-center"
                            disabled={currentPage === totalPage} // Disable if on the last page
                            onClick={() => setCurrentPage(currentPage + 1)} // Navigate to next page
                        >
                            <Text size="xs" color="uclaBlue">
                                {'>'}
                            </Text>
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

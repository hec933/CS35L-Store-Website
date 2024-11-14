import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useEffect, useState } from 'react'
import Pagination from '@/components/common/Pagination'
import Product from '@/components/common/Product'
import Text from '@/components/common/Text'
import Container from '@/components/layout/Container'
import Wrapper from '@/components/layout/Wrapper'
import { getProductsByKeyword } from '@/repository/products/getProductsByKeyword'
import { Product as TProduct } from '@/types'
import { getProductsByKeywordCount } from '@/repository/products/getProductsByKeywordCount'

// Fetch products on the server side before rendering the page
export const getServerSideProps: GetServerSideProps<{
    products: TProduct[] // Array of products to be displayed
    query: string // The search query string
    count: number // Pagination number
}> = async (context) => {
    const originalQuery = context.query.query as string | undefined

    // Throw an error if no search query is provided
    if (!originalQuery) {
        throw new Error('No search query provided')
    }

    // Decode the search query from the URL
    const query = decodeURIComponent(originalQuery)

    // Fetch products using the search query
    const { data: products } = await getProductsByKeyword({
        query,
        fromPage: 0,
        toPage: 1,
    })

    // Fetch the total number of products matching the query
    const { data: count } = await getProductsByKeywordCount(query)

    // Return the fetched products and query as props
    return { props: { products, query, count } }
}

// Main component for displaying search results
export default function Search({
    products: initialProducts,
    query,
    count,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [products, setProducts] = useState<TProduct[]>(initialProducts)

    // State to track the current page, starting from 1 for user-facing pagination
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        ;(async () => {
            // Fetch products by keyword from the server
            const { data: products } = await getProductsByKeyword({
                query,
                // Adjust for server-side page offset, which starts from 0
                fromPage: currentPage - 1,
                toPage: currentPage,
            })

            // Update the product list state
            setProducts(products)
        })()
    }, [currentPage, query]) // Re-run when the current page or query changes

    return (
        <Wrapper>
            <Container>
                <div className="my-7 text-center">
                    {/* Display the search query */}
                    <Text size="lg" color="uclaBlue">
                        {query}
                    </Text>
                    <Text size="lg"> Results</Text>
                </div>
                <div className="grid grid-cols-5 gap-4 my-3">
                    {products.length === 0 ? (
                        // If no products found, show a message
                        <Text>No search results found.</Text>
                    ) : (
                        // If products are found, display them
                        products.map(
                            ({ id, title, price, createdAt, imageUrls }) => (
                                <div
                                    key={id}
                                    className="rounded-lg overflow-hidden border"
                                >
                                    <Product
                                        title={title}
                                        price={price}
                                        createdAt={createdAt}
                                        imageUrl={imageUrls[0]}
                                    />
                                </div>
                            ),
                        )
                    )}
                </div>

                {/* Pagination */}
                <div className="my-6 flex justify-center">
                    <Pagination
                        currentPage={currentPage}
                        count={count}
                        handlePageChange={(pageNumber) => {
                            setCurrentPage(pageNumber)
                        }}
                    />
                </div>
            </Container>
        </Wrapper>
    )
}

import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useEffect, useState } from 'react'

import SearchShopItem from './_components/SearchShopItem'
import Pagination from '@/components/common/Pagination'
import Text from '@/components/common/Text'
import Container from '@/components/layout/Container'
import Wrapper from '@/components/layout/Wrapper'
import { getShopsByKeyword } from '@/repository/shops/getShopsByKeyword'
import { getShopsByKeywordCount } from '@/repository/shops/getShopsByKeywordCount'
import { Shop } from '@/types'

// Fetch shop data from the server based on the search query
export const getServerSideProps: GetServerSideProps<{
    shops: Shop[] // List of shops to be displayed
    query: string // The search query string
    count: number // Total number of shops matching the query
}> = async (context) => {
    const originalQuery = context.query.query as string | undefined

    // Throw an error if no search query is provided
    if (!originalQuery) {
        throw new Error('No search query provided')
    }

    // Decode the search query from the URL
    const query = decodeURIComponent(originalQuery)

    // Fetch shops using the search query
    const [{ data: shops }, { data: count }] = await Promise.all([
        getShopsByKeyword({
            query,
            fromPage: 0,
            toPage: 1,
        }),
        getShopsByKeywordCount(query),
    ])

    // Return props to the component
    return { props: { shops, query, count } }
}

// Main component to display the search results
export default function SearchShop({
    shops: initialShops,
    query,
    count,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [shops, setShops] = useState<Shop[]>(initialShops)

    // State to manage the current page, starting from 1
    const [currentPage, setCurrentPage] = useState(1)

    // Reset current page to 1 when initial shops change
    useEffect(() => {
        setCurrentPage(1)
    }, [initialShops])

    useEffect(() => {
        // Fetch updated shop data when the current page or query changes
        ;(async () => {
            const { data: shops } = await getShopsByKeyword({
                query,
                // Adjust page number for server-side handling, starting from 0
                fromPage: currentPage - 1,
                toPage: currentPage,
            })
            setShops(shops)
        })()
    }, [currentPage, query])

    return (
        <Wrapper>
            <Container>
                <div className="my-7">
                    <Text size="lg">Search Results </Text>
                    <Text size="lg" color="uclaBlue" className="ml-1">
                        {count.toLocaleString()} results
                    </Text>
                </div>
                <div className="flex flex-col gap-3">
                    {shops.length === 0 ? (
                        <Text className="text-uclaBlue">
                            No search results found.
                        </Text>
                    ) : (
                        // Render the list of shops
                        shops.map(({ id, name, imageUrl }) => (
                            <SearchShopItem
                                key={id}
                                id={id}
                                name={name}
                                profileImageUrl={imageUrl || undefined}
                            />
                        ))
                    )}
                </div>

                {/* Pagination */}
                <div className="my-6 flex justify-center">
                    <Pagination
                        currentPage={currentPage}
                        count={count}
                        handlePageChange={(pageIndex) =>
                            setCurrentPage(pageIndex)
                        }
                    />
                </div>
            </Container>
        </Wrapper>
    )
}

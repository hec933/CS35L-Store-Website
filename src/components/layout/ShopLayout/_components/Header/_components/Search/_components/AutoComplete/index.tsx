import { throttle } from 'lodash'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import Text from '@/components/common/Text'
import { getProductsByKeyword } from '@/repository/products/getProductsByKeyword'
import { addRecentKeyword } from '@/utils/localstorage'

// Props type for the AutoComplete component
type Props = {
    query: string // The search query entered by the user
    handleClose: () => void // Function to handle closing the component
}

export default function AutoComplete({ query, handleClose }: Props) {
    // Search page router
    const router = useRouter()

    // State to store autocomplete keywords
    const [keywords, setKeywords] = useState<string[]>([])

    // Lodash Throttle
    const handleSearch = useMemo(
        () =>
            throttle(async (query: string) => {
                if (!query) {
                    setKeywords([])
                    return
                }
                const { data } = await getProductsByKeyword({
                    query,
                    fromPage: 0,
                    toPage: 2,
                })
                setKeywords(data.map(({ title }) => title))
            }, 500),
        [],
    )

    // Lodash throttle
    useEffect(() => {
        handleSearch(query)
    }, [handleSearch, query])

    return (
        <div className="flex flex-col h-full">
            <div className="p-2 overflow-hidden flex-1">
                {/* Header section for store search */}
                <div className="border-b border-grey-300 pb-1 mb-2 flex items-center">
                    <span className="material-symbols-outlined shrink-0">
                        storefront
                    </span>

                    <Text size="sm" className="ml-1 shrink-0">
                        Store Search {'>'}
                    </Text>

                    <Text
                        size="sm"
                        color="darkestBlue"
                        className="mx-1 truncate"
                    >
                        {query} {/* Display the search query */}
                    </Text>

                    <Text size="sm" color="lighterBlue" className="shrink-0">
                        Search by store
                    </Text>
                </div>

                {keywords.length === 0 ? (
                    // If there are no autocomplete keywords, show a message
                    <div className="h-full flex justify-center items-center">
                        <Text color="lighterBlue" size="sm">
                            No recommended keywords
                        </Text>
                    </div>
                ) : (
                    // If there are autocomplete keywords, display them in a scrollable container
                    <div className="h-full overflow-scroll pb-8">
                        {keywords.map((keyword) => (
                            <Text
                                size="sm"
                                key={keyword}
                                className="block my-1 truncate cursor-pointer"
                                onClick={() => {
                                    // Add the selected keyword to recent searches
                                    addRecentKeyword(keyword)
                                    // Navigate to the search results page with the selected keyword
                                    router.push(
                                        `/search?query=${encodeURIComponent(keyword)}`,
                                    )
                                }}
                            >
                                {keyword}
                            </Text>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer section with a close button */}
            <div className="bg-gray-100 flex justify-end items-center h-8 px-2">
                <Text
                    size="sm"
                    onClick={handleClose}
                    className="cursor-pointer"
                >
                    Close
                </Text>
            </div>
        </div>
    )
}

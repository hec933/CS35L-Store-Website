import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'

import Text from '@/components/common/Text'
import {
    RECENT_KEYWORDS_KEY,
    addRecentKeyword,
    clearRecentKeyword,
    getRecentKeywords,
} from '@/utils/localstorage'

// Recent Searches Bar

// Props type for the Recent component
type Props = {
    handleClose: () => void // Function to handle closing the component
}

export default function Recent({ handleClose }: Props) {
    // Use the Next.js router to handle page navigation
    const router = useRouter()

    // Array to store recent search terms
    const [recents, setRecents] = useState<string[]>([])

    const handleSetRecents = useCallback(() => {
        // Fetch recent search keywords
        const recents = getRecentKeywords()
        setRecents(recents)
    }, [])

    // Trigger the handleSetRecents function when the component mounts or when handleSetRecents changes
    useEffect(() => {
        handleSetRecents()
    }, [handleSetRecents])
    useEffect(() => {
        // Define an event handler to trigger handleSetRecents when the event RECENT_KEYWORDS_KEY is dispatched
        const eventHandler = () => handleSetRecents()

        // Add an event listener for RECENT_KEYWORDS_KEY when the component mounts
        window.addEventListener(RECENT_KEYWORDS_KEY, eventHandler)
        return () =>
            // Clean up: Remove the event listener when the component unmounts or when dependencies change
            window.removeEventListener(RECENT_KEYWORDS_KEY, eventHandler)
    }, [handleSetRecents])

    return (
        <div className="flex flex-col h-full">
            <div className="p-2 overflow-hidden flex-1">
                <div className="border-b border-uclaBlue pb-1 mb-2">
                    <Text size="sm" color="uclaBlue" weight="bold">
                        Recent Searches
                    </Text>
                </div>

                {recents.length === 0 ? (
                    // If there are no recent searches, display a message
                    <div className="h-full flex justify-center items-center">
                        <Text color="grey" size="sm">
                            No recent searches
                        </Text>
                    </div>
                ) : (
                    // If there are recent searches, display them in a scrollable container
                    <div className="h-full overflow-scroll pb-8">
                        {recents.map((recent) => (
                            <Text
                                size="sm"
                                key={recent}
                                className="block my-1 truncate cursor-pointer"
                                onClick={() => {
                                    addRecentKeyword(recent)
                                    router.push(
                                        `/search?query=${encodeURIComponent(recent)}`,
                                    )
                                }}
                            >
                                {recent}
                            </Text>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer section with 'Clear All' and 'Close' buttons */}
            <div className="bg-gray-100 flex justify-between items-center h-8 px-2">
                {/* Button to clear all recent searches */}
                <Text
                    size="sm"
                    onClick={clearRecentKeyword}
                    className="cursor-pointer"
                >
                    Clear All Searches
                </Text>

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

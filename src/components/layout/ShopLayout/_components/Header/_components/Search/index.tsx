import classNames from 'classnames'
import { useRouter } from 'next/router'
import { useState } from 'react'

import AutoComplete from './_components/AutoComplete'
import Recent from './_components/Recent'
import { addRecentKeyword } from '@/utils/localstorage'

// Search Bar Component
export default function Search() {
    // Use the Next.js router to handle page navigation
    const router = useRouter()

    // State to store search input and manage focus
    const [search, setSearch] = useState('')
    const [isFocused, setIsFocused] = useState(false)

    return (
        <div className="relative">
            {/* Search input container with styling */}
            <div className="w-[450px] border-2 border-uclaBlue px-4 py-2 rounded-lg">
                <form
                    className="flex justify-between"
                    onSubmit={(e) => {
                        e.preventDefault() // Prevent the default form submission behavior

                        // Add the current search term to the list of recent keywords
                        addRecentKeyword(search)

                        // Navigate to the search results page with the search query
                        router.push(
                            `/search?query=${encodeURIComponent(search)}`,
                        )
                    }}
                >
                    {/* Search input field */}
                    <input
                        className="w-full text-sm font-light outline-0 bg-lightestBlue px-2"
                        type="text"
                        placeholder="Search Product" // Placeholder for search input
                        value={search}
                        onFocus={() => setIsFocused(true)}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {/* Search button */}
                    <button className="flex justify-center items-center">
                        <span className="material-symbols-outlined">
                            search
                        </span>
                    </button>
                </form>
            </div>

            {/* Dropdown container for search suggestions */}
            <div
                className={classNames(
                    'absolute w-full bg-white border border-lighterBlue mt-2 h-96 rounded-lg',
                    { hidden: !isFocused },
                )}
            >
                {search ? (
                    // AutoComplete component when there is a search query
                    <AutoComplete
                        query={search}
                        handleClose={() => setIsFocused(false)}
                    />
                ) : (
                    // Recent searches component when no search query
                    <Recent handleClose={() => setIsFocused(false)} />
                )}
            </div>
        </div>
    )
}

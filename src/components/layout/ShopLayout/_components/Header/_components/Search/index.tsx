import classNames from 'classnames'
import { useState } from 'react'
import AutoComplete from './_components/AutoComplete'
import Recent from './_components/Recent'
import { addRecentKeyword } from '@/utils/localstorage'

// Search Bar Component
export default function Search() {
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
                        addRecentKeyword(search) // Add the current search term to the list of recent keywords
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
            {/* 검색 제안 목록을 위한 드롭다운 컨테이너 */}
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

import { useState } from 'react'

// Search Bar Components
export default function Search() {
    const [search, setSearch] = useState('')

    return (
        <div className="w-[450px] border-2 border-uclaBlue px-4 py-2 rounded-lg">
            <form className="flex justify-between">
                <input
                    // search bar
                    className="w-full text-sm font-light outline-0 bg-lightestBlue px-2"
                    type="text"
                    placeholder="Search" // search bar font
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button className="flex justify-center items-center">
                    <span className="material-symbols-outlined">search</span>
                </button>
            </form>
        </div>
    )
}

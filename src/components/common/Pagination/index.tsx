type Props = {
    /** The current page that the user is viewing */
    currentPage: number

    /** The total number of items (each page contains 10 items) */
    count: number

    /** Callback function called when the user changes the page */
    handlePageChange: (pageNumber: number) => void
}

// CSS class name for the pagination buttons
const btnClassName =
    'border border-uclaBlue px-2 py-2 flex justify-center items-center leading-none disabled:opacity-30 hover:bg-slate-200 rounded-xl'

// Pagination component
export default function Pagination({
    currentPage,
    count,
    handlePageChange,
}: Props) {
    // Calculate the total number of pages
    const totalPage = Math.ceil(count / 10)

    // Calculate the start and end page indices for pagination
    const startPageIndex = Math.max(1, Math.min(totalPage - 4, currentPage - 2))
    const endPageIndex = Math.min(startPageIndex + 4, totalPage)

    // If there are less than 2 pages, do not render the pagination
    if (totalPage < 2) {
        return null
    }

    return (
        <div className="flex gap-1 my-3">
            {/* Previous button */}
            <button
                className={btnClassName}
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
            >
                Previous
            </button>

            {/* Page number buttons */}
            {Array.from({ length: endPageIndex - startPageIndex + 1 }).map(
                (_, idx) => {
                    const pageIndex = startPageIndex + idx
                    return (
                        <button
                            className={btnClassName}
                            key={pageIndex}
                            disabled={pageIndex === currentPage}
                            onClick={() => handlePageChange(pageIndex)}
                        >
                            {pageIndex}
                        </button>
                    )
                },
            )}

            {/* Next button */}
            <button
                className={btnClassName}
                disabled={currentPage === totalPage}
                onClick={() => handlePageChange(currentPage + 1)}
            >
                Next
            </button>
        </div>
    )
}

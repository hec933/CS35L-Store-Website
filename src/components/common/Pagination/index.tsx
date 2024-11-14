type Props = {
    /** The current page the user is viewing 현재 사용자가 보고 있는 페이지 */
    currentPage: number
    /** The total number of items (each page should contain 10 items) */
    count: number
    /** Callback function triggered when the user changes the page */
    handlePageChange: (pageNumber: number) => void
}
// Class name for the pagination buttons
const btnClassName =
    'border border-uclaBlue px-2 py-2 flex justify-center items-center leading-none disabled:opacity-30 hover:bg-slate-200'
export default function Pagination({
    currentPage,
    count,
    handlePageChange,
}: Props) {
    // Calculate the total number of pages
    const totalPage = Math.ceil(count / 10)

    // Determine the starting page index, ensuring it's within a valid range
    const startPageIndex = Math.max(1, Math.min(totalPage - 4, currentPage - 2))

    // Determine the ending page index, ensuring it's within a valid range
    const endPageIndex = Math.min(startPageIndex + 4, totalPage)

    // If there is only one page, do not render pagination
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
            {/* Generate page buttons dynamically */}
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

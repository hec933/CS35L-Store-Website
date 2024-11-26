import Link from 'next/link'
import { useState } from 'react'
import Image from 'next/image'
import Text from '@/components/common/Text'
import { removeRecentItemId } from '@/utils/localstorage'
type Props = {
    id: string
    title: string
    price: number
    imageUrl: string
}
/**
 * RecentItem Component
 * Displays a recent product item with hover effects and an option to remove it.
 */
export default function RecentItem({ id, title, price, imageUrl }: Props) {
    // Hover state to toggle views
    const [isHover, setIsHover] = useState(false)
    return (
        <div
            onMouseEnter={() => setIsHover(true)} // Show detailed view on hover
            onMouseLeave={() => setIsHover(false)} // Revert to thumbnail view
        >
            <Link href={`/products/${id}`}>
                {/* Default view: Thumbnail image */}
                {!isHover ? (
                    <div className="w-16 h-16 border border-lightestBlue relative">
                        <Image
                            src={imageUrl}
                            alt={title}
                            fill
                            className="object-cover" // Maintain aspect ratio and cover the area
                        />
                    </div>
                ) : (
                    // Hover view: Display product details and remove button
                    <div className="w-16 h-16 relative">
                        <div className="absolute top-0 right-0 h-16 w-52 bg-white flex">
                            {/* Remove button */}
                            <div
                                className="absolute bg-uclaBlue flex justify-center items-center text-white cursor-pointer"
                                style={{ width: 20, height: 20, left: -20 }}
                                // Remove item from recent list
                                onClick={(e) => {
                                    e.preventDefault()
                                    removeRecentItemId(id)
                                }}
                            >
                                <span
                                    className="material-symbols-outlined"
                                    style={{ fontSize: '1rem' }}
                                >
                                    close
                                </span>
                            </div>
                            {/* Product details */}
                            <div className="flex-1 overflow-hidden px-2 flex flex-col justify-center gap-2 border-uclaBlue border-t border-l border-b">
                                <Text size="xs" className="truncate">
                                    {title}
                                </Text>
                                {/* Format price in USD */}
                                <Text size="sm">{price.toFixed(2)} $ </Text>
                            </div>
                            {/* Product thumbnail */}
                            <div className="w-16 h-16 shrink-0 border-t border-b border-r border-uclaBlue relative">
                                <Image
                                    src={imageUrl}
                                    alt={title}
                                    fill
                                    className="object-cover" // Maintain aspect ratio and cover the area
                                />
                            </div>
                        </div>
                    </div>
                )}
            </Link>
        </div>
    )
}

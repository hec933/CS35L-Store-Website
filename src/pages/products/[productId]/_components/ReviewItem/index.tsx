import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/en'
import { useEffect, useState } from 'react'
import ShopProfileImage from '@/components/common/ShopProfileImage'
import Spinner from '@/components/common/Spinner'
import Text from '@/components/common/Text'
import { getShop } from '@/repository/shops/getShop'
import { Shop } from '@/types'

type Props = {
    contents: string // Review contents
    createdBy: string // ID of the shop that created the review
    createdAt: string // Timestamp of when the review was created
}

// Extend dayjs with the relativeTime plugin and set the locale to English (US)
dayjs.extend(relativeTime).locale('en')

// Main component for displaying a review item
export default function ReviewItem({ contents, createdAt, createdBy }: Props) {
    const [reviewer, setReviewer] = useState<Shop>() // State to hold the reviewer's shop data

    // Fetch the shop data for the reviewer when the component mounts
    useEffect(() => {
        ;(async () => {
            const { data } = await getShop(createdBy) // Fetch the shop data
            setReviewer(data) // Set the reviewer data in state
        })()
    }, [createdBy])

    // If the reviewer data is not yet loaded, display a loading spinner
    if (!reviewer) {
        return (
            <div className="flex my-2 py-2">
                <div className="flex justify-center items-center w-full h-32 border border-dashed">
                    <Spinner />
                </div>
            </div>
        )
    }

    // Render the review item with reviewer information
    return (
        <div className="flex my-2 py-2">
            <ShopProfileImage imageUrl={reviewer.imageUrl || undefined} />{' '}
            {/* Shop profile image */}
            <div className="ml-4 border-b pb-2 flex-1 w-0">
                <div className="flex justify-between">
                    <div className="truncate pr-1">
                        <Text color="grey" size="sm">
                            {/* Reviewer's shop name */}
                            {reviewer.name}{' '}
                        </Text>
                    </div>
                    <div className="shrink-0">
                        <Text color="grey" size="sm">
                            {/* Relative time of review creation in US format */}
                            {dayjs(createdAt).fromNow()}{' '}
                        </Text>
                    </div>
                </div>
                <div className="py-2">
                    {/* Review contents  */}
                    {contents}
                </div>
            </div>
        </div>
    )
}

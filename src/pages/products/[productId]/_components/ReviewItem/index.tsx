import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/en'
import { useEffect, useState } from 'react'
import ShopProfileImage from '@/components/common/ShopProfileImage'
import Spinner from '@/components/common/Spinner'
import Text from '@/components/common/Text'
import { fetchWithAuthToken } from '@/utils/auth'
import { Shop } from '@/types'

dayjs.extend(relativeTime).locale('en')

export default function ReviewItem({ contents, createdAt, createdBy }: { contents: string, createdBy: string, createdAt: string }) {
    const [reviewer, setReviewer] = useState<Shop | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        ;(async () => {
            try {
                const { data } = await fetchWithAuthToken(`/api/shops/${createdBy}`, 'GET')
                setReviewer(data)
            } catch {
                console.error('Failed to fetch shop data')
            } finally {
                setLoading(false)
            }
        })()
    }, [createdBy])

    if (loading) {
        return (
            <div className="flex my-2 py-2">
                <div className="flex justify-center items-center w-full h-32 border border-dashed">
                    <Spinner />
                </div>
            </div>
        )
    }

    if (!reviewer) {
        return (
            <div className="flex my-2 py-2">
                <Text color="red" size="sm">Failed to load reviewer details.</Text>
            </div>
        )
    }

    return (
        <div className="flex my-2 py-2">
            <ShopProfileImage imageUrl={reviewer.imageUrl || undefined} />
            <div className="ml-4 border-b border-lightestBlue pb-2 flex-1 w-0">
                <div className="flex justify-between">
                    <div className="truncate pr-1">
                        <Text color="black" size="sm">
                            {reviewer.name}
                        </Text>
                    </div>
                    <div className="shrink-0">
                        <Text color="uclaBlue" size="sm">
                            {dayjs(createdAt).fromNow()}
                        </Text>
                    </div>
                </div>
                <div className="py-2">
                    {contents}
                </div>
            </div>
        </div>
    )
}

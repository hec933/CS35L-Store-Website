import classNames from 'classnames'
import ShopProfileImage from '../ShopProfileImage'
import Text from '../Text'

interface Props {
    // The name of the shop
    name: string

    // URL of the shop profile image
    profileImageUrl?: string

    // Number of products listed in the shop
    productCount: number

    // Number of followers of the shop
    followerCount: number

    // View type of the shop component
    type?: 'row' | 'column'

    // Callback function triggered when the shop title area is clicked
    handleClickTitle?: () => void

    // Callback function triggered when the shop profile image area is clicked
    handleClickProfileImage?: () => void

    // Callback function triggered when the ProductCount area is clicked
    handleClickProductCount?: () => void

    // Callback function triggered when the FollowerCount area is clicked
    handleClickFollowerCount?: () => void
}

// Component for displaying shop information
export default function Shop({
    name,
    profileImageUrl,
    productCount,
    followerCount,
    handleClickTitle,
    handleClickProfileImage,
    handleClickProductCount,
    handleClickFollowerCount,
    type = 'row',
}: Props) {
    return (
        <div
            className={classNames(
                'flex',
                {
                    'flex-row': type === 'row',
                    'flex-col': type === 'column',
                },
                type === 'column' && 'gap-1 items-center',
            )}
        >
            <div
                className={classNames(
                    'w-14',
                    handleClickProfileImage && 'cursor-pointer',
                )}
                onClick={handleClickProfileImage}
            >
                <ShopProfileImage imageUrl={profileImageUrl} />
            </div>
            <div
                className={classNames(
                    'flex flex-col overflow-hidden',
                    type === 'row' && 'ml-3 justify-around',
                    type === 'column' && 'w-full',
                )}
            >
                <div
                    className={classNames(
                        'truncate',
                        type === 'column' && 'text-center',
                        handleClickTitle && 'cursor-pointer',
                    )}
                    onClick={handleClickTitle}
                >
                    <Text>{name}</Text>
                </div>
                <Text
                    size="sm"
                    color={type === 'row' ? 'grey' : 'black'}
                    className={classNames(
                        'flex gap-2',
                        type === 'column' && 'justify-center',
                    )}
                >
                    <div
                        className={classNames(
                            handleClickProductCount && 'cursor-pointer',
                        )}
                        onClick={handleClickProductCount}
                    >
                        Products {productCount.toLocaleString()}
                    </div>
                    <div
                        className={classNames(
                            handleClickFollowerCount && 'cursor-pointer',
                        )}
                        onClick={handleClickFollowerCount}
                    >
                        Followers {followerCount.toLocaleString()}
                    </div>
                </Text>
            </div>
        </div>
    )
}

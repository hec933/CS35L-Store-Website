import classNames from 'classnames'

interface Props {
    // URL of the shop profile image
    imageUrl?: string

    // Additional className for customization
    className?: string
}

/**
 * Component for displaying a shop profile image.
 * If the imageUrl prop is not provided, it shows a default shop icon.
 */
export default function ShopProfileImage({ imageUrl, className }: Props) {
    // When no image is provided
    if (!imageUrl) {
        return (
            <div
                className={classNames(
                    className,
                    'rounded-full w-14 h-14 bg-cover bg-center', // image bg center
                )}
            >
                <span className="material-symbols-outlined text-slate-500">
                    storefront
                </span>
            </div>
        )
    }

    // When an image is provided
    return (
        <div
            className={classNames(className, 'rounded-full w-14 h-14 bg-cover')}
            style={{ backgroundImage: `url(${imageUrl})` }}
        />
    )
}

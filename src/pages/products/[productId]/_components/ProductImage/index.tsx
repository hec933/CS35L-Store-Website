import { Carousel } from 'react-responsive-carousel'
import Image from 'next/image'
import 'react-responsive-carousel/lib/styles/carousel.min.css' // requires a loader

type Props = {
    imageUrls: string[]
}
export default function ProductImage({ imageUrls = [] }: Props) {
    // export default function ProductImage({ imageUrls }: Props) {
    return (
        <Carousel infiniteLoop showThumbs={false} showStatus={false}>
            {imageUrls.map((url, index) => (
                <div key={index} className="relative w-96 h-96">
                    {' '}
                    <Image
                        src={url}
                        alt={`Product image ${index + 1}`}
                        fill
                        className="object-cover"
                    />
                </div>
            ))}
        </Carousel>
    )
}

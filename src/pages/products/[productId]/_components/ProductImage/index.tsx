import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css' // requires a loader

type Props = {
    imageUrls: string[]
}
export default function ProductImage({ imageUrls = [] }: Props) {
    // export default function ProductImage({ imageUrls }: Props) {
    return (
        <Carousel infiniteLoop showThumbs={false} showStatus={false}>
            {imageUrls.map((url) => (
                <img key={url} src={url} alt="" className="w-96 h-96" />
            ))}
        </Carousel>
    )
}

// export default function ProductImage({ imageUrls = [] }: Props) {
//     return (
//         <Carousel infiniteLoop showThumbs={false} showStatus={false}>
//             {imageUrls.map((url) => (
//                 <div key={url} className="w-96 h-96 relative">
//                     <Image
//                         src={url}
//                         alt=""
//                         layout="fill"
//                         objectFit="cover" // Adjust to your desired fit style
//                     />
//                 </div>
//             ))}
//         </Carousel>
//     )
// }

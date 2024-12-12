import { Carousel } from 'react-responsive-carousel';
import Image from 'next/image';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

type Props = {
  imageUrls: string[];
};


//image container for product
export default function ProductImage({ imageUrls }: Props) {
  if (!imageUrls || imageUrls.length === 0) {
    return (
      <div className="flex justify-center items-center w-96 h-96 border border-dashed">
        <span>No images available</span>
      </div>
    );
  }

  return (
    <Carousel infiniteLoop showThumbs={false} showStatus={false}>
      {imageUrls.map((url, index) => (
        url ? (
          <div key={index} className="relative w-96 h-96">
            <Image src={url} alt={`Product image ${index + 1}`} fill className="object-cover" />
          </div>
        ) : (
          <div key={index} className="relative w-96 h-96 border border-dashed">
            <span>Invalid image</span>
          </div>
        )
      ))}
    </Carousel>
  );
}

import { faker } from '@faker-js/faker'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css' // requires a loader

// Banner component that displays a carousel of images
export default function Banner() {
    // Carousel component from react-responsive-carousel library
    return (
        <Carousel
            className="my-8 " // Adds margin to the carousel
            infiniteLoop // Enables infinite looping of the carousel slides
            showThumbs={false} // Hides the thumbnail previews
            showStatus={false} // Hides the slide status indicator
        >
            {Array.from({ length: 3 }).map((_, idx) => (
                // Creates an array of 3 items to generate three slides
                <div key={idx} className="h-96">
                    <img
                        src={faker.image.dataUri()}
                        className="w-full h-full rounded-lg"
                    />
                </div>
            ))}
        </Carousel>
    )
}

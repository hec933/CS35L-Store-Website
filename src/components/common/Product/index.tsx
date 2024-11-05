import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/en";
import Text from "../Text";

interface Props {
    // Product name
    title: string;

    // Product price
    price: number;

    // Product registration time
    createdAt: string;

    // Product main image URL
    imageUrl: string;

    // Whether the product is sold out
    isSoldOut?: boolean;
}

// Extend dayjs with relativeTime
dayjs.extend(relativeTime).locale("en");

// Component for displaying a product preview
export default function Product({
    title,
    price,
    createdAt,
    imageUrl,
    isSoldOut,
}: Props) {
    return (
        <div className="flex flex-col border border-slate-300 relative">
            {isSoldOut && (
                <div className="absolute top-0 left-0 w-full h-full bg-slate-900 opacity-70 flex justify-center items-center">
                    <Text color="white">Sold Out</Text>
                </div>
            )}
            <div
                className="h-36 bg-cover bg-center"
                style={{ backgroundImage: `url(${imageUrl})` }}
            />
            <div className="h-20 flex flex-col px-3 justify-center">
                <Text className="text-ellipsis overflow-hidden whitespace-nowrap block">
                    {title}
                </Text>
                <div className="flex justify-between">
                    <div>
                        <Text weight="bold">
                            {"$ " +
                                new Intl.NumberFormat("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }).format(price)}
                        </Text>
                    </div>
                    <Text weight="light" color="grey" size="sm">
                        {dayjs(createdAt).fromNow()}
                    </Text>
                </div>
            </div>
        </div>
    );
}

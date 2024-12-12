import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import Text from '@/components/common/Text';
import { removeRecentItemId } from '@/utils/localstorage';

type Props = {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
};

export default function RecentItem({ id, title, price, imageUrl }: Props) {
    const [isHover, setIsHover] = useState(false);

    const handleRemoveRecent = (e: React.MouseEvent) => {
        e.preventDefault();
        removeRecentItemId(id);
    };

    return (
        <div
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            <Link href={`/products/${id}`} passHref>
                <a>
                    {!isHover ? (
                        <div className="w-16 h-16 border border-lightestBlue relative">
                            <Image
                                src={imageUrl}
                                alt={title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-16 h-16 relative">
                            <div className="absolute top-0 right-0 h-16 w-52 bg-white flex">
                                <button
                                    className="absolute bg-uclaBlue flex justify-center items-center text-white cursor-pointer"
                                    style={{ width: 20, height: 20, left: -20 }}
                                    onClick={handleRemoveRecent}
                                >
                                    <span
                                        className="material-symbols-outlined"
                                        style={{ fontSize: '1rem' }}
                                    >
                                        close
                                    </span>
                                </button>
                                <div className="flex-1 overflow-hidden px-2 flex flex-col justify-center gap-2 border-uclaBlue border-t border-l border-b">
                                    <Text size="xs" className="truncate">
                                        {title}
                                    </Text>
                                    <Text size="sm">{price.toFixed(2)} $</Text>
                                </div>
                                <div className="w-16 h-16 shrink-0 border-t border-b border-r border-uclaBlue relative">
                                    <Image
                                        src={imageUrl}
                                        alt={title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </a>
            </Link>
        </div>
    );
}

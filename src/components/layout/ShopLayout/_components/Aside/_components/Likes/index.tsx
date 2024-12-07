import Link from 'next/link';
import { useEffect, useState } from 'react';
import Spinner from '@/components/common/Spinner';
import Text from '@/components/common/Text';
import { fetchWithAuthToken } from '@/utils/auth';


//a Liked product is added to the cart 
export default function Likes() {
    const [shopId, setShopId] = useState<string | null>(null);
    const [likeCount, setLikeCount] = useState<number | undefined>(undefined);

    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const meResponse = await fetchWithAuthToken('/api/me', 'GET');
                const { shopId } = meResponse.data;

                if (!shopId) {
                    setLikeCount(0);
                    return;
                }

                const likeResponse = await fetchWithAuthToken(
                    `/api/shops/${shopId}/likeCount`,
                    'GET',
                );
                setShopId(shopId);
                setLikeCount(likeResponse.data);
            } catch (error) {
                console.error('Error fetching like count:', error);
                setLikeCount(0);
            }
        };

        fetchLikes();
    }, []);

    return (
        <Link
            href={!shopId ? '#' : `/shops/${shopId}/likes`}
            className="p-4 flex items-center justify-between cursor-pointer hover:scale-110 transition-transform duration-200"
            aria-label="Cart Section"
        >
            <div className="flex items-center gap-3 mr-2">
                <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '1.5rem' }}
                >
                    shopping_cart
                </span>
                {likeCount === undefined ? (
                    <Spinner />
                ) : (
                    <Text size="lg" color="uclaBlue">
                        {likeCount}
                    </Text>
                )}
            </div>
            <Text size="md">Cart</Text>
        </Link>
    );
}

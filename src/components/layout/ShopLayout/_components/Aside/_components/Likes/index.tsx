import Link from 'next/link';
import { useEffect, useState } from 'react';
import Spinner from '@/components/common/Spinner';
import Text from '@/components/common/Text';
import { fetchWithAuthToken } from '@/utils/auth';

export default function Likes() {
    const [cartCount, setCartCount] = useState<number | undefined>(undefined);

    useEffect(() => {
        let mounted = true;

        fetchWithAuthToken('/api/cart', 'POST', {
            action: 'fetch',
        }).then(({ data }) => {
            if (mounted) {
                setCartCount(data?.length || 0);
            }
        }).catch(error => {
            console.error('Error fetching cart count:', error);
            if (mounted) {
                setCartCount(0);
            }
        });

        return () => { mounted = false; };
    }, []);

    return (
        <Link
            href="/cart"
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
                {cartCount === undefined ? (
                    <Spinner />
                ) : (
                    <Text size="lg" color="uclaBlue">
                        {cartCount}
                    </Text>
                )}
            </div>
            <Text size="md">Cart</Text>
        </Link>
    );
}
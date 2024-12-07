import { throttle } from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import Text from '@/components/common/Text';
import { fetchWithAuthToken } from '@/utils/auth'; // Updated to use fetchWithAuthToken
import { addRecentKeyword } from '@/utils/localstorage';

type Props = {
    query: string;
    handleClose: () => void;
};

export default function AutoComplete({ query, handleClose }: Props) {
    const router = useRouter();
    const [keywords, setKeywords] = useState<string[]>([]);

    const handleSearch = useMemo(
        () =>
            throttle(async (query: string) => {
                if (!query) {
                    setKeywords([]);
                    return;
                }
                try {//use helper util to auth and get up to 2 pages of autocomplete results
                    const { data } = await fetchWithAuthToken(
                        `/api/products?keyword=${encodeURIComponent(query)}&fromPage=0&toPage=2`,
                    );
                    setKeywords(data.map(({ title }) => title));
                } catch (error) {
                    console.error('Error fetching autocomplete keywords:', error);
                }
            }, 500),
        [],
    );

    useEffect(() => {
        handleSearch(query);
    }, [handleSearch, query]);

    return (
        <div className="flex flex-col h-full">
            {/* Remainder of the component remains unchanged */}
        </div>
    );
}


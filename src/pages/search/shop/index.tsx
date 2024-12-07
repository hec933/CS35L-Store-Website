import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useEffect, useState } from 'react';
import SearchShopItem from './_components/SearchShopItem';
import Pagination from '@/components/common/Pagination';
import Text from '@/components/common/Text';
import Container from '@/components/layout/Container';
import Wrapper from '@/components/layout/Wrapper';
import { getShopsByKeyword } from '@/repository/shops/getShopsByKeyword';
import { getShopsByKeywordCount } from '@/repository/shops/getShopsByKeywordCount';
import { Shop } from '@/types';
import { getAuthToken } from '@/utils/auth';

export const getServerSideProps: GetServerSideProps<{
    shops: Shop[];
    query: string;
    count: number;
}> = async (context) => {
    const originalQuery = context.query.query as string | undefined;

    if (!originalQuery) {
        throw new Error('No search query provided');
    }

    const query = decodeURIComponent(originalQuery);

    try {
        const [{ data: shops }, { data: count }] = await Promise.all([
            getShopsByKeyword({
                query,
                fromPage: 0,
                toPage: 1,
            }),
            getShopsByKeywordCount(query),
        ]);

        return { props: { shops, query, count } };
    } catch (error) {
        console.error('Error fetching shop data:', error);
        return { props: { shops: [], query, count: 0 } };
    }
};

export default function SearchShop({
    shops: initialShops,
    query,
    count,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [shops, setShops] = useState<Shop[]>(initialShops);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setCurrentPage(1);
    }, [initialShops]);

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const token = await getAuthToken();
                const response = await fetch(`/api/shops?query=${encodeURIComponent(query)}&fromPage=${currentPage - 1}&toPage=${currentPage}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    console.error('Failed to fetch shop data:', response.status);
                    setShops([]);
                    return;
                }

                const { data: shops } = await response.json();
                setShops(shops);
            } catch (error) {
                console.error('Error fetching shops:', error);
                setShops([]);
            }
        };

        fetchShops();
    }, [currentPage, query]);

    return (
        <Wrapper>
            <Container>
                <div className="my-7">
                    <Text size="lg">Search Results </Text>
                    <Text size="lg" color="uclaBlue" className="ml-1">
                        {count.toLocaleString()} results
                    </Text>
                </div>
                <div className="flex flex-col gap-3">
                    {shops.length === 0 ? (
                        <Text className="text-uclaBlue">No search results found.</Text>
                    ) : (
                        shops.map(({ id, name, imageUrl }) => (
                            <SearchShopItem
                                key={id}
                                id={id}
                                name={name}
                                profileImageUrl={imageUrl || undefined}
                            />
                        ))
                    )}
                </div>
                <div className="my-6 flex justify-center">
                    <Pagination
                        currentPage={currentPage}
                        count={count}
                        handlePageChange={(pageIndex) => setCurrentPage(pageIndex)}
                    />
                </div>
            </Container>
        </Wrapper>
    );
}

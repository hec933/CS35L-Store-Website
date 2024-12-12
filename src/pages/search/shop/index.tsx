import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useEffect, useState } from 'react';
import SearchShopItem from './_components/SearchShopItem';
import Pagination from '@/components/common/Pagination';
import Text from '@/components/common/Text';
import Container from '@/components/layout/Container';
import Wrapper from '@/components/layout/Wrapper';
import { fetchWithAuthToken } from '@/utils/auth';
import { Shop } from '@/types';


export const getServerSideProps: GetServerSideProps<{
  shops: Shop[];
  query: string;
  count: number;
}> = async (context) => {
  const { query: keyword } = context.query;

  if (!keyword) {
    return { props: { shops: [], query: '', count: 0 } };
  }

  try {
    const { data: shops } = await fetchWithAuthToken('/api/shops', 'POST', {
      keyword,
      fromPage: 0,
      toPage: 1,
    });

    // Count is assumed from the shops length; backend can support a count-only request if necessary
    const count = shops.length;

    return { props: { shops, query: keyword, count } };
  } catch (error) {
    console.error('Error fetching shop data:', error);
    return { props: { shops: [], query: '', count: 0 } };
  }
};

//search for shops
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
        const { data: fetchedShops } = await fetchWithAuthToken('/api/shops', 'POST', {
          keyword: query,
          fromPage: currentPage - 1,
          toPage: currentPage,
        });

        setShops(fetchedShops);
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
          <Text size="lg">Search Results</Text>
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


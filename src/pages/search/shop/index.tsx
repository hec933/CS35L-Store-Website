import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react'; 
import Pagination from '@/components/common/Pagination';
import Text from '@/components/common/Text';
import Container from '@/components/layout/Container';
import Wrapper from '@/components/layout/Wrapper';
import { fetchWithAuthToken } from '@/utils/auth';
import { Shop } from '@/types';

interface ShopsResponse {
  data: Shop[];
}

async function getShops(params: {
  keyword?: string;
  fromPage?: string;
  toPage?: string;
  shopId?: string;
}): Promise<ShopsResponse> {
  const response = await fetchWithAuthToken('/api/shops', 'POST', params);
  if (!response || !response.data) {
    throw new Error('Failed to fetch shops');
  }
  return response;
}

export const getServerSideProps: GetServerSideProps<{
  shops: Shop[];
  query: string;
  count: number;
}> = async (context) => {
  const keyword = context.query.keyword;
  
  if (!keyword) {
    return { props: { shops: [], query: '', count: 0 } };
  }

  try {
    const queryValue = Array.isArray(keyword) ? keyword[0] : keyword;
    const { data: shops } = await getShops({
      keyword: queryValue,
      fromPage: '0',
      toPage: '1'
    });

    return {
      props: {
        shops: shops ?? [],
        query: queryValue,
        count: shops?.length ?? 0
      },
    };
  } catch (error) {
    console.error('Error fetching shops:', error);
    return { props: { shops: [], query: '', count: 0 } };
  }
};

const ShopSearch = ({
  shops: initialShops,
  query,
  count,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [shops, setShops] = useState<Shop[]>(initialShops);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [initialShops]);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const { data: fetchedShops } = await getShops({
          keyword: query,
          fromPage: String(currentPage - 1),
          toPage: String(currentPage)
        });
        setShops(fetchedShops);
      } catch (error) {
        console.error('Error fetching shops:', error);
      }
    };

    fetchShops();
  }, [currentPage, query]);

  return (
    <Wrapper>
      <Container>
        <div className="my-7 text-center">
          <Text size="lg" color="uclaBlue">{query}</Text>
          <Text size="lg"> Results</Text>
        </div>
        <div className="grid grid-cols-5 gap-4 my-3">
          {shops.length === 0 ? (
            <Text>No search results found.</Text>
          ) : (
            shops.map((shop) => (
              <Link
                key={shop.id}
                className="rounded-lg overflow-hidden border"
                href={`/shops/${shop.id}`}
              >
                <div className="p-4">
                  <Text size="lg">{shop.name}</Text>
                </div>
              </Link>
            ))
          )}
        </div>
        <div className="my-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            count={count}
            handlePageChange={setCurrentPage}
          />
        </div>
      </Container>
    </Wrapper>
  );
};

export default ShopSearch;

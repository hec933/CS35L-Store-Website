import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import Pagination from '@/components/common/Pagination';
import Product from '@/components/common/Product';
import Text from '@/components/common/Text';
import Container from '@/components/layout/Container';
import Wrapper from '@/components/layout/Wrapper';
import { getProducts } from '@/repository/products'; // Unified function for all types of search
import { Product as TProduct } from '@/types';


export const getServerSideProps: GetServerSideProps<{
  products: TProduct[];
  query: string;
  count: number;
}> = async (context) => {
  const { keyword, tag, name } = context.query;

  const queryType = keyword ? 'keyword' : tag ? 'tag' : name ? 'name' : null;

  if (!queryType) {
    return { props: { products: [], query: '', count: 0 } };
  }

  try {
    const queryValue = keyword || tag || name;
    const [{ data: products }, { data: count }] = await Promise.all([
      getProducts({ query: queryValue as string, fromPage: 0, toPage: 1 }),
      getProducts({ query: queryValue as string, countOnly: true }),
    ]);

    return {
      props: { products, query: queryValue, count },
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { props: { products: [], query: '', count: 0 } };
  }
};

//query back end
const Search = ({
  products: initialProducts,
  query,
  count,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [products, setProducts] = useState<TProduct[]>(initialProducts);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [initialProducts]);

  useEffect(() => {
    (async () => {
      try {
        const { data: fetchedProducts } = await getProducts({
          query,
          fromPage: currentPage - 1,
          toPage: currentPage,
        });

        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    })();
  }, [currentPage, query]);

  return (
    <Wrapper>
      <Container>
        <div className="my-7 text-center">
          <Text size="lg" color="uclaBlue">{query}</Text>
          <Text size="lg"> Results</Text>
        </div>
        <div className="grid grid-cols-5 gap-4 my-3">
          {products.length === 0 ? (
            <Text>No search results found.</Text>
          ) : (
            products.map(({ id, title, price, createdAt, imageUrls }) => (
              <Link
                key={id}
                className="rounded-lg overflow-hidden border"
                href={`/products/${id}`}
              >
                <Product
                  title={title}
                  price={price}
                  createdAt={createdAt}
                  imageUrl={imageUrls[0]}
                />
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

export default Search;

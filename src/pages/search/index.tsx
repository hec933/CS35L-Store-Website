import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Pagination from '@/components/common/Pagination';
import Product from '@/components/common/Product';
import Text from '@/components/common/Text';
import Container from '@/components/layout/Container';
import Wrapper from '@/components/layout/Wrapper';
import { fetchWithAuthToken } from '@/utils/auth';
import { Product as TProduct } from '@/types';

async function getProducts(params: {
  productId?: string;
  keyword?: string;
  tag?: string;
  fromPage?: string;
  toPage?: string;
}): Promise<{data: TProduct[] | string[]}> {
  const response = await fetchWithAuthToken('/api/products', 'POST', params);
  if (!response || !response.data) {
    throw new Error('Failed to fetch products');
  }
  return response;
}

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
    const rawQuery = keyword || tag || name || '';
    const queryValue = Array.isArray(rawQuery) ? rawQuery[0] : rawQuery;
    
    const searchParams = queryType === 'tag' 
      ? { tag: queryValue }
      : { keyword: queryValue };

    const { data: ids } = await getProducts({
      ...searchParams
    });

    const { data: products } = await getProducts({
      fromPage: '0',
      toPage: '1'
    });

    return {
      props: {
        products: products as TProduct[],
        query: queryValue,
        count: ids.length
      },
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { props: { products: [], query: '', count: 0 } };
  }
};

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
    const fetchProducts = async () => {
      try {
        const searchParams = query.startsWith('#') 
          ? { tag: query.slice(1) }
          : { keyword: query };

        await getProducts(searchParams);

        const { data: fetchedProducts } = await getProducts({
          fromPage: String(currentPage - 1),
          toPage: String(currentPage)
        });

        setProducts(fetchedProducts as TProduct[]);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
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
            products.map(({ id, title, price, created_at, image_urls, quantity }) => (
              <Link
                key={id}
                className="rounded-lg overflow-hidden border"
                href={`/products/${id}`}
              >
                <Product
                  title={title}
                  price={price}
                  created_at={created_at}
                  image_url={image_urls[0]}
		  quantity={quantity}
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


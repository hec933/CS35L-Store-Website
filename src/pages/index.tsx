import { InferGetServerSidePropsType } from 'next'

import Banner from './_components/Banner'
import ProductList from './_components/ProductList'

import Container from '@/components/layout/Container'
import ShopLayout from '@/components/layout/ShopLayout'
import Wrapper from '@/components/layout/Wrapper'

import { getProducts } from '@/repository/products/getProducts'

// Fetches products on the server side before rendering the page
export const getServerSideProps = async () => {
    const { data } = await getProducts({ fromPage: 0, toPage: 2 })

    // Returns the fetched product data as props to be used in the component
    return { props: { products: data } }
}

// main
export default function Home({
    products,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <Wrapper>
            <Container>
                <Banner />
                <ProductList initialProducts={products} />
            </Container>
        </Wrapper>
    )
}

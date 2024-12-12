import { InferGetServerSidePropsType } from 'next';
import { useEffect, useState } from 'react';
import Banner from './_components/Banner';
import ProductList from './_components/ProductList';
import Container from '@/components/layout/Container';
import Wrapper from '@/components/layout/Wrapper';
import { getProducts } from '@/repository/products/getProducts';
import Text from '@/components/common/Text';
import LoginPannel from '@/components/shared/LoginPannel';
import { getAuthToken } from '@/utils/auth';

export const getServerSideProps = async () => {
  const { data } = await getProducts({
    fromPage: 0,
    toPage: 2,
  });
  return { props: { products: data } };
};

export default function Home({
  products,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = await getAuthToken();
        setLoggedIn(!!token);
      } catch {
        setLoggedIn(false);
      }
    };
    verifyToken();
  }, []);

  const handleLogin = async () => {
    try {
      const token = await getAuthToken();
      if (token) {
        localStorage.setItem('loggedIn', 'true');
        setLoggedIn(true);
        setShowLoginModal(false);
      }
    } catch (error) {
      alert('Login failed. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    setLoggedIn(false);
  };

  return (
    <Wrapper>
      <Container>
        <Banner />
        <ProductList initialProducts={products} />
      </Container>
      <div className="fixed top-2 pb-3 z-50">
        {!loggedIn ? (
          <Text
            size="md"
            color="darkestBlue"
            onClick={() => setShowLoginModal(true)}
            className="cursor-pointer hover:text-blue-500 transition-colors duration-300 py-2 px-4"
          >
            Sign in / register
          </Text>
        ) : (
          <Text
            size="md"
            color="darkestBlue"
            onClick={handleLogout}
            className="cursor-pointer hover:text-blue-500 transition-colors duration-300 py-2 px-4"
          >
            Log out
          </Text>
        )}
        {showLoginModal && !loggedIn && (
          <div
            className="fixed top-0 left-0 w-screen h-screen bg-gray-400/50 z-50 flex justify-center items-center"
            onClick={() => setShowLoginModal(false)}
          >
            <div
              className="bg-white p-6 rounded shadow-md w-64"
              onClick={(e) => e.stopPropagation()}
            >
              <LoginPannel handleLogin={handleLogin} />
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
}

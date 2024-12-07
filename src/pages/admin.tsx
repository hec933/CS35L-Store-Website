import { useEffect, useState } from 'react';
import { AdminPortal } from '@/utils/adminPortal';
import { RequestAccess } from '@/utils/requestAccess';
import Container from '@/components/layout/Container';
import Wrapper from '@/components/layout/Wrapper';

declare const auth: any;



//simple page to check auth and begin edit
export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAdmin() {
      try {
        const user = auth.currentUser;
        if (!user) {
          setIsAdmin(false);
          return;
        }

        const token = await user.getIdToken();
        const response = await fetch('/api/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setIsAdmin(userData.role === 'WEB_ADMIN' || userData.role === 'STORE_ADMIN');
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    }

    checkAdmin();
  }, []);

  if (isAdmin === null) {
    return <div>Loading...</div>;
  }

  return (
    <Wrapper>
      <Container>
        {isAdmin ? <AdminPortal /> : <RequestAccess />}
      </Container>
    </Wrapper>
  );
}
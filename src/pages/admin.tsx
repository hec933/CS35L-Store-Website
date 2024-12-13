import { useEffect, useState } from 'react';
import { fetchWithAuthToken } from '@/utils/auth';
import Container from '@/components/layout/Container';
import Wrapper from '@/components/layout/Wrapper';
import AdminPortal from '@/utils/adminPortal';
import { RequestAccess } from '@/utils/requestAccess';

export default function AdminPage() {
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

    useEffect(() => {
        async function checkAdmin() {
            try {
                const response = await fetchWithAuthToken('/api/user', 'POST');
                if (!response || !response.user) throw new Error('Invalid response structure');

		console.log(response.user);

                const { role } = response.user;
                if (!role) throw new Error('Role is undefined');
                
                setIsAdmin(role === 'WEB_ADMIN' || role === 'STORE_ADMIN');
            } catch (error) {
                console.error('Error checking admin status:', error);
                setIsAdmin(false);
            }
        }

        checkAdmin();
    }, []);

    if (isAdmin === null) {
        return (
            <Wrapper>
                <Container>
                    <div className="flex justify-center items-center h-screen">
                        <span>Loading...</span>
                    </div>
                </Container>
            </Wrapper>
        );
    }

    return (
        <Wrapper>
            <Container>
                {isAdmin ? <AdminPortal /> : <RequestAccess />}
            </Container>
        </Wrapper>
    );
}

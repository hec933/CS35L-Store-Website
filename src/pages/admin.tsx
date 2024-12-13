import { useEffect, useState } from 'react';
import { fetchWithAuthToken } from '@/utils/auth';
import Container from '@/components/layout/Container';
import Wrapper from '@/components/layout/Wrapper';
import { AdminPortal } from '@/utils/adminPortal';
import { RequestAccess } from '@/utils/requestAccess';

//admin login page
export default function AdminPage() {
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

    useEffect(() => {
        async function checkAdmin() {
            try {
                const response = await fetchWithAuthToken('/api/user', 'POST');
                const role = response.user?.role;
                if (!role) throw new Error('Role is undefined');
                setIsAdmin(role === 'WEB_ADMIN' || role === 'STORE_ADMIN');
            } catch {
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
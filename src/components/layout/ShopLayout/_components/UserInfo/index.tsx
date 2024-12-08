import { useEffect, useState } from 'react';
import Container from '@/components/layout/Container';
import Wrapper from '@/components/layout/Wrapper';
import Login from './_components/Login';
import { fetchWithAuthToken } from '@/utils/auth';

export default function UserInfo() {
    const [userName, setUserName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await fetchWithAuthToken('/api/user', 'POST');
                setUserName(data.user.name);
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.setItem('loggedIn', 'false');
        setUserName(null);
    };

    return (
        <Wrapper>
            <aside className="border-b bg-lightestBlue border-lightestBlue">
                <Container>
                    <div className="flex justify-end py-1">
                        {isLoading ? (
                            <span>Loading...</span>
                        ) : userName ? (
                            <div className="flex items-center space-x-4">
                                <span>Logged in as: {userName}</span>
                                <button
                                    onClick={handleLogout}
                                    className="cursor-pointer hover:text-blue-500"
                                >
                                    Log out
                                </button>
                            </div>
                        ) : (
                            <Login />
                        )}
                    </div>
                </Container>
            </aside>
        </Wrapper>
    );
}

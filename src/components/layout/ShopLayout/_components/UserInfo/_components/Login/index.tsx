import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyDvv8hpHMXE_aKHbXmCUGygFSEIiHZTvJM',
    authDomain: 'handy35l.firebaseapp.com',
    projectId: 'handy35l',
    storageBucket: 'handy35l.firebasestorage.app',
    messagingSenderId: '690933385734',
    appId: '1:690933385734:web:3171e6615b22ba54bc9187',
    measurementId: 'G-5P03H6DNQ5',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export default function Login() {
    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        const isLoggedIn = !!storedToken;
        setLoggedIn(isLoggedIn);

  	//refresh token if still logged in
        if (isLoggedIn) {
            const refreshToken = async () => {
                const user = auth.currentUser;
                if (user) {
                    const token = await user.getIdToken(/* forceRefresh */ true);
                    localStorage.setItem('authToken', token);
                }
            };

            const interval = setInterval(refreshToken, 50 * 60 * 1000); // Refresh token every 50 minutes
            return () => clearInterval(interval); // Cleanup on component unmount
        }
    }, []);

    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const idToken = await user.getIdToken();

            console.log('Google Sign-In Successful:', user);
            localStorage.setItem('authToken', idToken);
            await sendTokenToServer(idToken);

            setLoggedIn(true);
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please try again.');
        }
    };

    const sendTokenToServer = async (idToken: string) => {
        try {
            const response = await fetch('/api/token', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idToken }),
            });

            if (!response.ok) {
                throw new Error('Failed to verify token with server');
            }

            const data = await response.json();
            console.log('Server verified token:', data);
        } catch (error) {
            console.error('Error during token verification:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setLoggedIn(false);
    };

    return (
        <div>
            {loggedIn ? (
                <button onClick={handleLogout}>Log out</button>
            ) : (
                <button onClick={handleLogin}>Log in with Google</button>
            )}
        </div>
    );
}

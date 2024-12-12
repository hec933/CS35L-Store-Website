import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import NavItem from './NavItem';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, User } from 'firebase/auth';
import { auth } from '../pages/api/firebase';
import { useRouter } from 'next/navigation';

//navigation bar
const Navbar = () => {
    const [menu, setMenu] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(false);
    const router = useRouter();
    const provider = new GoogleAuthProvider();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user && router.pathname !== '/') {
            router.push('/');
        } else if (!user && router.pathname !== '/login') {
            router.push('/login');
        }
    }, [user, router.pathname]);

    const handleAuth = async () => {
        setAuthLoading(true);
        try {
            if (user) {
                await auth.signOut();
                console.log('User signed out successfully.');
            } else {
                const result = await signInWithPopup(auth, provider);
                console.log('User signed in: ', result.user);
            }
        } catch (error) {
            console.error('Auth error: ', error);
            alert(error.message);
        } finally {
            setAuthLoading(false);
        }
    };

    const handleMenu = () => {
        setMenu((prev) => !prev);
    };

    return (
        <nav className="relative z-10 w-full bg-uclaBlue text-uclaGold">
            <div className="flex items-center justify-between mx-5 sm:mx-10 lg:mx-20">
                <div className="flex items-center text-2xl h-14 ml-5">
                    <Link href="/">Home</Link>
                </div>
                <div className="text-2xl sm:hidden">
                    <button onClick={handleMenu}>{menu ? '-' : '+'}</button>
                </div>
                <div className="hidden sm:block">
                    <NavItem handleAuth={handleAuth} user={user} />
                </div>
            </div>
            <div className="block sm:hidden">
                {menu && <NavItem mobile handleAuth={handleAuth} user={user} />}
            </div>
        </nav>
    );
};

export default Navbar;

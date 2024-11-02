"use client"; 

import Link from "next/link";
import React, { useEffect, useState } from "react";
import NavItem from "./NavItem";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, User } from 'firebase/auth';
import { auth } from '../firebase';
import { useRouter } from 'next/navigation';

// Navigation Bar (Header)
const Navbar = () => {
    // Manages the open/close state of the menu bar to display + or - icon in mobile view
    const [menu, setMenu] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter(); 
    const provider = new GoogleAuthProvider(); // Firebase auth

    const handleMenu = () => {
        setMenu(!menu);
    }

    // Firebase Auth Status 
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user); // Update user state
        });

        return () => unsubscribe(); // Cleanup subscription on unmount
    }, []);

    // Check user and navigate
    useEffect(() => {
        if (user) {
            router.push("/"); // login success -> main Home page 
        } else {
            router.push("/login");  // need to login -> goto Login page 
        }
    }, [user]); // Only runs when user changes

    // Firebase Login 
    const handleAuth = () => {
        if (user) {
            // Sign out logic
            auth.signOut().then(() => {
                console.log("User signed out successfully.");
            }).catch((error) => {
                console.error("Sign out error: ", error);
            });
        } else {
            // Sign in logic
            signInWithPopup(auth, provider)
                .then(result => {
                    console.log("User signed in: ", result.user);
                })
                .catch(error => {
                    alert(error.message);
                });
        }
    };

    // UI
    return (
        // Navbar background color 
        <nav className="relative z-10 w-full bg-uclaBlue text-uclaGold"> 
            <div className="flex items-center justify-between mx-5 sm:mx-10 lg:mx-20">

                <div className="flex items-center text-2xl h-14 ml-5">
                    <Link href="/">Home</Link>
                </div>

                <div className="text-2xl sm:hidden">
                    {menu === false ? 
                    <button onClick={handleMenu}>+</button> :
                    <button onClick={handleMenu}>-</button>}
                </div>

                <div className="hidden sm:block">
                    <NavItem handleAuth={handleAuth} user={user}/>
                </div>
            </div>
            <div className="block sm:hidden">
                {(menu === false) ? null : <NavItem mobile handleAuth={handleAuth} user={user}/>}
            </div>
        </nav>
    );
};

export default Navbar;

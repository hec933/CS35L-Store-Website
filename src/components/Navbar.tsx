'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import NavItem from './NavItem'
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, User } from 'firebase/auth'
import { auth } from '../pages/api/firebase'
import { useRouter, usePathname } from 'next/navigation'

const Navbar = () => {
    const [menu, setMenu] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const router = useRouter()
    const pathname = usePathname()
    const provider = new GoogleAuthProvider()

    const handleMenu = () => {
        setMenu(!menu)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user)
        })

        return () => unsubscribe()
    }, [])

    useEffect(() => {
        if (user && pathname !== '/') {
            router.push('/')
        } else if (!user && pathname !== '/login') {
            router.push('/login')
        }
    }, [user, pathname, router]) 

    const handleAuth = () => {
        if (user) {
            auth.signOut()
                .then(() => {
                    console.log('User signed out successfully.')
                })
                .catch((error) => {
                    console.error('Sign out error: ', error)
                })
        } else {
            signInWithPopup(auth, provider)
                .then((result) => {
                    console.log('User signed in: ', result.user)
                })
                .catch((error) => {
                    alert(error.message)
                })
        }
    }

    return (
        <nav className="relative z-10 w-full bg-uclaBlue text-uclaGold">
            <div className="flex items-center justify-between mx-5 sm:mx-10 lg:mx-20">
                <div className="flex items-center text-2xl h-14 ml-5">
                    <Link href="/">Home</Link>
                </div>

                <div className="text-2xl sm:hidden">
                    {menu === false ? (
                        <button onClick={handleMenu}>+</button>
                    ) : (
                        <button onClick={handleMenu}>-</button>
                    )}
                </div>

                <div className="hidden sm:block">
                    <NavItem handleAuth={handleAuth} user={user} />
                </div>
            </div>
            <div className="block sm:hidden">
                {menu === false ? null : (
                    <NavItem mobile handleAuth={handleAuth} user={user} />
                )}
            </div>
        </nav>
    )
}

export default Navbar

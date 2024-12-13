'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import NavItem from './NavItem'
import { GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth'
import { auth } from '@/utils/firebaseClient'
import { useRouter, usePathname } from 'next/navigation'
import { fetchWithAuthToken } from '@/utils/auth'

const Navbar = () => {
    const [menu, setMenu] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [userName, setUserName] = useState<string | null>(null)
    const router = useRouter()
    const pathname = usePathname()
    const provider = new GoogleAuthProvider()

    useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
        setUser(user)
        if (user) {
            try {
                const data = await fetchWithAuthToken('/api/user', 'POST')
                setUserName(data.user.name)
            } catch (error) {
                console.error('Error fetching user:', error)
                setUserName(null)
            }
        } else {
            setUserName(null)
        }
    })
    return () => unsubscribe()
    }, [])

    const handleAuth = async (): Promise<void> => {
    if (user) {
        try {
            await auth.signOut()
            console.log('User signed out successfully.')
        } catch (error) {
            console.error('Sign out error: ', error)
        }
    } else {
        try {
            const result = await signInWithPopup(auth, provider)
            const token = await result.user.getIdToken()
            const response = await fetch('/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            if (!response.ok) {
                throw new Error('Failed to sync user with database')
            }
            const data = await response.json()
            setUserName(data.user.name)
        } catch (error) {
            console.error('Sign in error:', error)
            if (error instanceof Error) {
                alert(error.message)
            }
        }
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
                        <button onClick={() => setMenu(true)}>+</button>
                    ) : (
                        <button onClick={() => setMenu(false)}>-</button>
                    )}
                </div>
                <div className="hidden sm:block">
                    <NavItem handleAuth={handleAuth} userName={userName} />
                </div>
            </div>
            <div className="block sm:hidden">
                {menu && (
                    <NavItem mobile handleAuth={handleAuth} userName={userName} />
                )}
            </div>
        </nav>
    )
}

export default Navbar
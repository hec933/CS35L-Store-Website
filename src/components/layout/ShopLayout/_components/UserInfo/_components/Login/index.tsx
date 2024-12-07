import { useState, useEffect } from 'react'
import { disablePageScroll, enablePageScroll } from 'scroll-lock'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import Text from '@/components/common/Text'
import LoginPannel from '@/components/shared/LoginPannel'

const firebaseConfig = {
    apiKey: 'AIzaSyDvv8hpHMXE_aKHbXmCUGygFSEIiHZTvJM',
    authDomain: 'handy35l.firebaseapp.com',
    projectId: 'handy35l',
    storageBucket: 'handy35l.firebasestorage.app',
    messagingSenderId: '690933385734',
    appId: '1:690933385734:web:3171e6615b22ba54bc9187',
    measurementId: 'G-5P03H6DNQ5',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

export default function Login() {
    const [loggedIn, setLoggedIn] = useState(false)
    const [showLogoutPrompt, setShowLogoutPrompt] = useState(false)

    useEffect(() => {
        const storedLoginState = localStorage.getItem('loggedIn') === 'true'
        setLoggedIn(storedLoginState)

        if (storedLoginState) {
            disablePageScroll()
        } else {
            enablePageScroll()
        }
    }, [])

    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider)
            const user = result.user
            const token = await user.getIdToken()
            console.log('Google Sign-In Successful:', user)

            localStorage.setItem('loggedIn', 'true')
            setLoggedIn(true)
            setShowLogoutPrompt(true)
            fetchUserData(token)
        } catch (error) {
            alert('Login failed. Please try again.')
        }
    }

    const fetchUserData = async (token) => {
        const response = await fetch('/api/user', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })

        const data = await response.json()
        console.log('Local user data is:', data)
    }

    const handleLogout = () => {
        localStorage.removeItem('loggedIn')
        setLoggedIn(false)
        setShowLogoutPrompt(false)
        window.location.href = '/'
    }

    const closeLogoutPrompt = () => {
        setShowLogoutPrompt(false)
    }

    return (
        <div className="fixed top-2 pb-3 z-50">
            {!loggedIn && (
                <Text
                    size="md"
                    color="darkestBlue"
                    onClick={() => setLoggedIn(false)}
                    className="cursor-pointer hover:text-blue-500 transition-colors duration-300 py-2 px-4"
                >
                    Sign in / register
                </Text>
            )}

            {loggedIn && showLogoutPrompt && (
                <div
                    className="fixed top-0 left-0 w-screen h-screen bg-lightestBlue z-50 flex justify-center items-center"
                    onClick={closeLogoutPrompt}
                >
                    <div
                        className="bg-white p-6 rounded shadow-md w-64"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <p>Are you sure you want to log out?</p>
                        <button className="mr-4" onClick={handleLogout}>
                            Yes
                        </button>
                        <button onClick={closeLogoutPrompt}>No</button>
                    </div>
                </div>
            )}

            {!loggedIn && (
                <div
                    className={`fixed top-0 left-0 w-screen h-screen bg-gray-400/50 z-50 flex justify-center items-center ${loggedIn ? 'hidden' : 'block'}`}
                >
                    <LoginPannel handleLogin={handleLogin} />
                </div>
            )}
        </div>
    )
}

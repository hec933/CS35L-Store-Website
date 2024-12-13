import { useState } from 'react'
import Button from '@/components/common/Button'
import Text from '@/components/common/Text'
import { auth } from '@/utils/firebaseClient'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

export default function LoginPanel() {
    const handleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider()
            await signInWithPopup(auth, provider)
        } catch (error) {
            console.error('Login failed:', error)
            alert('Login failed. Please try again.')
        }
    }

    return (
        <div
            className="bg-lightestBlue flex flex-col justify-center items-center p-10 rounded w-112 gap-4"
            onClick={(e) => e.stopPropagation()}
        >
            <Text size="lg" color="black">
                Welcome !
            </Text>
            <Text size="md" weight="light" color="black">
                Sign up easily and check out the products
            </Text>
            <div className="flex flex-col gap-2 w-full">
                <Button
                    className="bg-uclaBlue !text-uclaGold"
                    onClick={handleLogin}
                >
                    Sign in with Google
                </Button>
            </div>
        </div>
    )
}
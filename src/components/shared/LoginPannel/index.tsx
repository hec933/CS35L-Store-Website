import { useState } from 'react'

import Login from './_components/Login'
import SignUp from './_components/SignUp'

import Button from '@/components/common/Button'
import Text from '@/components/common/Text'



// Define the props type for LoginPanel
interface LoginPanelProps {
    handleLogin: () => void; // Function that takes no arguments and returns void
}


export default function LoginPanel({ handleLogin} : LoginPanelProps) {
    const [type, setType] = useState<undefined | 'login' | 'signup'>()

    return (
        <div
            className="bg-lightestBlue flex flex-col justify-center items-center p-10 rounded w-112 gap-4"
            onClick={(e) => e.stopPropagation()}
        >
            <Text 
            size="lg" 
            color="black">
                Welcome !
            </Text>

            <Text 
            size="md" 
            weight="light" 
            color="black">
                Sign up easily and check out the products
            </Text>

            {type === 'login' ? (
                <Login 
                    handleSetType={(type) => setType(type)}
                />
            ) : type === 'signup' ? (
                <SignUp 
                    handleSetType={(type) => setType(type)} 
                />
            ) : (
                <div className="flex flex-col gap-2 w-full">
                    <Button
                        className="bg-uclaBlue !text-uclaGold"
                        onClick={() => setType('login')}
                    >
                        Sign in
                    </Button>
                    <Button
                        className="bg-uclaBlue !text-uclaGold"
                        onClick={() => setType('signup')}
                    >
                        Register
                    </Button>
                    <Button
                        className="bg-uclaBlue !text-uclaGold"
                        onClick={handleLogin}
                    >
                        Sign in with Google
                    </Button>
                </div>
            )}
        </div>
    )
}

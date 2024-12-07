import { useEffect, useState } from 'react'
import Login from './_components/Login'
import Container from '@/components/layout/Container'
import Wrapper from '@/components/layout/Wrapper'

export default function UserInfo() {
    const [loggedIn, setLoggedIn] = useState(false)

    useEffect(() => {
        const loginState = localStorage.getItem('loggedIn') === 'true'
        setLoggedIn(loginState)
    }, [])

    return (
        <Wrapper>
            <aside className="border-b bg-lightestBlue border-lightestBlue">
                <Container>
                    <div className="flex justify-end py-1">
                        {loggedIn ? (
                            <button
                                onClick={() => {
                                    setLoggedIn(false)
                                    localStorage.setItem('loggedIn', 'false')
                                }}
                                className="cursor-pointer hover:text-blue-500"
                            >
                                Log out
                            </button>
                        ) : (
                            <Login />
                        )}
                    </div>
                </Container>
            </aside>
        </Wrapper>
    )
}

import Text from '@/components/common/Text'
import Container from '@/components/layout/Container'
import Wrapper from '@/components/layout/Wrapper'
import Login from './_components/Login'

// Login / Sign up
export default function UserInfo() {
    return (
        <Wrapper>
            <aside className="border-b bg-lightestBlue border-lightestBlue">
                <Container>
                    <div className="flex justify-end py-1">
                        <Login />
                    </div>
                </Container>
            </aside>
        </Wrapper>
    )
}

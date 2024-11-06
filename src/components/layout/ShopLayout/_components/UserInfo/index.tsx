import Text from '@/components/common/Text'
import Container from '@/components/layout/Container'
import Wrapper from '@/components/layout/Wrapper'

export default function UserInfo() {
    return (
        <Wrapper>
            <aside className="border-b bg-lightestBlue border-lightestBlue">
                <Container>
                    <div className="flex justify-end py-1">
                        <Text size="sm" color="darkerBlue">
                            Log in / Sign up
                        </Text>
                    </div>
                </Container>
            </aside>
        </Wrapper>
    )
}

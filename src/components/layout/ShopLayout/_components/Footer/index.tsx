import Text from '@/components/common/Text'
import Container from '@/components/layout/Container'
import Wrapper from '@/components/layout/Wrapper'

export default function Footer() {
    return (
        <Wrapper>
            <aside className="border-t border-uclaBlue bg-lightestBlue">
                <Container>
                    <div className="py-5 justify-center flex gap-5">
                        <Text>
                            CS 35L - Team Handy - Andy Alcazar, Gregory Weinrod,
                            Hector Gil-Morales, Taewook Park
                        </Text>
                    </div>
                </Container>
            </aside>
        </Wrapper>
    )
}

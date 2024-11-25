import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { ReactNode } from 'react'
import Search from './_components/Search'

import Text from '@/components/common/Text'
import Container from '@/components/layout/Container'
import Wrapper from '@/components/layout/Wrapper'
import Login from '../UserInfo/_components/Login'
import Likes from '../Aside/_components/Likes'

// Aside bar children
type Props = { children: ReactNode }

export default function Header({ children }: Props) {
    const router = useRouter()

    return (
        <div className="sticky top-0 z-10 bg-lightestBlue">
            <Wrapper>
                <Container>
                    <div className="flex justify-between items-center pt-8">
                        {/* Logo */}
                        <div className="flex justify-between items-center py-5">
                            <Link href="/" prefetch={false}>
                                <Image
                                    src="/logo.jpg" // UCLA store logo image path
                                    alt="Store Logo"
                                    width={120} // Image width
                                    height={120} // Image height
                                />
                                <Text
                                    size="4xl"
                                    style={{
                                        fontFamily: `'Black Han Sans', sans-serif`,
                                    }}
                                >
                                    {/* Store  */}
                                </Text>
                            </Link>
                        </div>

                        {/* Search Bar */}
                        <Search />

                        {/* Right cart button */}
                        <Likes />
                    </div>
                </Container>
            </Wrapper>
            {children}
        </div>
    )
}

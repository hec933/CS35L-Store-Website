import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { ReactNode } from 'react'
import Search from './_components/Search'

import Text from '@/components/common/Text'
import Container from '@/components/layout/Container'
import Wrapper from '@/components/layout/Wrapper'
import Login from '../UserInfo/_components/Login'

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

                        {/* Right cart bar */}
                        <div className="flex gap-5 items-center py-2 px-4">
                            {/* Cart Icon and Count */}
                            <div className="flex items-center gap-2">
                                <span
                                    className="material-symbols-outlined"
                                    style={{ fontSize: '1.5rem' }} // 아이콘 크기 확대
                                >
                                    shopping_cart
                                </span>
                                <Text
                                    size="lg" // 텍스트 크기 확대
                                    color="uclaBlue"
                                    className="flex items-center"
                                >
                                    0
                                </Text>
                            </div>
                            {/* Cart Label */}
                            <Text size="lg">Cart</Text> {/* 텍스트 크기 확대 */}
                        </div>
                    </div>
                </Container>
            </Wrapper>
            {children}
        </div>
    )
}

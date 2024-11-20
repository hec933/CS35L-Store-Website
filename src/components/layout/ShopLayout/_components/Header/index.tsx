import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { ReactNode } from 'react'
import Search from './_components/Search'

import Text from '@/components/common/Text'
import Container from '@/components/layout/Container'
import Wrapper from '@/components/layout/Wrapper'

// Aside bar children
type Props = { children: ReactNode }

export default function Header({ children }: Props) {
    const router = useRouter()

    return (
        <div className="sticky top-0 z-10 bg-lightestBlue border-b border-b-uclaBlue">
            <Wrapper>
                <Container>
                    <div className="flex justify-between items-center py-8">
                        {/* Logo */}
                        <div className="flex justify-between items-center py-8">
                            <Link href="/" prefetch={false}>
                                <Image
                                    src="/logo.jpg" // UCLA store logo image path
                                    alt="Store Logo"
                                    width={100} // Image width
                                    height={100} // Image height
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

                        {/* Right menu bar */}
                        <div className="flex gap-5">
                            <div className="flex items-center">
                                <span className="material-symbols-outlined">
                                    sell
                                </span>
                                <Text weight="light" size="sm" className="mx-1">
                                    Sell
                                </Text>
                            </div>

                            <div className="flex items-center">
                                <span className="material-symbols-outlined">
                                    storefront
                                </span>
                                <Text weight="light" size="sm" className="mx-1">
                                    My Store
                                </Text>
                            </div>

                            <div className="flex items-center">
                                <span className="material-symbols-outlined">
                                    chat_bubble
                                </span>
                                <Text weight="light" size="sm" className="mx-1">
                                    Chat
                                </Text>
                            </div>
                        </div>
                    </div>
                </Container>
            </Wrapper>
            {children}
        </div>
    )
}

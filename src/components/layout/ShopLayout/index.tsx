import { ReactNode } from 'react'
import Aside from './_components/Aside'
import Footer from './_components/Footer'
import Header from './_components/Header'
import UserInfo from './_components/UserInfo'

interface Props {
    children: ReactNode
}

export default function ShopLayout({ children }: Props) {
    return (
        <div style={{ minWidth: 1000 }}>
            <UserInfo /> {/* Displays login/logout button */}
            <Header>
                <Aside />
            </Header>
            <main
                style={{
                    minHeight: 'calc(100vh - 28px - 108px - 65px)', // Adjusted for header/footer
                }}
            >
                {children}
            </main>
            <Footer />
        </div>
    )
}

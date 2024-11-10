import type { AppProps } from 'next/app'

import JggtLayout from '@/components/layout/ShopLayout'
import '@/styles/globals.css'
import ShopLayout from '@/components/layout/ShopLayout'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ShopLayout>
            <Component {...pageProps} />
        </ShopLayout>
    )
}

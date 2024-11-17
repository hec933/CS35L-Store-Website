import classNames from 'classnames'
import styles from './style.module.scss'
import Text from '@/components/common/Text'
import Container from '@/components/layout/Container'

// Right Aside bar
export default function Aside() {
    return (
        <Container className="relative">
            <aside
                className={classNames(
                    styles.aside,
                    'absolute top-8 flex flex-col gap-4 w-24',
                )}
            >
                <div className="border border-uclaBlue bg-white p-2 flex flex-col items-center">
                    <Text size="xs">Cart</Text>
                    <Text
                        size="xs"
                        color="lighterBlue"
                        className="flex gap-1 items-center mt-1"
                    >
                        <span
                            className="material-symbols-outlined"
                            style={{ fontSize: '0.725rem' }}
                        >
                            <span className="material-symbols-outlined">
                                shopping_cart
                            </span>
                        </span>
                        0
                    </Text>
                </div>
                <div className="border border-uclaBlue p-2 bg-white flex flex-col items-center">
                    <Text size="xs">History</Text>
                    <div className="mt-2 text-center">
                        <Text size="xs" color="lighterBlue" className="block">
                            No Browsing History
                        </Text>
                    </div>
                </div>
            </aside>
        </Container>
    )
}

import Link from 'next/link';

type NavItemProps = {
    mobile?: boolean;
    handleAuth: () => void;
    user: any; // Replace `any` with a specific type if available
};

const NavItem = ({ mobile, handleAuth, user }: NavItemProps) => {
    return (
        <ul
            className={`text-md justify-center flex gap-4 w-full item-center mr-14 ${
                mobile ? 'flex-col h-full' : ''
            }`}
        >
            <li className="py-2 text-center cursor-pointer">
                <Link href="/user">User</Link>
            </li>
            <li className="py-2 text-center cursor-pointer">
                <Link href="/cart">Cart</Link>
            </li>
            <li className="py-2 text-center cursor-pointer">
                <button onClick={handleAuth}>
                    {user ? 'Sign Out' : 'Login'}
                </button>
            </li>
        </ul>
    );
};

export default NavItem;

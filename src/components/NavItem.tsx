import Link from 'next/link';
import React from 'react';
import { User } from 'firebase/auth';

type NavItemProps = {
  mobile?: boolean;
  handleAuth: () => void;
  user: User | null;
};

//navigation links
const NavItem: React.FC<NavItemProps> = ({ mobile = false, handleAuth, user }) => {
  return (
    <ul
      className={`text-md flex ${
        mobile ? 'flex-col h-full items-center' : 'gap-4 items-center'
      } w-full mr-14`}
    >
      <li className="py-2 text-center cursor-pointer">
        <Link href="/user">User</Link>
      </li>
      <li className="py-2 text-center cursor-pointer">
        <Link href="/cart">Cart</Link>
      </li>
      <li className="py-2 text-center cursor-pointer">
        <button onClick={handleAuth} className="hover:text-blue-500">
          {user ? 'Sign Out' : 'Login'}
        </button>
      </li>
    </ul>
  );
};

export default NavItem;

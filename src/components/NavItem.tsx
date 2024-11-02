// Items in the navigation bar (logo, cart, etc.)
import Link from "next/link";
import React from "react";
import handleAuth from "./Navbar"; 

const NavItem = ({ mobile, handleAuth, user }: { mobile?: boolean; handleAuth: () => void; user: any }) => {
    return (
        <ul className={`text-md justify-center flex gap-4 w-full item-center mr-14 ${mobile ? 'flex-col h-full' : ''} `}>
            <li className = "py-2 text-center cursor-pointer"><Link href = "/user">User</Link></li>
            <li className = "py-2 text-center cursor-pointer"><Link href = "/cart">Cart</Link></li>
            <li className = "py-2 text-center cursor-pointer">
                <button onClick={handleAuth}>
                    {user ? "Sign Out" : "Login"} {/* Change button text based on login state */}
                </button>
            </li>
        </ul>
    );
};

export default NavItem;

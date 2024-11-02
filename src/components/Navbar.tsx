"use client";

import Link from "next/link";
import React, { useState } from "react";
import NavItem from "./NavItem";

// Navigation Bar (Header)
const Navbar = () => {
    // Manages the open/close state of the menu bar to display + or - icon in mobile view
    const [menu, setMenu] = useState(false);
    const handleMenu = () => {
        setMenu(!menu);
    }

    return (
        // Navbar background color 
        <nav className="relative z-10 w-full bg-uclaBlue text-uclaGold"> 
            <div className="flex items-center justify-between mx-5 sm:mx-10 lg:mx-20">
                {/* Logo (main)*/}
                <div className="flex items-center text-2xl h-14 ml-5">
                    <Link href="/">Home</Link>
                </div>

                {/* handle Menu (mobile media query) */}
                <div className="text-2xl sm:hidden">
                    {menu === false ? 
                    <button onClick={handleMenu}>+</button> :
                    <button onClick={handleMenu}>-</button>}
                </div>

                <div className="hidden sm:block">
                    <NavItem />
                </div>
            </div>
            <div className="block sm:hidden">
                {(menu === false) ? null : <NavItem mobile />}
            </div>
        </nav>
    );
};

export default Navbar;

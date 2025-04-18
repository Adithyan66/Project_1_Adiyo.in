

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import logo from "../../assets/images/Adiyo.in.svg";
import { toggleSidebar } from '../../store/slices/sideBarSlice';

const NavbarTwo = () => {
    const dispatch = useDispatch();
    const { isOpen } = useSelector((state) => state.sidebar);

    const handleToggleSidebar = () => {
        dispatch(toggleSidebar());
    };

    return (
        <>
            {/* Fixed navbar with z-index to ensure it stays on top */}
            <nav className="fixed top-0 left-0 right-0 flex items-center justify-between bg-gray-100 shadow px-4 py-2 h-18 z-50">
                {/* Left Section: Hamburger on mobile, hidden on desktop */}
                <div className="md:hidden flex items-center">
                    <button
                        id="hamburger-btn"
                        onClick={handleToggleSidebar}
                        className="p-2 text-gray-600 hover:bg-gray-200 rounded"
                        aria-label="Toggle sidebar"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                            />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 flex justify-center sm:justify-end">
                    <img
                        src={logo}
                        alt="Adiyo Logo"
                        className="h-8 w-auto lg:mr-48"
                    />
                </div>
            </nav>

            {/* Spacer div to prevent content from being hidden under the navbar */}
            <div className="h-14 w-full"></div>
        </>
    );
};

export default NavbarTwo;
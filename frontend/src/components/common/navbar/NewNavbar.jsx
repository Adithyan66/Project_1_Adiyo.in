import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import logo from "../../../assets/images/Adiyo.in.svg";
import UserPopupMenu from "./UserPopupMenu";


const Logo = () => {
    const navigate = useNavigate();
    return (
        <div
            className="flex-shrink-0 cursor-pointer"
            onClick={() => {
                navigate('/');
                window.scrollTo(0, 0);
            }}
        >
            <img
                src={logo}
                alt="Adiyo.in"
                className="h-8 w-auto"
            />
        </div>
    );
};

// Navigation Links Component
const NavLinks = () => (
    <div className="flex flex-col md:flex-row md:space-x-6 lg:space-x-8">
        {['Shop', 'On Sale', 'New Arrivals', 'Brands'].map((item) => (
            <a
                key={item}
                href="#"
                className="text-gray-700 hover:text-gray-900 flex items-center text-sm font-medium py-2 md:py-0"
            >
                {item}
                {item === 'Shop' && (
                    <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                )}
            </a>
        ))}
    </div>
);

// Search Bar Component
const SearchBar = ({ setSearchTerm, toProductPage }) => (
    <div className="relative w-full max-w-[550px]">
        <svg
            className="absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
            type="text"
            placeholder="Search for products..."
            className="w-full rounded-full bg-gray-100 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={toProductPage}
        />
    </div>
);

// Action Buttons Component
const ActionButtons = ({ onUserClick }) => (
    <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-100" aria-label="Cart">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        </button>
        <button
            onClick={onUserClick}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="User Profile"
        >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        </button>
    </div>
);

// User Popup Menu Component
// const UserPopupMenu = ({ popupRef }) => (
//     <div
//         ref={popupRef}
//         className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
//     >
//         <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
//         <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Orders</a>
//         <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign Out</a>
//     </div>
// );

// Scroll to Top Component
const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

// Main Navbar Component
const NewNavbar = ({ setSearchTerm, toProductPage }) => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const popupRef = useRef(null);
    const location = useLocation();

    // Reset mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
    }, [location.pathname]);

    // Handle clicks outside user popup
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md px-4 sm:px-6 lg:px-8 py-3">
            {/* Desktop Layout */}
            <div className="hidden md:flex items-center justify-between h-12">
                <div className="flex items-center">
                    <Logo />
                    <div className="ml-6 lg:ml-10">
                        <NavLinks />
                    </div>
                </div>
                <div className="flex items-center space-x-6">
                    <SearchBar setSearchTerm={setSearchTerm} toProductPage={toProductPage} />
                    <ActionButtons onUserClick={() => setIsUserMenuOpen(!isUserMenuOpen)} />
                </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden flex flex-col">
                <div className="flex items-center justify-between h-12">
                    <Logo />
                    <div className="flex items-center space-x-2">
                        <ActionButtons onUserClick={() => setIsUserMenuOpen(!isUserMenuOpen)} />
                        <button
                            onClick={toggleMobileMenu}
                            className="p-2 rounded-md hover:bg-gray-100"
                            aria-label="Toggle Menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                                />
                            </svg>
                        </button>
                    </div>
                </div>
                {isMobileMenuOpen && (
                    <div className="mt-2 pb-2">
                        <SearchBar setSearchTerm={setSearchTerm} toProductPage={toProductPage} />
                        <div className="mt-4">
                            <NavLinks />
                        </div>
                    </div>
                )}
            </div>

            {/* User Popup */}
            {isUserMenuOpen && (
                <div className="absolute right-4 top-14 md:right-6 md:top-16">
                    <UserPopupMenu popupRef={popupRef} />
                </div>
            )}
        </nav>
    );
};

export default NewNavbar
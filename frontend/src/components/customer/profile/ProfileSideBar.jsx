
// // import React, { useState } from 'react';
// // import { useNavigate } from 'react-router';
// // import {
// //     ChevronRight,
// //     ChevronDown,
// //     ShoppingBag,
// //     Settings,
// //     Package,
// //     LogOut,
// //     User,
// //     MapPin,
// //     Gift,
// //     Star,
// //     Wallet,
// //     ShoppingCart,
// //     ScanHeart
// // } from 'lucide-react';
// // import { useSelector, useDispatch } from 'react-redux';
// // import { setActiveSelection } from '../../../store/slices/userSidebarSelectedSlice';
// // import { logout } from "../../../store/slices/userSlice.js"
// // import { logout as logoutService } from "../../../services/authService.js"
// // import avthar from "../../../assets/images/avatar.webp"


// // const ProfileSideBar = () => {

// //     const dispatch = useDispatch();
// //     const navigate = useNavigate();

// //     const selectedSideBar = useSelector((state) => state.userSideSelected.activeSelection);
// //     const user = useSelector((state) => state.user.userInfo)

// //     const [expandedSections, setExpandedSections] = useState({
// //         accountSettings: true,
// //         myStuffs: true
// //     });


// //     const toggleSection = (section) => {
// //         setExpandedSections({
// //             ...expandedSections,
// //             [section]: !expandedSections[section]
// //         });
// //     };

// //     // Handle navigation and selection
// //     const handleNavigation = (path, selection) => {
// //         dispatch(setActiveSelection(selection));
// //         navigate(path);
// //     };

// //     const handleLogout = async () => {
// //         try {
// //             const response = await logoutService()

// //             console.log(response.data)

// //             dispatch(logout())

// //         } catch (error) {

// //             console.log("logout fails");

// //         }
// //     }

// //     return (
// //         <aside className="w-82 bg-white shadow-lg rounded-lg overflow-hidden h-full sticky top-5">
// //             {/* User Profile Section */}
// //             <div className="bg-gray-50 p-6 border-b">
// //                 <div className="flex items-center">
// //                     <div className="w-14 h-14 rounded-full overflow-hidden mr-4 border-2 border-gray-500">
// //                         <img
// //                             src={(user?.profileImg ? user?.profileImg : avthar)}
// //                             alt="User avatar"
// //                             className="w-full h-full object-cover"
// //                         />
// //                     </div>
// //                     <div>
// //                         <div className="text-lg font-medium"> {user?.username}</div>
// //                         <div className="text-sm text-gray-500">{user?.email}</div>
// //                     </div>
// //                 </div>
// //             </div>

// //             {/* Menu Items */}
// //             <nav className="p-3">

// //                 {/* Account Settings */}
// //                 <div className="mb-2 rounded-lg bg-gray-50">
// //                     <div
// //                         className="flex items-center justify-between px-4 py-3 cursor-pointer"
// //                         onClick={() => toggleSection('accountSettings')}
// //                     >
// //                         <div className="flex items-center">
// //                             <span className="mr-3 text-black bg-gray-100 p-2 rounded-lg">
// //                                 <Settings size={20} />
// //                             </span>
// //                             <span className="font-medium">Account Settings</span>
// //                         </div>
// //                         {expandedSections.accountSettings ?
// //                             <ChevronDown size={18} className="text-gray-500" /> :
// //                             <ChevronRight size={18} className="text-gray-500" />
// //                         }
// //                     </div>

// //                     {/* Submenu for Account Settings */}
// //                     {expandedSections.accountSettings && (
// //                         <div className="ml-4 pl-8 border-l-2 border-gray-200 my-2">
// //                             <div
// //                                 className={`py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer
// //                 ${selectedSideBar === 'profile' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100'}`}
// //                                 onClick={() => handleNavigation("/user/profile", "profile")}
// //                             >
// //                                 <User size={16} className={`mr-2 ${selectedSideBar === 'profile' ? 'text-white' : 'text-gray-500'}`} />
// //                                 <span>Profile Information</span>
// //                             </div>
// //                             <div
// //                                 className={`py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer
// //                 ${selectedSideBar === 'manageAddresses' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100'}`}
// //                                 onClick={() => handleNavigation("/user/manage-address", "manageAddresses")}
// //                             >
// //                                 <MapPin size={16} className={`mr-2 ${selectedSideBar === 'manageAddresses' ? 'text-white' : 'text-gray-500'}`} />
// //                                 <span>Manage Addresses</span>
// //                             </div>
// //                         </div>
// //                     )}
// //                 </div>

// //                 {/* My Stuffs */}
// //                 <div className="mb-2 rounded-lg  transition-all duration-200">
// //                     <div
// //                         className="flex items-center justify-between px-4 py-3 cursor-pointer"
// //                         onClick={() => toggleSection('myStuffs')}
// //                     >
// //                         <div className="flex items-center">
// //                             <span className="mr-3 text-black bg-gray-100 p-2 rounded-lg">
// //                                 <Package size={20} />
// //                             </span>
// //                             <span className="font-medium">My Stuffs</span>
// //                         </div>
// //                         {expandedSections.myStuffs ?
// //                             <ChevronDown size={18} className="text-gray-500" /> :
// //                             <ChevronRight size={18} className="text-gray-500" />
// //                         }
// //                     </div>

// //                     {/* Submenu for My Stuffs */}
// //                     {expandedSections.myStuffs && (
// //                         <div className="ml-4 pl-8 border-l-2 border-gray-200 my-2">
// //                             <div
// //                                 className={`py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer
// //                                     ${selectedSideBar === 'coupons' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100'}`}
// //                                 onClick={() => handleNavigation("/user/coupons", "coupons")}
// //                             >
// //                                 <Gift size={16} className="mr-2 text-gray-500" />
// //                                 <span>My Coupons</span>
// //                             </div>
// //                             <div
// //                                 className={`py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer
// //                                     ${selectedSideBar === 'orders' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100'}`}
// //                                 onClick={() => handleNavigation("/user/orders-list", "orders")}
// //                             >
// //                                 <ShoppingBag size={16} className="mr-2 text-gray-500" />
// //                                 <span>My Orders</span>
// //                             </div>
// //                             <div
// //                                 className={`py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer
// //                                 ${selectedSideBar === 'view-cart' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100'}`}
// //                                 onClick={() => handleNavigation("/user/view-cart", "view-cart")}
// //                             >
// //                                 <ShoppingCart size={16} className="mr-2 text-gray-500" />
// //                                 <span>My Cart</span>
// //                             </div>
// //                             <div
// //                                 className={`py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer
// //                                 ${selectedSideBar === 'wishlist' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100'}`}
// //                                 onClick={() => handleNavigation("/user/wishlist", "wishlist")}
// //                             >
// //                                 <ShoppingCart size={16} className="mr-2 text-gray-500" />
// //                                 <span>My Wishlist</span>
// //                             </div>
// //                             <div
// //                                 className={`py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer
// //                                 ${selectedSideBar === 'reviews' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100'}`}
// //                                 onClick={() => handleNavigation("/user/reviews", "reviews")}
// //                             >
// //                                 <Star size={16} className="mr-2 text-gray-500" />
// //                                 <span>My Reviews & Ratings</span>
// //                             </div>
// //                             <div
// //                                 className={`py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer
// //                                     ${selectedSideBar === 'referrals' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100'}`}
// //                                 onClick={() => handleNavigation("/user/referrals", "referrals")}
// //                             >
// //                                 <Star size={16} className="mr-2 text-gray-500" />
// //                                 <span>My Referrals</span>
// //                             </div>
// //                             <div
// //                                 className={`py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer
// //                                     ${selectedSideBar === 'wallet' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100'}`}
// //                                 onClick={() => handleNavigation("/user/wallet", "wallet")}
// //                             >
// //                                 <Wallet size={16} className="mr-2 text-gray-500" />
// //                                 <span>My Wallet</span>
// //                             </div>
// //                         </div>
// //                     )}
// //                 </div>

// //                 {/* Log out */}
// //                 <div className="mt-6">
// //                     <div className="flex items-center px-4 py-3 cursor-pointer rounded-lg hover:bg-gray-100 transition-all duration-200"
// //                         onClick={() => handleLogout()}>
// //                         <span className="mr-3 bg-red- text-black bg-gray-100 p-2 rounded-lg">
// //                             <LogOut size={20} />
// //                         </span>
// //                         <span className="font-medium">Log out</span>
// //                     </div>
// //                 </div>
// //             </nav>

// //             {/* Support section */}
// //             <div className="mt-4 p-4 border-t">
// //                 <div className="bg-gray-50 rounded-lg p-4 text-center">
// //                     <p className="text-sm text-black font-medium">Need help?</p>
// //                     <button className="mt-2 text-xs bg-black text-white px-4 py-2 rounded-lg">
// //                         Contact Support
// //                     </button>
// //                 </div>
// //             </div>
// //         </aside>
// //     );
// // };

// // export default ProfileSideBar;









// // import React, { useState, useEffect } from 'react';
// // import { useNavigate } from 'react-router';
// // import {
// //     ChevronRight,
// //     ChevronDown,
// //     ShoppingBag,
// //     Settings,
// //     Package,
// //     LogOut,
// //     User,
// //     MapPin,
// //     Gift,
// //     Star,
// //     Wallet,
// //     ShoppingCart,
// //     Menu,
// //     X
// // } from 'lucide-react';
// // import { useSelector, useDispatch } from 'react-redux';
// // import { setActiveSelection } from '../../../store/slices/userSidebarSelectedSlice';
// // import { logout } from "../../../store/slices/userSlice.js"
// // import { logout as logoutService } from "../../../services/authService.js"
// // import avthar from "../../../assets/images/avatar.webp"


// // const ProfileSideBar = () => {
// //     const dispatch = useDispatch();
// //     const navigate = useNavigate();

// //     const selectedSideBar = useSelector((state) => state.userSideSelected.activeSelection);
// //     const user = useSelector((state) => state.user.userInfo);

// //     const [expandedSections, setExpandedSections] = useState({
// //         accountSettings: true,
// //         myStuffs: true
// //     });

// //     // State for mobile menu
// //     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
// //     const [isMobileView, setIsMobileView] = useState(false);

// //     // Check screen size
// //     useEffect(() => {
// //         const checkScreenSize = () => {
// //             setIsMobileView(window.innerWidth < 768);
// //             if (window.innerWidth >= 768) {
// //                 setIsMobileMenuOpen(true); // Always open on desktop
// //             } else {
// //                 setIsMobileMenuOpen(false); // Default closed on mobile
// //             }
// //         };

// //         checkScreenSize();
// //         window.addEventListener('resize', checkScreenSize);

// //         return () => {
// //             window.removeEventListener('resize', checkScreenSize);
// //         };
// //     }, []);

// //     const toggleSection = (section) => {
// //         setExpandedSections({
// //             ...expandedSections,
// //             [section]: !expandedSections[section]
// //         });
// //     };

// //     const toggleMobileMenu = () => {
// //         setIsMobileMenuOpen(!isMobileMenuOpen);
// //     };

// //     // Handle navigation and selection
// //     const handleNavigation = (path, selection) => {
// //         dispatch(setActiveSelection(selection));
// //         navigate(path);
// //         if (isMobileView) {
// //             setIsMobileMenuOpen(false); // Close mobile menu after navigation
// //         }
// //     };

// //     const handleLogout = async () => {
// //         try {
// //             const response = await logoutService()
// //             console.log(response.data)
// //             dispatch(logout())
// //         } catch (error) {
// //             console.log("logout fails");
// //         }
// //     }

// //     // Mobile menu toggle button
// //     const MobileMenuToggle = () => (
// //         <div className="md:hidden fixed top-4 left-4 z-50 bg-white rounded-full shadow-md p-2" onClick={toggleMobileMenu}>
// //             {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
// //         </div>
// //     );

// //     // Sidebar content (used both for mobile and desktop)
// //     const SidebarContent = () => (
// //         <>
// //             {/* User Profile Section */}
// //             <div className="bg-gray-50 p-6 border-b">
// //                 <div className="flex items-center">
// //                     <div className="w-14 h-14 rounded-full overflow-hidden mr-4 border-2 border-gray-500">
// //                         <img
// //                             src={(user?.profileImg ? user?.profileImg : avthar)}
// //                             alt="User avatar"
// //                             className="w-full h-full object-cover"
// //                         />
// //                     </div>
// //                     <div>
// //                         <div className="text-lg font-medium"> {user?.username}</div>
// //                         <div className="text-sm text-gray-500">{user?.email}</div>
// //                     </div>
// //                 </div>
// //             </div>

// //             {/* Menu Items */}
// //             <nav className="p-3">
// //                 {/* Account Settings */}
// //                 <div className="mb-2 rounded-lg bg-gray-50">
// //                     <div
// //                         className="flex items-center justify-between px-4 py-3 cursor-pointer"
// //                         onClick={() => toggleSection('accountSettings')}
// //                     >
// //                         <div className="flex items-center">
// //                             <span className="mr-3 text-black bg-gray-100 p-2 rounded-lg">
// //                                 <Settings size={20} />
// //                             </span>
// //                             <span className="font-medium">Account Settings</span>
// //                         </div>
// //                         {expandedSections.accountSettings ?
// //                             <ChevronDown size={18} className="text-gray-500" /> :
// //                             <ChevronRight size={18} className="text-gray-500" />
// //                         }
// //                     </div>

// //                     {/* Submenu for Account Settings */}
// //                     {expandedSections.accountSettings && (
// //                         <div className="ml-4 pl-8 border-l-2 border-gray-200 my-2">
// //                             <div
// //                                 className={`py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer
// //                 ${selectedSideBar === 'profile' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100'}`}
// //                                 onClick={() => handleNavigation("/user/profile", "profile")}
// //                             >
// //                                 <User size={16} className={`mr-2 ${selectedSideBar === 'profile' ? 'text-white' : 'text-gray-500'}`} />
// //                                 <span>Profile Information</span>
// //                             </div>
// //                             <div
// //                                 className={`py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer
// //                 ${selectedSideBar === 'manageAddresses' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100'}`}
// //                                 onClick={() => handleNavigation("/user/manage-address", "manageAddresses")}
// //                             >
// //                                 <MapPin size={16} className={`mr-2 ${selectedSideBar === 'manageAddresses' ? 'text-white' : 'text-gray-500'}`} />
// //                                 <span>Manage Addresses</span>
// //                             </div>
// //                         </div>
// //                     )}
// //                 </div>

// //                 {/* My Stuffs */}
// //                 <div className="mb-2 rounded-lg  transition-all duration-200">
// //                     <div
// //                         className="flex items-center justify-between px-4 py-3 cursor-pointer"
// //                         onClick={() => toggleSection('myStuffs')}
// //                     >
// //                         <div className="flex items-center">
// //                             <span className="mr-3 text-black bg-gray-100 p-2 rounded-lg">
// //                                 <Package size={20} />
// //                             </span>
// //                             <span className="font-medium">My Stuffs</span>
// //                         </div>
// //                         {expandedSections.myStuffs ?
// //                             <ChevronDown size={18} className="text-gray-500" /> :
// //                             <ChevronRight size={18} className="text-gray-500" />
// //                         }
// //                     </div>

// //                     {/* Submenu for My Stuffs */}
// //                     {expandedSections.myStuffs && (
// //                         <div className="ml-4 pl-8 border-l-2 border-gray-200 my-2">
// //                             <div
// //                                 className={`py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer
// //                                     ${selectedSideBar === 'coupons' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100'}`}
// //                                 onClick={() => handleNavigation("/user/coupons", "coupons")}
// //                             >
// //                                 <Gift size={16} className="mr-2 text-gray-500" />
// //                                 <span>My Coupons</span>
// //                             </div>
// //                             <div
// //                                 className={`py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer
// //                                     ${selectedSideBar === 'orders' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100'}`}
// //                                 onClick={() => handleNavigation("/user/orders-list", "orders")}
// //                             >
// //                                 <ShoppingBag size={16} className="mr-2 text-gray-500" />
// //                                 <span>My Orders</span>
// //                             </div>
// //                             <div
// //                                 className={`py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer
// //                                 ${selectedSideBar === 'view-cart' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100'}`}
// //                                 onClick={() => handleNavigation("/user/view-cart", "view-cart")}
// //                             >
// //                                 <ShoppingCart size={16} className="mr-2 text-gray-500" />
// //                                 <span>My Cart</span>
// //                             </div>
// //                             <div
// //                                 className={`py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer
// //                                 ${selectedSideBar === 'wishlist' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100'}`}
// //                                 onClick={() => handleNavigation("/user/wishlist", "wishlist")}
// //                             >
// //                                 <ShoppingCart size={16} className="mr-2 text-gray-500" />
// //                                 <span>My Wishlist</span>
// //                             </div>
// //                             <div
// //                                 className={`py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer
// //                                 ${selectedSideBar === 'reviews' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100'}`}
// //                                 onClick={() => handleNavigation("/user/reviews", "reviews")}
// //                             >
// //                                 <Star size={16} className="mr-2 text-gray-500" />
// //                                 <span>My Reviews & Ratings</span>
// //                             </div>
// //                             <div
// //                                 className={`py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer
// //                                     ${selectedSideBar === 'referrals' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100'}`}
// //                                 onClick={() => handleNavigation("/user/referrals", "referrals")}
// //                             >
// //                                 <Star size={16} className="mr-2 text-gray-500" />
// //                                 <span>My Referrals</span>
// //                             </div>
// //                             <div
// //                                 className={`py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer
// //                                     ${selectedSideBar === 'wallet' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100'}`}
// //                                 onClick={() => handleNavigation("/user/wallet", "wallet")}
// //                             >
// //                                 <Wallet size={16} className="mr-2 text-gray-500" />
// //                                 <span>My Wallet</span>
// //                             </div>
// //                         </div>
// //                     )}
// //                 </div>

// //                 {/* Log out */}
// //                 <div className="mt-6">
// //                     <div className="flex items-center px-4 py-3 cursor-pointer rounded-lg hover:bg-gray-100 transition-all duration-200"
// //                         onClick={() => handleLogout()}>
// //                         <span className="mr-3 bg-red- text-black bg-gray-100 p-2 rounded-lg">
// //                             <LogOut size={20} />
// //                         </span>
// //                         <span className="font-medium">Log out</span>
// //                     </div>
// //                 </div>
// //             </nav>

// //             {/* Support section */}
// //             <div className="mt-4 p-4 border-t">
// //                 <div className="bg-gray-50 rounded-lg p-4 text-center">
// //                     <p className="text-sm text-black font-medium">Need help?</p>
// //                     <button className="mt-2 text-xs bg-black text-white px-4 py-2 rounded-lg">
// //                         Contact Support
// //                     </button>
// //                 </div>
// //             </div>
// //         </>
// //     );

// //     return (
// //         <>
// //             {/* Mobile hamburger menu toggle */}
// //             <MobileMenuToggle />

// //             {/* Mobile sidebar overlay */}
// //             {isMobileView && isMobileMenuOpen && (
// //                 <div
// //                     className="fixed inset-0  bg-opacity-50 z-40"
// //                     onClick={toggleMobileMenu}
// //                 ></div>
// //             )}

// //             {/* Sidebar container (desktop always visible, mobile conditionally visible) */}
// //             <aside
// //                 className={`${isMobileView ? 'fixed left-0 top-0 z-40 h-full w-64 transition-transform duration-300 ease-in-out' : 'w-82 sticky top-5 h-full'} 
// //                 ${isMobileView && !isMobileMenuOpen ? '-translate-x-full' : 'translate-x-0'} 
// //                 bg-white shadow-lg rounded-lg overflow-hidden`}
// //             >
// //                 <SidebarContent />
// //             </aside>
// //         </>
// //     );
// // };

// // export default ProfileSideBar;




// // import React, { useState, useEffect, useRef } from 'react';
// // import { useNavigate } from 'react-router';
// // import {
// //     ChevronRight,
// //     ChevronDown,
// //     ShoppingBag,
// //     Settings,
// //     Package,
// //     LogOut,
// //     User,
// //     MapPin,
// //     Gift,
// //     Star,
// //     Wallet,
// //     ShoppingCart,
// //     Menu,
// //     X
// // } from 'lucide-react';
// // import { useSelector, useDispatch } from 'react-redux';
// // import { setActiveSelection } from '../../../store/slices/userSidebarSelectedSlice';
// // import { logout } from "../../../store/slices/userSlice.js"
// // import { logout as logoutService } from "../../../services/authService.js"
// // import avthar from "../../../assets/images/avatar.webp"


// // const ProfileSideBar = () => {
// //     const dispatch = useDispatch();
// //     const navigate = useNavigate();

// //     const selectedSideBar = useSelector((state) => state.userSideSelected.activeSelection);
// //     const user = useSelector((state) => state.user.userInfo);

// //     const [expandedSections, setExpandedSections] = useState({
// //         accountSettings: true,
// //         myStuffs: true
// //     });

// //     // State for mobile menu
// //     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
// //     const [isMobileView, setIsMobileView] = useState(false);
// //     const [isMenuVisible, setIsMenuVisible] = useState(true);
// //     const lastScrollTop = useRef(0);

// //     // Check screen size
// //     useEffect(() => {
// //         const checkScreenSize = () => {
// //             setIsMobileView(window.innerWidth < 768);
// //             if (window.innerWidth >= 768) {
// //                 setIsMobileMenuOpen(true); // Always open on desktop
// //             } else {
// //                 setIsMobileMenuOpen(false); // Default closed on mobile
// //             }
// //         };

// //         checkScreenSize();
// //         window.addEventListener('resize', checkScreenSize);

// //         return () => {
// //             window.removeEventListener('resize', checkScreenSize);
// //         };
// //     }, []);

// //     // Handle scroll behavior for hamburger menu
// //     useEffect(() => {
// //         const handleScroll = () => {
// //             const st = window.pageYOffset || document.documentElement.scrollTop;
// //             // Hide menu when scrolling down, show when scrolling up
// //             if (st > lastScrollTop.current + 10) {
// //                 setIsMenuVisible(false);
// //             } else if (st < lastScrollTop.current - 10) {
// //                 setIsMenuVisible(true);
// //             }
// //             lastScrollTop.current = st <= 0 ? 0 : st;
// //         };

// //         window.addEventListener('scroll', handleScroll);
// //         return () => {
// //             window.removeEventListener('scroll', handleScroll);
// //         };
// //     }, []);

// //     const toggleSection = (section) => {
// //         setExpandedSections({
// //             ...expandedSections,
// //             [section]: !expandedSections[section]
// //         });
// //     };

// //     const toggleMobileMenu = () => {
// //         setIsMobileMenuOpen(!isMobileMenuOpen);
// //     };

// //     // Handle navigation and selection
// //     const handleNavigation = (path, selection) => {
// //         dispatch(setActiveSelection(selection));
// //         navigate(path);
// //         if (isMobileView) {
// //             setIsMobileMenuOpen(false); // Close mobile menu after navigation
// //         }
// //     };

// //     const handleLogout = async () => {
// //         try {
// //             const response = await logoutService()
// //             console.log(response.data)
// //             dispatch(logout())
// //         } catch (error) {
// //             console.log("logout fails");
// //         }
// //     }

// //     // Mobile menu toggle button
// //     const MobileMenuToggle = () => (
// //         <div
// //             className={`md:hidden fixed z-50 bg-white rounded-full shadow-md p-2 transition-all duration-300 ${isMenuVisible ? 'opacity-100 bottom-6 left-6' : 'opacity-0 -bottom-16'}`}
// //             onClick={toggleMobileMenu}
// //         >
// //             {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
// //         </div>
// //     );

// //     // Sidebar content (used both for mobile and desktop)
// //     const SidebarContent = () => (
// //         <>
// //             {/* User Profile Section */}
// //             <div className="bg-gray-50 p-6 border-b">
// //                 <div className="flex items-center">
// //                     <div className="w-14 h-14 rounded-full overflow-hidden mr-4 border-2 border-gray-500">
// //                         <img
// //                             src={(user?.profileImg ? user?.profileImg : avthar)}
// //                             alt="User avatar"
// //                             className="w-full h-full object-cover"
// //                         />
// //                     </div>
// //                     <div>
// //                         <div className="text-lg font-medium"> {user?.username}</div>
// //                         <div className="text-sm text-gray-500">{user?.email}</div>
// //                     </div>
// //                 </div>
// //             </div>

// //             {/* Menu Items */}
// //             <nav className="p-3">
// //                 {/* Account Settings */}
// //                 <div className="mb-2 rounded-lg bg-gray-50">
// //                     <div
// //                         className="flex items-center justify-between px-4 py-3 cursor-pointer"
// //                         onClick={() => toggleSection('accountSettings')}
// //                     >
// //                         <div className="flex items-center">
// //                             <span className="mr-3 text-black bg-gray-100 p-2 rounded-lg">
// //                                 <Settings size={20} />
// //                             </span>
// //                             <span className="font-medium">Account Settings</span>
// //                         </div>
// //                         {expandedSections.accountSettings ?
// //                             <ChevronDown size={18} className="text-gray-500" /> :
// //                             <ChevronRight size={18} className="text-gray-500" />
// //                         }
// //                     </div>

// //                     {/* Submenu for Account Settings */}
// //                     {expandedSections.accountSettings && (
// //                         <div className="ml-4 pl-8 border-l-2 border-gray-200 my-2">
// //                             <div
// //                                 className={`py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer
// //                 ${selectedSideBar === 'profile' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100'}`}
// //                                 onClick={() => handleNavigation("/user/profile", "profile")}
// //                             >
// //                                 <User size={16} className={`mr-2 ${selectedSideBar === 'profile' ? 'text-white' : 'text-gray-500'}`} />
// //                                 <span>Profile Information</span>
// //                             </div>
// //                             <div
// //                                 className={`py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer
// //                 ${selectedSideBar === 'manageAddresses' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100'}`}
// //                                 onClick={() => handleNavigation("/user/manage-address", "manageAddresses")}
// //                             >
// //                                 <MapPin size={16} className={`mr-2 ${selectedSideBar === 'manageAddresses' ? 'text-white' : 'text-gray-500'}`} />
// //                                 <span>Manage Addresses</span>
// //                             </div>
// //                         </div>
// //                     )}
// //                 </div>

// //                 {/* My Stuffs */}
// //                 <div className="mb-2 rounded-lg  transition-all duration-200">
// //                     <div
// //                         className="flex items-center justify-between px-4 py-3 cursor-pointer"
// //                         onClick={() => toggleSection('myStuffs')}
// //                     >
// //                         <div className="flex items-center">
// //                             <span className="mr-3 text-black bg-gray-100 p-2 rounded-lg">
// //                                 <Package size={20} />
// //                             </span>
// //                             <span className="font-medium">My Stuffs</span>
// //                         </div>
// //                         {expandedSections.myStuffs ?
// //                             <ChevronDown size={18} className="text-gray-500" /> :
// //                             <ChevronRight size={18} className="text-gray-500" />
// //                         }
// //                     </div>

// //                     {/* Submenu for My Stuffs */}
// //                     {expandedSections.myStuffs && (
// //                         <div className="ml-4 pl-8 border-l-2 border-gray-200 my-2">
// //                             {/* <div
// //                                 className={`py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer
// //                                     ${selectedSideBar === 'coupons' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100'}`}
// //                                 onClick={() => handleNavigation("/user/coupons", "coupons")}
// //                             >
// //                                 <Gift size={16} className="mr-2 text-gray-500" />
// //                                 <span>My Coupons</span>
// //                             </div> */}
// //                             <div
// //                                 className={`py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer
// //                                     ${selectedSideBar === 'orders' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100'}`}
// //                                 onClick={() => handleNavigation("/user/orders-list", "orders")}
// //                             >
// //                                 <ShoppingBag size={16} className="mr-2 text-gray-500" />
// //                                 <span>My Orders</span>
// //                             </div>
// //                             <div
// //                                 className={`py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer
// //                                 ${selectedSideBar === 'view-cart' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100'}`}
// //                                 onClick={() => handleNavigation("/user/view-cart", "view-cart")}
// //                             >
// //                                 <ShoppingCart size={16} className="mr-2 text-gray-500" />
// //                                 <span>My Cart</span>
// //                             </div>
// //                             <div
// //                                 className={`py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer
// //                                 ${selectedSideBar === 'wishlist' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100'}`}
// //                                 onClick={() => handleNavigation("/user/wishlist", "wishlist")}
// //                             >
// //                                 <ShoppingCart size={16} className="mr-2 text-gray-500" />
// //                                 <span>My Wishlist</span>
// //                             </div>
// //                             {/* <div
// //                                 className={`py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer
// //                                 ${selectedSideBar === 'reviews' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100'}`}
// //                                 onClick={() => handleNavigation("/user/reviews", "reviews")}
// //                             >
// //                                 <Star size={16} className="mr-2 text-gray-500" />
// //                                 <span>My Reviews & Ratings</span>
// //                             </div> */}
// //                             <div
// //                                 className={`py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer
// //                                     ${selectedSideBar === 'referrals' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100'}`}
// //                                 onClick={() => handleNavigation("/user/referrals", "referrals")}
// //                             >
// //                                 <Star size={16} className="mr-2 text-gray-500" />
// //                                 <span>My Referrals</span>
// //                             </div>
// //                             <div
// //                                 className={`py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer
// //                                     ${selectedSideBar === 'wallet' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100'}`}
// //                                 onClick={() => handleNavigation("/user/wallet", "wallet")}
// //                             >
// //                                 <Wallet size={16} className="mr-2 text-gray-500" />
// //                                 <span>My Wallet</span>
// //                             </div>
// //                         </div>
// //                     )}
// //                 </div>

// //                 {/* Log out */}
// //                 <div className="mt-6">
// //                     <div className="flex items-center px-4 py-3 cursor-pointer rounded-lg hover:bg-gray-100 transition-all duration-200"
// //                         onClick={() => handleLogout()}>
// //                         <span className="mr-3 bg-red- text-black bg-gray-100 p-2 rounded-lg">
// //                             <LogOut size={20} />
// //                         </span>
// //                         <span className="font-medium">Log out</span>
// //                     </div>
// //                 </div>
// //             </nav>

// //             {/* Support section */}
// //             <div className="mt-4 p-4 border-t">
// //                 <div className="bg-gray-50 rounded-lg p-4 text-center">
// //                     <p className="text-sm text-black font-medium">Need help?</p>
// //                     <button className="mt-2 text-xs bg-black text-white px-4 py-2 rounded-lg">
// //                         Contact Support
// //                     </button>
// //                 </div>
// //             </div>
// //         </>
// //     );

// //     return (
// //         <>
// //             {/* Mobile hamburger menu toggle */}
// //             <MobileMenuToggle />

// //             {/* Mobile sidebar overlay */}
// //             {isMobileView && isMobileMenuOpen && (
// //                 <div
// //                     className="fixed inset-0  bg-opacity-50 z-40"
// //                     onClick={toggleMobileMenu}
// //                 ></div>
// //             )}

// //             {/* Sidebar container (desktop always visible, mobile conditionally visible) */}
// //             <aside
// //                 className={`${isMobileView ? 'fixed left-0 top-0 z-40 h-full w-64 transition-transform duration-300 ease-in-out overflow-y-auto' : 'w-82 sticky top-5 h-full'} 
// //                 ${isMobileView && !isMobileMenuOpen ? '-translate-x-full' : 'translate-x-0'} 
// //                 bg-white shadow-lg rounded-lg`}
// //                 style={{ maxHeight: isMobileView ? '100vh' : 'calc(100vh - 40px)' }}
// //             >
// //                 <SidebarContent />
// //             </aside>
// //         </>
// //     );
// // };

// // export default ProfileSideBar;










// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router';
// import {
//     ChevronRight,
//     ChevronDown,
//     ShoppingBag,
//     Settings,
//     Package,
//     LogOut,
//     User,
//     MapPin,
//     Gift,
//     Star,
//     Wallet,
//     ShoppingCart,
//     Menu,
//     X
// } from 'lucide-react';
// import { useSelector, useDispatch } from 'react-redux';
// import { setActiveSelection } from '../../../store/slices/userSidebarSelectedSlice';
// import { logout } from "../../../store/slices/userSlice.js"
// import { logout as logoutService } from "../../../services/authService.js"
// import avthar from "../../../assets/images/avatar.webp"


// const ProfileSideBar = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const selectedSideBar = useSelector((state) => state.userSideSelected.activeSelection);
//     const user = useSelector((state) => state.user.userInfo);

//     const [expandedSections, setExpandedSections] = useState({
//         accountSettings: true,
//         myStuffs: true
//     });

//     // State for mobile/tablet menu
//     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//     const [isCompactView, setIsCompactView] = useState(false);
//     const [isMenuVisible, setIsMenuVisible] = useState(true);
//     const lastScrollTop = useRef(0);

//     // Update breakpoint to include tablets (up to 1024px)
//     useEffect(() => {
//         const checkScreenSize = () => {
//             setIsCompactView(window.innerWidth < 1024); // Changed from 768px to 1024px to include tablets
//             if (window.innerWidth >= 1024) {
//                 setIsMobileMenuOpen(true); // Always open on desktop
//             } else {
//                 setIsMobileMenuOpen(false); // Default closed on mobile and tablet
//             }
//         };

//         checkScreenSize();
//         window.addEventListener('resize', checkScreenSize);

//         return () => {
//             window.removeEventListener('resize', checkScreenSize);
//         };
//     }, []);

//     // Handle scroll behavior for hamburger menu
//     useEffect(() => {
//         const handleScroll = () => {
//             const st = window.pageYOffset || document.documentElement.scrollTop;
//             // Hide menu when scrolling down, show when scrolling up
//             if (st > lastScrollTop.current + 10) {
//                 setIsMenuVisible(false);
//             } else if (st < lastScrollTop.current - 10) {
//                 setIsMenuVisible(true);
//             }
//             lastScrollTop.current = st <= 0 ? 0 : st;
//         };

//         window.addEventListener('scroll', handleScroll);
//         return () => {
//             window.removeEventListener('scroll', handleScroll);
//         };
//     }, []);

//     const toggleSection = (section) => {
//         setExpandedSections({
//             ...expandedSections,
//             [section]: !expandedSections[section]
//         });
//     };

//     const toggleMobileMenu = () => {
//         setIsMobileMenuOpen(!isMobileMenuOpen);
//     };

//     // Handle navigation and selection
//     const handleNavigation = (path, selection) => {
//         dispatch(setActiveSelection(selection));
//         navigate(path);
//         if (isCompactView) {
//             setIsMobileMenuOpen(false); // Close mobile/tablet menu after navigation
//         }
//     };

//     const handleLogout = async () => {
//         try {
//             const response = await logoutService()
//             console.log(response.data)
//             dispatch(logout())
//         } catch (error) {
//             console.log("logout fails");
//         }
//     }

//     // Mobile/Tablet menu toggle button
//     const CompactMenuToggle = () => (
//         <div
//             className={`lg:hidden fixed z-50 bg-white rounded-full shadow-md p-2 transition-all duration-300 ${isMenuVisible ? 'opacity-100 bottom-6 left-6' : 'opacity-0 -bottom-16'}`}
//             onClick={toggleMobileMenu}
//         >
//             {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//         </div>
//     );

//     // Sidebar content (used for all screen sizes)
//     const SidebarContent = () => (
//         <>
//             {/* User Profile Section */}
//             <div className="bg-gray-50 p-6 border-b">
//                 <div className="flex items-center">
//                     <div className="w-14 h-14 rounded-full overflow-hidden mr-4 border-2 border-gray-500">
//                         <img
//                             src={(user?.profileImg ? user?.profileImg : avthar)}
//                             alt="User avatar"
//                             className="w-full h-full object-cover"
//                         />
//                     </div>
//                     <div>
//                         <div className="text-lg font-medium"> {user?.username}</div>
//                         <div className="text-sm text-gray-500">{user?.email}</div>
//                     </div>
//                 </div>
//             </div>

//             {/* Menu Items */}
//             <nav className="p-3">
//                 {/* Account Settings */}
//                 <div className="mb-2 rounded-lg bg-gray-50">
//                     <div
//                         className="flex items-center justify-between px-4 py-3 cursor-pointer"
//                         onClick={() => toggleSection('accountSettings')}
//                     >
//                         <div className="flex items-center">
//                             <span className="mr-3 text-black bg-gray-100 p-2 rounded-lg">
//                                 <Settings size={20} />
//                             </span>
//                             <span className="font-medium">Account Settings</span>
//                         </div>
//                         {expandedSections.accountSettings ?
//                             <ChevronDown size={18} className="text-gray-500" /> :
//                             <ChevronRight size={18} className="text-gray-500" />
//                         }
//                     </div>

//                     {/* Submenu for Account Settings */}
//                     {expandedSections.accountSettings && (
//                         <div className="ml-4 pl-8 border-l-2 border-gray-200 my-2">
//                             <div
//                                 className={`py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer
//                 ${selectedSideBar === 'profile' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100'}`}
//                                 onClick={() => handleNavigation("/user/profile", "profile")}
//                             >
//                                 <User size={16} className={`mr-2 ${selectedSideBar === 'profile' ? 'text-white' : 'text-gray-500'}`} />
//                                 <span>Profile Information</span>
//                             </div>
//                             <div
//                                 className={`py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer
//                 ${selectedSideBar === 'manageAddresses' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100'}`}
//                                 onClick={() => handleNavigation("/user/manage-address", "manageAddresses")}
//                             >
//                                 <MapPin size={16} className={`mr-2 ${selectedSideBar === 'manageAddresses' ? 'text-white' : 'text-gray-500'}`} />
//                                 <span>Manage Addresses</span>
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {/* My Stuffs */}
//                 <div className="mb-2 rounded-lg  transition-all duration-200">
//                     <div
//                         className="flex items-center justify-between px-4 py-3 cursor-pointer"
//                         onClick={() => toggleSection('myStuffs')}
//                     >
//                         <div className="flex items-center">
//                             <span className="mr-3 text-black bg-gray-100 p-2 rounded-lg">
//                                 <Package size={20} />
//                             </span>
//                             <span className="font-medium">My Stuffs</span>
//                         </div>
//                         {expandedSections.myStuffs ?
//                             <ChevronDown size={18} className="text-gray-500" /> :
//                             <ChevronRight size={18} className="text-gray-500" />
//                         }
//                     </div>

//                     {/* Submenu for My Stuffs */}
//                     {expandedSections.myStuffs && (
//                         <div className="ml-4 pl-8 border-l-2 border-gray-200 my-2">
//                             <div
//                                 className={`py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer
//                                     ${selectedSideBar === 'orders' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100'}`}
//                                 onClick={() => handleNavigation("/user/orders-list", "orders")}
//                             >
//                                 <ShoppingBag size={16} className="mr-2 text-gray-500" />
//                                 <span>My Orders</span>
//                             </div>
//                             <div
//                                 className={`py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer
//                                 ${selectedSideBar === 'view-cart' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100'}`}
//                                 onClick={() => handleNavigation("/user/view-cart", "view-cart")}
//                             >
//                                 <ShoppingCart size={16} className="mr-2 text-gray-500" />
//                                 <span>My Cart</span>
//                             </div>
//                             <div
//                                 className={`py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer
//                                 ${selectedSideBar === 'wishlist' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100'}`}
//                                 onClick={() => handleNavigation("/user/wishlist", "wishlist")}
//                             >
//                                 <ShoppingCart size={16} className="mr-2 text-gray-500" />
//                                 <span>My Wishlist</span>
//                             </div>
//                             <div
//                                 className={`py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer
//                                     ${selectedSideBar === 'referrals' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100'}`}
//                                 onClick={() => handleNavigation("/user/referrals", "referrals")}
//                             >
//                                 <Star size={16} className="mr-2 text-gray-500" />
//                                 <span>My Referrals</span>
//                             </div>
//                             <div
//                                 className={`py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer
//                                     ${selectedSideBar === 'wallet' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100'}`}
//                                 onClick={() => handleNavigation("/user/wallet", "wallet")}
//                             >
//                                 <Wallet size={16} className="mr-2 text-gray-500" />
//                                 <span>My Wallet</span>
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {/* Log out */}
//                 <div className="mt-6">
//                     <div className="flex items-center px-4 py-3 cursor-pointer rounded-lg hover:bg-gray-100 transition-all duration-200"
//                         onClick={() => handleLogout()}>
//                         <span className="mr-3 bg-red- text-black bg-gray-100 p-2 rounded-lg">
//                             <LogOut size={20} />
//                         </span>
//                         <span className="font-medium">Log out</span>
//                     </div>
//                 </div>
//             </nav>

//             {/* Support section */}
//             <div className="mt-4 p-4 border-t">
//                 <div className="bg-gray-50 rounded-lg p-4 text-center">
//                     <p className="text-sm text-black font-medium">Need help?</p>
//                     <button className="mt-2 text-xs bg-black text-white px-4 py-2 rounded-lg">
//                         Contact Support
//                     </button>
//                 </div>
//             </div>
//         </>
//     );

//     return (
//         <>
//             {/* Mobile/Tablet hamburger menu toggle */}
//             <CompactMenuToggle />

//             {/* Mobile/Tablet sidebar overlay */}
//             {isCompactView && isMobileMenuOpen && (
//                 <div
//                     className="fixed inset-0  bg-opacity-50 z-40"
//                     onClick={toggleMobileMenu}
//                 ></div>
//             )}

//             {/* Sidebar container - responsive for all screen sizes */}
//             <aside
//                 className={`${isCompactView ? 'fixed left-0 top-0 z-40 h-full w-72 transition-transform duration-300 ease-in-out overflow-y-auto' : 'w-82 sticky top-5 h-full'} 
//                 ${isCompactView && !isMobileMenuOpen ? '-translate-x-full' : 'translate-x-0'} 
//                 bg-white shadow-lg rounded-lg`}
//                 style={{ maxHeight: isCompactView ? '100vh' : 'calc(100vh - 40px)' }}
//             >
//                 <SidebarContent />
//             </aside>
//         </>
//     );
// };

// export default ProfileSideBar;




import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import {
    ChevronRight,
    ChevronDown,
    ShoppingBag,
    Settings,
    Package,
    LogOut,
    User,
    MapPin,
    Gift,
    Star,
    Wallet,
    ShoppingCart,
    Menu,
    X
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveSelection } from '../../../store/slices/userSidebarSelectedSlice';
import { logout } from "../../../store/slices/userSlice.js"
import { logout as logoutService } from "../../../services/authService.js"
import avthar from "../../../assets/images/avatar.webp"


const ProfileSideBar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const selectedSideBar = useSelector((state) => state.userSideSelected.activeSelection);
    const user = useSelector((state) => state.user.userInfo);

    const [expandedSections, setExpandedSections] = useState({
        accountSettings: true,
        myStuffs: true
    });

    // State for mobile/tablet menu
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCompactView, setIsCompactView] = useState(false);
    const [isMenuVisible, setIsMenuVisible] = useState(true);
    const lastScrollTop = useRef(0);

    // Update breakpoint to include tablets (up to 1024px)
    useEffect(() => {
        const checkScreenSize = () => {
            setIsCompactView(window.innerWidth < 1024); // Changed from 768px to 1024px to include tablets
            if (window.innerWidth >= 1024) {
                setIsMobileMenuOpen(true); // Always open on desktop
            } else {
                setIsMobileMenuOpen(false); // Default closed on mobile and tablet
            }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    // Handle scroll behavior for hamburger menu
    useEffect(() => {
        const handleScroll = () => {
            const st = window.pageYOffset || document.documentElement.scrollTop;
            // Hide menu when scrolling down, show when scrolling up
            if (st > lastScrollTop.current + 10) {
                setIsMenuVisible(false);
            } else if (st < lastScrollTop.current - 10) {
                setIsMenuVisible(true);
            }
            lastScrollTop.current = st <= 0 ? 0 : st;
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const toggleSection = (section) => {
        setExpandedSections({
            ...expandedSections,
            [section]: !expandedSections[section]
        });
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Handle navigation and selection
    const handleNavigation = (path, selection) => {
        dispatch(setActiveSelection(selection));
        navigate(path);
        if (isCompactView) {
            setIsMobileMenuOpen(false); // Close mobile/tablet menu after navigation
        }
    };

    const handleLogout = async () => {
        try {
            const response = await logoutService()
            console.log(response.data)
            dispatch(logout())
        } catch (error) {
            console.log("logout fails");
        }
    }

    // Mobile/Tablet menu toggle button
    const CompactMenuToggle = () => (
        <div
            className={`lg:hidden fixed z-50 bg-white rounded-full shadow-md p-2 transition-all duration-300 ${isMenuVisible ? 'opacity-100 bottom-6 left-6' : 'opacity-0 -bottom-16'}`}
            onClick={toggleMobileMenu}
        >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </div>
    );

    // Sidebar content (used for all screen sizes)
    const SidebarContent = () => (
        <>
            {/* User Profile Section */}
            <div className="bg-gray-50 p-6 border-b">
                <div className="flex items-center">
                    <div className="w-14 h-14 rounded-full overflow-hidden mr-4 border-2 border-gray-500">
                        <img
                            src={(user?.profileImg ? user?.profileImg : avthar)}
                            alt="User avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <div className="text-lg font-medium"> {user?.username}</div>
                        <div className="text-sm text-gray-500">{user?.email}</div>
                    </div>
                </div>
            </div>

            {/* Menu Items */}
            <nav className="p-3">
                {/* Account Settings */}
                <div className="mb-2 rounded-lg bg-gray-50">
                    <div
                        className="flex items-center justify-between px-4 py-3 cursor-pointer"
                        onClick={() => toggleSection('accountSettings')}
                    >
                        <div className="flex items-center">
                            <span className="mr-3 text-black bg-gray-100 p-2 rounded-lg">
                                <Settings size={20} />
                            </span>
                            <span className="font-medium">Account Settings</span>
                        </div>
                        {expandedSections.accountSettings ?
                            <ChevronDown size={18} className="text-gray-500" /> :
                            <ChevronRight size={18} className="text-gray-500" />
                        }
                    </div>

                    {/* Submenu for Account Settings */}
                    {expandedSections.accountSettings && (
                        <div className="ml-4 pl-8 border-l-2 border-gray-200 my-2">
                            <div
                                className={`py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer
                ${selectedSideBar === 'profile' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100'}`}
                                onClick={() => handleNavigation("/user/profile", "profile")}
                            >
                                <User size={16} className={`mr-2 ${selectedSideBar === 'profile' ? 'text-white' : 'text-gray-500'}`} />
                                <span>Profile Information</span>
                            </div>
                            <div
                                className={`py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer
                ${selectedSideBar === 'manageAddresses' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100'}`}
                                onClick={() => handleNavigation("/user/manage-address", "manageAddresses")}
                            >
                                <MapPin size={16} className={`mr-2 ${selectedSideBar === 'manageAddresses' ? 'text-white' : 'text-gray-500'}`} />
                                <span>Manage Addresses</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* My Stuffs */}
                <div className="mb-2 rounded-lg  transition-all duration-200">
                    <div
                        className="flex items-center justify-between px-4 py-3 cursor-pointer"
                        onClick={() => toggleSection('myStuffs')}
                    >
                        <div className="flex items-center">
                            <span className="mr-3 text-black bg-gray-100 p-2 rounded-lg">
                                <Package size={20} />
                            </span>
                            <span className="font-medium">My Stuffs</span>
                        </div>
                        {expandedSections.myStuffs ?
                            <ChevronDown size={18} className="text-gray-500" /> :
                            <ChevronRight size={18} className="text-gray-500" />
                        }
                    </div>

                    {/* Submenu for My Stuffs */}
                    {expandedSections.myStuffs && (
                        <div className="ml-4 pl-8 border-l-2 border-gray-200 my-2">
                            <div
                                className={`py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer
                                    ${selectedSideBar === 'orders' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100'}`}
                                onClick={() => handleNavigation("/user/orders-list", "orders")}
                            >
                                <ShoppingBag size={16} className="mr-2 text-gray-500" />
                                <span>My Orders</span>
                            </div>
                            <div
                                className={`py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer
                                ${selectedSideBar === 'view-cart' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100'}`}
                                onClick={() => handleNavigation("/user/view-cart", "view-cart")}
                            >
                                <ShoppingCart size={16} className="mr-2 text-gray-500" />
                                <span>My Cart</span>
                            </div>
                            <div
                                className={`py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer
                                ${selectedSideBar === 'wishlist' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100'}`}
                                onClick={() => handleNavigation("/user/wishlist", "wishlist")}
                            >
                                <ShoppingCart size={16} className="mr-2 text-gray-500" />
                                <span>My Wishlist</span>
                            </div>
                            <div
                                className={`py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer
                                    ${selectedSideBar === 'referrals' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100'}`}
                                onClick={() => handleNavigation("/user/referrals", "referrals")}
                            >
                                <Star size={16} className="mr-2 text-gray-500" />
                                <span>My Referrals</span>
                            </div>
                            <div
                                className={`py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer
                                    ${selectedSideBar === 'wallet' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100'}`}
                                onClick={() => handleNavigation("/user/wallet", "wallet")}
                            >
                                <Wallet size={16} className="mr-2 text-gray-500" />
                                <span>My Wallet</span>
                            </div>
                        </div>
                    )}
                    <div className="mt-6">
                        <div className="flex items-center px-4 py-3 cursor-pointer rounded-lg hover:bg-gray-100 transition-all duration-200"
                            onClick={() => handleLogout()}>
                            <span className="mr-3 bg-red- text-black bg-gray-100 p-2 rounded-lg">
                                <LogOut size={20} />
                            </span>
                            <span className="font-medium">Log out</span>
                        </div>
                    </div>

                    <div className="mt-4 p-4 border-t">
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                            <p className="text-sm text-black font-medium">Need help?</p>
                            <button className="mt-2 text-xs bg-black text-white px-4 py-2 rounded-lg">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );

    return (
        <>
            {/* Mobile/Tablet hamburger menu toggle */}
            <CompactMenuToggle />

            {/* Mobile/Tablet sidebar overlay */}
            {isCompactView && isMobileMenuOpen && (
                <div
                    className="fixed inset-0  bg-opacity-50 z-40"
                    onClick={toggleMobileMenu}
                ></div>
            )}

            {/* Sidebar container - responsive for all screen sizes */}
            <aside
                className={`${isCompactView ? 'fixed left-0 top-0 z-40 h-full w-72 transition-transform duration-300 ease-in-out overflow-y-auto' : 'lg:w-64 xl:w-80 w-80 sticky top-5 h-full'} 
                ${isCompactView && !isMobileMenuOpen ? '-translate-x-full' : 'translate-x-0'} 
                bg-white shadow-lg rounded-lg`}
            >
                <SidebarContent />
            </aside>
        </>
    );
};

export default ProfileSideBar;
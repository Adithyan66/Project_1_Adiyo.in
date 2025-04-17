

// import React from 'react';
// import PropTypes from 'prop-types';
// import { useNavigate } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { toast } from 'react-toastify';
// import { logout } from '../../store/slices/userSlice';
// import { setActiveSelection } from "../../store/slices/adminSideSelectedSlice";
// import { logout as logoutUser } from "../../services/authService"
// import {
//     ShopIcon,
//     CustomersListIcon,
//     Dashboard,
//     DeliveryTruck,
//     ProductsIcon,
//     Coupen,
//     ManageCatogeryIcon,
//     OrdersIcon
// } from '../../icons/icons';

// const Sidebar = ({ isOpen, onClose }) => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const selectedSection = useSelector((state) => state.adminSideSelected.activeSelection);

//     const menuItems = [
//         { id: 'dashboard', label: 'Dashboard', icon: <Dashboard className="w-5 h-5" />, path: '/admin/dashboard' },
//         { id: 'orders', label: 'Orders', icon: <OrdersIcon className="w-5 h-5" />, path: '/admin/orders' },
//         { id: 'sellers', label: 'Sellers', icon: <ShopIcon className="w-5 h-5" />, path: '/admin/sellers' },
//         { id: 'customers', label: 'Customers', icon: <CustomersListIcon className="w-5 h-5" />, path: '/admin/customers' },
//         { id: 'delivery', label: 'Delivery Agent', icon: <DeliveryTruck className="w-5 h-5" />, path: '/admin/delivery' },
//         { id: 'manageProducts', label: 'Manage Products', icon: <ProductsIcon className="w-5 h-5" />, path: '/admin/manage-products' },
//         { id: 'editCoupon', label: 'Coupons', icon: <Coupen className="w-5 h-5" />, path: '/admin/coupons' },
//         { id: 'manageCategory', label: 'Manage Category', icon: <ManageCatogeryIcon className="w-5 h-5" />, path: '/admin/manage-Category' },
//         { id: 'offers', label: 'Manage Offers', icon: <ManageCatogeryIcon className="w-5 h-5" />, path: '/admin/manage-offers' },
//         { id: 'salesReport', label: 'Sales Report', icon: <ManageCatogeryIcon className="w-5 h-5" />, path: '/admin/sales-report' },
//         { id: 'walletManagement', label: 'Wallet Management', icon: <ManageCatogeryIcon className="w-5 h-5" />, path: '/admin/wallet-management' },
//     ];

//     const handleLogout = async () => {
//         try {
//             await logoutUser();
//             dispatch(logout());
//             navigate('/');
//         } catch (error) {
//             console.log('Logout failed');
//         }
//     };

//     const handleMenuClick = (id, path) => {
//         if (id === 'delivery') {
//             return toast.error('Currently not available');
//         }
//         dispatch(setActiveSelection(id));
//         navigate(path);
//         if (window.innerWidth < 768) {
//             onClose();
//         }
//     };

//     return (
//         <aside
//             className={`fixed inset-y-0 left-0 w-72 bg-white shadow-lg border-r border-gray-100 transition-transform duration-300 md:sticky md:top-0 md:h-screen md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
//                 } z-40`}
//         >
//             <div className="flex flex-col h-full">
//                 {/* Logo/Header */}
//                 <div className="h-16 flex items-center px-6 border-b border-gray-100">
//                     <h2 className="text-xl font-bold text-gray-800 tracking-wide">ADMIN PANEL</h2>
//                 </div>

//                 {/* Navigation */}
//                 <nav className="flex-1 overflow-y-auto py-4 px-3">
//                     <div className="space-y-1">
//                         {menuItems.map((item) => (
//                             <div
//                                 key={item.id}
//                                 className={`flex items-center cursor-pointer rounded-lg transition-all duration-200 ${selectedSection === item.id ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
//                                     }`}
//                                 onClick={() => handleMenuClick(item.id, item.path)}
//                             >
//                                 <div className="flex items-center w-full px-4 py-3">
//                                     <div className={`${selectedSection === item.id ? 'text-white' : 'text-gray-500'}`}>
//                                         {item.icon}
//                                     </div>
//                                     <span className="ml-3 font-medium text-sm">{item.label}</span>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </nav>

//                 {/* Logout */}
//                 <div className="p-4 border-t border-gray-100">
//                     <button
//                         onClick={handleLogout}
//                         className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
//                     >
//                         <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             className="h-5 w-5 mr-2"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke="currentColor"
//                         >
//                             <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
//                             />
//                         </svg>
//                         Sign Out
//                     </button>
//                 </div>
//             </div>
//         </aside>
//     );
// };

// Sidebar.propTypes = {
//     isOpen: PropTypes.bool.isRequired,
//     onClose: PropTypes.func.isRequired,
// };

// export default Sidebar;








import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { logout } from '../../store/slices/userSlice';
import { setActiveSelection } from "../../store/slices/adminSideSelectedSlice";
import { closeSidebar } from "../../store/slices/sideBarSlice";
import { logout as logoutUser } from "../../services/authService";
import {
    ShopIcon,
    CustomersListIcon,
    Dashboard,
    DeliveryTruck,
    ProductsIcon,
    Coupen,
    ManageCatogeryIcon,
    OrdersIcon
} from '../../icons/icons';

const Sidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const selectedSection = useSelector((state) => state.adminSideSelected.activeSelection);
    const { isOpen } = useSelector((state) => state.sidebar);

    // Close sidebar on screen resize (if window becomes larger than mobile size)
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768 && isOpen) {
                dispatch(closeSidebar());
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [dispatch, isOpen]);

    // Close sidebar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && window.innerWidth < 768) {
                const sidebar = document.getElementById('sidebar');
                if (sidebar && !sidebar.contains(event.target)) {
                    // Check if the click is not on the hamburger menu button
                    const hamburgerBtn = document.getElementById('hamburger-btn');
                    if (!hamburgerBtn || !hamburgerBtn.contains(event.target)) {
                        dispatch(closeSidebar());
                    }
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [dispatch, isOpen]);

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <Dashboard className="w-5 h-5" />, path: '/admin/dashboard' },
        { id: 'orders', label: 'Orders', icon: <OrdersIcon className="w-5 h-5" />, path: '/admin/orders' },
        { id: 'sellers', label: 'Sellers', icon: <ShopIcon className="w-5 h-5" />, path: '/admin/sellers' },
        { id: 'customers', label: 'Customers', icon: <CustomersListIcon className="w-5 h-5" />, path: '/admin/customers' },
        { id: 'delivery', label: 'Delivery Agent', icon: <DeliveryTruck className="w-5 h-5" />, path: '/admin/delivery' },
        { id: 'manageProducts', label: 'Manage Products', icon: <ProductsIcon className="w-5 h-5" />, path: '/admin/manage-products' },
        { id: 'editCoupon', label: 'Coupons', icon: <Coupen className="w-5 h-5" />, path: '/admin/coupons' },
        { id: 'manageCategory', label: 'Manage Category', icon: <ManageCatogeryIcon className="w-5 h-5" />, path: '/admin/manage-Category' },
        { id: 'offers', label: 'Manage Offers', icon: <ManageCatogeryIcon className="w-5 h-5" />, path: '/admin/manage-offers' },
        { id: 'salesReport', label: 'Sales Report', icon: <ManageCatogeryIcon className="w-5 h-5" />, path: '/admin/sales-report' },
        { id: 'walletManagement', label: 'Wallet Management', icon: <ManageCatogeryIcon className="w-5 h-5" />, path: '/admin/wallet-management' },
    ];

    const handleLogout = async () => {
        try {
            await logoutUser();
            dispatch(logout());
            navigate('/');
        } catch (error) {
            console.log('Logout failed');
        }
    };

    const handleMenuClick = (id, path) => {
        if (id === 'delivery') {
            return toast.error('Currently not available');
        }
        dispatch(setActiveSelection(id));
        navigate(path);
        if (window.innerWidth < 768) {
            dispatch(closeSidebar());
        }
    };

    // Add overlay for mobile
    const Overlay = isOpen && window.innerWidth < 768 ? (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => dispatch(closeSidebar())}
        />
    ) : null;

    return (
        <>
            {Overlay}
            <aside
                id="sidebar"
                className={`fixed inset-y-0 left-0 w-72 bg-white shadow-lg border-r border-gray-100 transition-transform duration-300 md:sticky md:top-0 md:h-screen md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } z-40`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo/Header */}
                    <div className="h-16 flex items-center px-6 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 tracking-wide">ADMIN PANEL</h2>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-4 px-3">
                        <div className="space-y-1">
                            {menuItems.map((item) => (
                                <div
                                    key={item.id}
                                    className={`flex items-center cursor-pointer rounded-lg transition-all duration-200 ${selectedSection === item.id ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    onClick={() => handleMenuClick(item.id, item.path)}
                                >
                                    <div className="flex items-center w-full px-4 py-3">
                                        <div className={`${selectedSection === item.id ? 'text-white' : 'text-gray-500'}`}>
                                            {item.icon}
                                        </div>
                                        <span className="ml-3 font-medium text-sm">{item.label}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </nav>

                    {/* Logout */}
                    <div className="p-4 border-t border-gray-100">
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                            </svg>
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

// Removed PropTypes as they're no longer needed with Redux

export default Sidebar;
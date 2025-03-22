
// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// import Sellers from './dashboard/Sellers';
// import Customers from './dashboard/Customers';
// import CustomerDetails from './forCustomers/CustomerRightSection';
// import Orders from './forOrders/Orders'; // Import the new Orders component

// import { logout } from '../../store/slices/userSlice';
// import { useSelector, useDispatch } from 'react-redux';
// import { setActiveSelection } from "../../store/slices/adminSideSelectedSlice";
// import {
//     ShopIcon,
//     CustomersListIcon,
//     Dashboard,
//     DeliveryTruck,
//     ProductsIcon,
//     Coupen,
//     ManageCatogeryIcon,
//     OrdersIcon // You'll need to create this icon
// } from '../../icons/icons';

// const DashBoard = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const selectedSection = useSelector((state) => state.adminSideSelected.activeSelection);

//     const handleLogout = async () => {
//         try {
//             const response = await axios.post(
//                 "http://localhost:3333/user/logout",
//                 {},
//                 { withCredentials: true }
//             );

//             console.log(response.data);
//             dispatch(logout());
//             navigate("/");
//         } catch (error) {
//             console.log("logout fails");
//         }
//     };

//     return (
//         <div className="flex">
//             {/* Sidebar */}
//             <aside className="w-64 bg-white shadow-md p-4 sticky top-5 h-[800px]">
//                 <h2 className="text-xl font-bold mb-6">Admin</h2>
//                 <nav className="space-y-2">
//                     <div
//                         className={`flex w-full text-left p-2 rounded hover:bg-gray-200 ${selectedSection === 'dashboard' ? 'bg-black text-white hover:bg-gray-800' : ' hover:bg-gray-200'
//                             }`}
//                         onClick={() => {
//                             dispatch(setActiveSelection("dashboard"));
//                             navigate("/admin/sellers");
//                         }}
//                     >
//                         <Dashboard />
//                         <button className='ml-3'>
//                             Dashboard
//                         </button>
//                     </div>

//                     <div
//                         className={`flex w-full text-left p-2 rounded hover:bg-gray-200 ${selectedSection === 'orders' ? 'bg-black text-white hover:bg-gray-800' : ' hover:bg-gray-200'
//                             }`}
//                         onClick={() => {
//                             dispatch(setActiveSelection("orders"));
//                             navigate("/admin/orders");
//                         }}
//                     >
//                         <OrdersIcon />
//                         <button className='ml-3'>
//                             Orders
//                         </button>
//                     </div>

//                     <div
//                         className={`flex w-full text-left p-2 rounded hover:bg-gray-200 ${selectedSection === 'sellers' ? 'bg-black text-white hover:bg-gray-800' : ' hover:bg-gray-200'
//                             }`}
//                         onClick={() => {
//                             dispatch(setActiveSelection("sellers"));
//                             navigate("/admin/sellers");
//                         }}
//                     >
//                         <ShopIcon />
//                         <button className='ml-3'>
//                             Sellers
//                         </button>
//                     </div>

//                     <div
//                         className={`flex w-full text-left p-2 rounded hover:bg-gray-200 ${selectedSection === 'customers' ? 'bg-black text-white hover:bg-gray-800' : ' hover:bg-gray-200'
//                             }`}
//                         onClick={() => {
//                             dispatch(setActiveSelection("customers"));
//                             navigate("/admin/customers");
//                         }}
//                     >
//                         <CustomersListIcon />
//                         <button className='ml-3'>
//                             Customers
//                         </button>
//                     </div>

//                     <div
//                         className={`flex w-full text-left p-2 rounded hover:bg-gray-200 ${selectedSection === 'delivery' ? 'bg-black text-white hover:bg-gray-800' : ' hover:bg-gray-200'
//                             }`}
//                         onClick={() => {
//                             dispatch(setActiveSelection("delivery"));
//                             navigate("/admin/delivery");
//                         }}
//                     >
//                         <DeliveryTruck />
//                         <button className='ml-3'>
//                             Delivery Agent
//                         </button>
//                     </div>

//                     <div
//                         className={`flex w-full text-left p-2 rounded hover:bg-gray-200 ${selectedSection === 'manageProducts' ? 'bg-black text-white hover:bg-gray-800' : ' hover:bg-gray-200'
//                             }`}
//                         onClick={() => {
//                             dispatch(setActiveSelection("manageProducts"));
//                             navigate("/admin/manage-products");
//                         }}
//                     >
//                         <ProductsIcon />
//                         <button className='ml-3'>
//                             Manage Products
//                         </button>
//                     </div>

//                     <div
//                         className={`flex w-full text-left p-2 rounded hover:bg-gray-200 ${selectedSection === 'editCoupon' ? 'bg-black text-white hover:bg-gray-800' : ' hover:bg-gray-200'
//                             }`}
//                         onClick={() => {
//                             dispatch(setActiveSelection("editCoupon"));
//                             navigate("/admin/coupons");
//                         }}
//                     >
//                         <Coupen />
//                         <button className='ml-3'>
//                             Coupons
//                         </button>
//                     </div>

//                     <div
//                         className={`flex w-full text-left p-2 rounded hover:bg-gray-200 ${selectedSection === 'manageCategory' ? 'bg-black text-white hover:bg-gray-800' : ' hover:bg-gray-200'
//                             }`}
//                         onClick={() => {
//                             dispatch(setActiveSelection("manageCategory"));
//                             navigate("/admin/manage-Category");
//                         }}
//                     >
//                         <ManageCatogeryIcon />
//                         <button className='ml-3'>
//                             Manage Category
//                         </button>
//                     </div>

//                     <button
//                         className="w-full text-left p-2 rounded hover:bg-gray-200"
//                         onClick={() => handleLogout()}
//                     >
//                         Sign out
//                     </button>
//                 </nav>
//             </aside>
//         </div>
//     );
// };

// export default DashBoard;



import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/userSlice';
import { setActiveSelection } from "../../store/slices/adminSideSelectedSlice";
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

const DashBoard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const selectedSection = useSelector((state) => state.adminSideSelected.activeSelection);

    const handleLogout = async () => {
        try {
            const response = await axios.post(
                "http://localhost:3333/user/logout",
                {},
                { withCredentials: true }
            );

            console.log(response.data);
            dispatch(logout());
            navigate("/");
        } catch (error) {
            console.log("logout fails");
        }
    };

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <Dashboard className="w-5 h-5" />, path: "/admin/sellers" },
        { id: 'orders', label: 'Orders', icon: <OrdersIcon className="w-5 h-5" />, path: "/admin/orders" },
        { id: 'sellers', label: 'Sellers', icon: <ShopIcon className="w-5 h-5" />, path: "/admin/sellers" },
        { id: 'customers', label: 'Customers', icon: <CustomersListIcon className="w-5 h-5" />, path: "/admin/customers" },
        { id: 'delivery', label: 'Delivery Agent', icon: <DeliveryTruck className="w-5 h-5" />, path: "/admin/delivery" },
        { id: 'manageProducts', label: 'Manage Products', icon: <ProductsIcon className="w-5 h-5" />, path: "/admin/manage-products" },
        { id: 'editCoupon', label: 'Coupons', icon: <Coupen className="w-5 h-5" />, path: "/admin/coupons" },
        { id: 'manageCategory', label: 'Manage Category', icon: <ManageCatogeryIcon className="w-5 h-5" />, path: "/admin/manage-Category" },
    ];

    const handleMenuClick = (id, path) => {
        dispatch(setActiveSelection(id));
        navigate(path);
    };

    return (
        <div className="flex min-h-[100%] bg-gray-50">
            {/* Sidebar */}
            <aside className="w-72 bg-white shadow-lg border-r border-gray-100 transition-all duration-300">
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
                                    className={`flex items-center cursor-pointer rounded-lg transition-all duration-200 ${selectedSection === item.id
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
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
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Page content will be rendered here */}
                <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                    {/* Content will be displayed here based on selectedSection */}
                </div>
            </div>
        </div>
    );
};

export default DashBoard;
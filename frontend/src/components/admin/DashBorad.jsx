
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Sellers from './dashboard/Sellers';
import Customers from './dashboard/Customers';
import CustomerDetails from './forCustomers/CustomerRightSection';
import Orders from './forOrders/Orders'; // Import the new Orders component

import { logout } from '../../store/slices/userSlice';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveSelection } from "../../store/slices/adminSideSelectedSlice";
import {
    ShopIcon,
    CustomersListIcon,
    Dashboard,
    DeliveryTruck,
    ProductsIcon,
    Coupen,
    ManageCatogeryIcon,
    OrdersIcon // You'll need to create this icon
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

    return (
        <div className="flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md p-4 sticky top-5 h-[800px]">
                <h2 className="text-xl font-bold mb-6">Admin</h2>
                <nav className="space-y-2">
                    <div
                        className={`flex w-full text-left p-2 rounded hover:bg-gray-200 ${selectedSection === 'dashboard' ? 'bg-black text-white hover:bg-gray-800' : ' hover:bg-gray-200'
                            }`}
                        onClick={() => {
                            dispatch(setActiveSelection("dashboard"));
                            navigate("/admin/sellers");
                        }}
                    >
                        <Dashboard />
                        <button className='ml-3'>
                            Dashboard
                        </button>
                    </div>

                    <div
                        className={`flex w-full text-left p-2 rounded hover:bg-gray-200 ${selectedSection === 'orders' ? 'bg-black text-white hover:bg-gray-800' : ' hover:bg-gray-200'
                            }`}
                        onClick={() => {
                            dispatch(setActiveSelection("orders"));
                            navigate("/admin/orders");
                        }}
                    >
                        <OrdersIcon />
                        <button className='ml-3'>
                            Orders
                        </button>
                    </div>

                    <div
                        className={`flex w-full text-left p-2 rounded hover:bg-gray-200 ${selectedSection === 'sellers' ? 'bg-black text-white hover:bg-gray-800' : ' hover:bg-gray-200'
                            }`}
                        onClick={() => {
                            dispatch(setActiveSelection("sellers"));
                            navigate("/admin/sellers");
                        }}
                    >
                        <ShopIcon />
                        <button className='ml-3'>
                            Sellers
                        </button>
                    </div>

                    <div
                        className={`flex w-full text-left p-2 rounded hover:bg-gray-200 ${selectedSection === 'customers' ? 'bg-black text-white hover:bg-gray-800' : ' hover:bg-gray-200'
                            }`}
                        onClick={() => {
                            dispatch(setActiveSelection("customers"));
                            navigate("/admin/customers");
                        }}
                    >
                        <CustomersListIcon />
                        <button className='ml-3'>
                            Customers
                        </button>
                    </div>

                    <div
                        className={`flex w-full text-left p-2 rounded hover:bg-gray-200 ${selectedSection === 'delivery' ? 'bg-black text-white hover:bg-gray-800' : ' hover:bg-gray-200'
                            }`}
                        onClick={() => {
                            dispatch(setActiveSelection("delivery"));
                            navigate("/admin/delivery");
                        }}
                    >
                        <DeliveryTruck />
                        <button className='ml-3'>
                            Delivery Agent
                        </button>
                    </div>

                    <div
                        className={`flex w-full text-left p-2 rounded hover:bg-gray-200 ${selectedSection === 'manageProducts' ? 'bg-black text-white hover:bg-gray-800' : ' hover:bg-gray-200'
                            }`}
                        onClick={() => {
                            dispatch(setActiveSelection("manageProducts"));
                            navigate("/admin/manage-products");
                        }}
                    >
                        <ProductsIcon />
                        <button className='ml-3'>
                            Manage Products
                        </button>
                    </div>

                    <div
                        className={`flex w-full text-left p-2 rounded hover:bg-gray-200 ${selectedSection === 'editCoupon' ? 'bg-black text-white hover:bg-gray-800' : ' hover:bg-gray-200'
                            }`}
                        onClick={() => {
                            dispatch(setActiveSelection("editCoupon"));
                            navigate("/admin/coupons");
                        }}
                    >
                        <Coupen />
                        <button className='ml-3'>
                            Coupons
                        </button>
                    </div>

                    <div
                        className={`flex w-full text-left p-2 rounded hover:bg-gray-200 ${selectedSection === 'manageCategory' ? 'bg-black text-white hover:bg-gray-800' : ' hover:bg-gray-200'
                            }`}
                        onClick={() => {
                            dispatch(setActiveSelection("manageCategory"));
                            navigate("/admin/manage-Category");
                        }}
                    >
                        <ManageCatogeryIcon />
                        <button className='ml-3'>
                            Manage Category
                        </button>
                    </div>

                    <button
                        className="w-full text-left p-2 rounded hover:bg-gray-200"
                        onClick={() => handleLogout()}
                    >
                        Sign out
                    </button>
                </nav>
            </aside>
        </div>
    );
};

export default DashBoard;
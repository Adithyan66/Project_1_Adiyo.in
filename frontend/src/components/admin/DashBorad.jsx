import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


import Sellers from './dashboard/Sellers';
import Customers from './dashboard/Customers';
import CustomerDetails from './forCustomers/CustomerRightSection';


import { logout } from '../../store/slices/userSlice';

import { useSelector, useDispatch } from 'react-redux';

import { setActiveSelection } from "../../store/slices/adminSideSelectedSlice"


const DashBoard = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const selectedSection = useSelector((state) => state.adminSideSelected.activeSelection)


    const handleLogout = async () => {
        try {
            const response = await axios.post(
                "http://localhost:3333/user/logout",
                {},
                { withCredentials: true })

            console.log(response.data)

            dispatch(logout())

            navigate("/")

        } catch (error) {

            console.log("logout fails");

        }
    }


    return (
        <div className="flex  bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md p-4">
                <h2 className="text-xl font-bold mb-6">Admin</h2>
                <nav className="space-y-2">
                    <button
                        className={`w-full text-left p-2 rounded hover:bg-gray-200 ${selectedSection === 'dashboard' ? 'bg-gray-200' : ''
                            }`}
                    // onClick={() => setSelectedSection('dashboard')}
                    >
                        Dashboard
                    </button>
                    <button
                        className={`w-full text-left p-2 rounded hover:bg-gray-200 ${selectedSection === 'sellers' ? 'bg-gray-200' : ''
                            }`}
                        onClick={() => {
                            dispatch(setActiveSelection("sellers"))
                            navigate("/admin/sellers")
                        }}
                    >
                        Sellers
                    </button>
                    <button
                        className={`w-full text-left p-2 rounded hover:bg-gray-200 ${selectedSection === 'customers' ? 'bg-gray-200' : ''
                            }`}
                        onClick={() => {
                            dispatch(setActiveSelection("customers"))
                            navigate("/admin/customers")
                        }}
                    >
                        Customers
                    </button>
                    <button
                        className={`w-full text-left p-2 rounded hover:bg-gray-200 ${selectedSection === 'delivery' ? 'bg-gray-200' : ''
                            }`}
                    // onClick={() => setSelectedSection('delivery')}
                    >
                        Delivery Agent
                    </button>
                    <button
                        className={`w-full text-left p-2 rounded hover:bg-gray-200 ${selectedSection === 'manageProducts' ? 'bg-gray-200' : ''
                            }`}
                    //onClick={() => setSelectedSection('manageProducts')}
                    >
                        Manage Products
                    </button>
                    <button
                        className={`w-full text-left p-2 rounded hover:bg-gray-200 ${selectedSection === 'editCoupon' ? 'bg-gray-200' : ''
                            }`}
                    //  onClick={() => setSelectedSection('editCoupon')}
                    >
                        Edit Coupon
                    </button>
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
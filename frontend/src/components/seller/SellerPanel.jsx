import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { logout } from "../../store/slices/userSlice"
import { setActiveSelection } from '../../store/slices/sellerSideSelectedSlice';

import { Logout, OrdersIcon, ProductsIcon, ReturnIcon, SalesReportIcon, SignOutIcon } from '../../icons/icons';
import AddProduct from './products/AddProduct';
import EditProduct from './products/EditProduct';
import { Dashboard } from '../../icons/icons';
import Products from './products/Products';
import { logout as logoutService } from '../../services/authService';



const SellerPanel = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const leftSection = useSelector((state) => state.sellerSideSelected.activeSelection)

    const handleLogout = async () => {
        try {
            // const response = await axios.post(
            //     "http://localhost:3333/user/logout",
            //     {},
            //     { withCredentials: true })
            logoutService()

            dispatch(logout())

            navigate("/")

        } catch (error) {

            console.log("logout fails");

        }
    }


    const [selectedSection, setSelectedSection] = useState('dashboard');


    const renderContent = () => {
        switch (selectedSection) {
            // case 'dashboard':
            // // return <Dashboard />;
            case 'products':
                return <Products setSelectedSection={setSelectedSection} />;
            case "addProduct":
                return <AddProduct setSelectedSection={setSelectedSection} />;
            case "editProduct":
                return <EditProduct setSelectedSection={setSelectedSection} />
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="flex ">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md p-5 sticky top-5 h-[800px]">
                <h2 className="text-xl font-bold mb-6">Seller</h2>
                <nav className="space-y-2">

                    <div className={` flex w-full text-left p-2 rounded hover:bg-gray-200 ${leftSection === 'dashboard' ? 'bg-black text-white hover:bg-gray-800' : ' hover:bg-gray-200'}`}
                        onClick={() => {
                            dispatch(setActiveSelection("dashboard"))
                            setSelectedSection('dashboard')
                        }}>
                        <Dashboard />
                        <button
                            className='ml-3'
                        >
                            Dashboard
                        </button>
                    </div>

                    <div className={` flex w-full text-left p-2 rounded ${leftSection === 'products' ? 'bg-black  text-white  hover:bg-gray-800' : ' hover:bg-gray-200'}`}
                        onClick={() => {
                            dispatch(setActiveSelection("products"))
                            setSelectedSection('products')
                        }}>
                        <ProductsIcon />
                        <button
                            className='ml-3'
                        >
                            Products
                        </button>
                    </div>

                    <div className={`w-full flex text-left p-2 rounded hover:bg-gray-200 ${leftSection === 'orders' ? 'bg-black  text-white hover:bg-gray-800' : ' hover:bg-gray-200'}`}
                        onClick={() => {
                            dispatch(setActiveSelection("orders"))
                            setSelectedSection('orders')
                        }}>
                        <OrdersIcon />
                        <button
                            className='ml-3'
                        >
                            Orders
                        </button>
                    </div>

                    <div className={`w-full flex text-left p-2 rounded hover:bg-gray-200 ${leftSection === 'salesreport' ? 'bg-black  text-white hover:bg-gray-800' : ' hover:bg-gray-200'}`}
                        onClick={() => {
                            dispatch(setActiveSelection("salesreport"))
                            setSelectedSection('salesreport')
                        }}>
                        <SalesReportIcon />
                        <button
                            className='ml-3'
                        >
                            Sales report
                        </button>
                    </div>

                    <div className={`w-full flex text-left p-2 rounded hover:bg-gray-200 ${leftSection === 'refund/return' ? 'bg-black  text-white hover:bg-gray-800' : ' hover:bg-gray-200'}`}
                        onClick={() => {
                            dispatch(setActiveSelection("refund/return"))
                            setSelectedSection('refund/return')
                        }}>
                        <ReturnIcon />
                        <button
                            className='ml-3'
                        >
                            Refund/return
                        </button>
                    </div>

                    <div className={`w-full flex text-left p-2 rounded hover:bg-gray-200 ${leftSection === '' ? 'bg-black  text-white hover:bg-gray-800' : ' hover:bg-gray-200'}`}
                        onClick={() => handleLogout()}>
                        <SignOutIcon />
                        <button
                            className="w-full ml-3 text-left  rounded hover:bg-gray-200"

                        >
                            Sign out
                        </button>
                    </div>
                </nav>
            </aside>

            {/* Right-side content */}
            <main className="flex-1 p-6">
                {renderContent()}
            </main>
        </div>
    );
};

export default SellerPanel;

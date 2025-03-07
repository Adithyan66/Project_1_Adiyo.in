import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { logout } from "../../store/slices/userSlice"
import { setActiveSelection } from '../../store/slices/sellerSideSelectedSlice';

import Products from './products/Products';
import AddProduct from './products/AddProduct';
import EditProduct from './products/EditProduct';




const SellerPanel = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const leftSection = useSelector((state) => state.sellerSideSelected.activeSelection)

    const handleLogout = async () => {
        try {
            const response = await axios.post(
                "http://localhost:3333/user/logout",
                {},
                { withCredentials: true })

            dispatch(logout())

            navigate("/")

        } catch (error) {

            console.log("logout fails");

        }
    }


    const [selectedSection, setSelectedSection] = useState('dashboard');


    const renderContent = () => {
        switch (selectedSection) {
            case 'dashboard':
            // return <Dashboard />;
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
        <div className="flex  bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md p-5">
                <h2 className="text-xl font-bold mb-6">Seller</h2>
                <nav className="space-y-2">
                    <button
                        className={`w-full text-left p-2 rounded hover:bg-gray-200 ${leftSection === 'dashboard' ? 'bg-gray-200' : ''
                            }`}
                        onClick={() => {
                            dispatch(setActiveSelection("dashboard"))
                            setSelectedSection('dashboard')
                        }}
                    >
                        Dashboard
                    </button>
                    <button
                        className={`w-full text-left p-2 rounded hover:bg-gray-200 ${leftSection === 'products' ? 'bg-gray-200' : ''
                            }`}
                        onClick={() => {
                            dispatch(setActiveSelection("products"))
                            setSelectedSection('products')
                        }}                    >
                        Products
                    </button>
                    <button
                        className={`w-full text-left p-2 rounded hover:bg-gray-200 ${leftSection === 'orders' ? 'bg-gray-200' : ''
                            }`}
                        onClick={() => {
                            dispatch(setActiveSelection("orders"))
                            setSelectedSection('orders')
                        }}                    >
                        Orders
                    </button>
                    <button
                        className={`w-full text-left p-2 rounded hover:bg-gray-200 ${leftSection === 'salesreport' ? 'bg-gray-200' : ''
                            }`}
                        onClick={() => {
                            dispatch(setActiveSelection("salesreport"))
                            setSelectedSection('salesreport')
                        }}                    >
                        Sales report
                    </button>
                    <button
                        className={`w-full text-left p-2 rounded hover:bg-gray-200 ${leftSection === 'refund/return' ? 'bg-gray-200' : ''
                            }`}
                        onClick={() => {
                            dispatch(setActiveSelection("refund/return"))
                            setSelectedSection('refund/return')
                        }}                    >
                        Refund/return
                    </button>

                    <button
                        className="w-full text-left p-2 rounded hover:bg-gray-200"
                        onClick={() => handleLogout()}
                    >
                        Sign out
                    </button>
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

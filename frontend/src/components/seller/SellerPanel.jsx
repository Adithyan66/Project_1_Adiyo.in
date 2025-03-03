import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { logout } from "../../store/slices/userSlice"

import Products from './dashboard/Products';
import AddProduct from './dashboard/AddProduct';







const SellerPanel = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()


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
                return <Dashboard />;
            case 'products':
                return <Products setSelectedSection={setSelectedSection} />;
            case 'customers':
                return <Customers />;
            case 'delivery':
                return <DeliveryAgent />;
            case 'manageProducts':
                return <ManageProducts />;
            case 'editCoupon':
                return <EditCoupon />;
            case "CustomerDetails":
                return <CustomerDetails />;
            case "addProduct":
                return <AddProduct />;
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
                        className={`w-full text-left p-2 rounded hover:bg-gray-200 ${selectedSection === 'dashboard' ? 'bg-gray-200' : ''
                            }`}
                        onClick={() => setSelectedSection('dashboard')}
                    >
                        Dashboard
                    </button>
                    <button
                        className={`w-full text-left p-2 rounded hover:bg-gray-200 ${selectedSection === 'products' ? 'bg-gray-200' : ''
                            }`}
                        onClick={() => setSelectedSection('products')}
                    >
                        Products
                    </button>
                    <button
                        className={`w-full text-left p-2 rounded hover:bg-gray-200 ${selectedSection === 'customers' ? 'bg-gray-200' : ''
                            }`}
                        onClick={() => setSelectedSection('')}
                    >
                        Orders
                    </button>
                    <button
                        className={`w-full text-left p-2 rounded hover:bg-gray-200 ${selectedSection === 'delivery' ? 'bg-gray-200' : ''
                            }`}
                        onClick={() => setSelectedSection('delivery')}
                    >
                        Sales report
                    </button>
                    <button
                        className={`w-full text-left p-2 rounded hover:bg-gray-200 ${selectedSection === 'manageProducts' ? 'bg-gray-200' : ''
                            }`}
                        onClick={() => setSelectedSection('manageProducts')}
                    >
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

// Below are placeholder components for demonstration.
// Replace them with your actual components/content.
const Dashboard = () => (
    <div>
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <p>Dashboard content goes here.</p>
    </div>
);


const DeliveryAgent = () => (
    <div>
        <h2 className="text-2xl font-bold mb-4">Delivery Agent</h2>
        <p>Delivery agent content goes here.</p>
    </div>
);

const ManageProducts = () => (
    <div>
        <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
        <p>Manage products content goes here.</p>
    </div>
);

const EditCoupon = () => (
    <div>
        <h2 className="text-2xl font-bold mb-4">Edit Coupon</h2>
        <p>Edit coupon content goes here.</p>
    </div>
);

export default SellerPanel;

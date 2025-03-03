import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';


import Sellers from './dashboard/Sellers';
import Customers from './dashboard/Customers';
import CustomerDetails from './dashboard/CustomerDetails';


import { logout } from '../../store/slices/userSlice';








const AdminPanel = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [selectedSection, setSelectedSection] = useState('dashboard');

    const renderContent = () => {
        switch (selectedSection) {
            case 'dashboard':
                return <Dashboard />;
            case 'sellers':
                return <Sellers />;
            case 'customers':
                return <Customers setSelectedSection={setSelectedSection} />;
            case 'delivery':
                return <DeliveryAgent />;
            case 'manageProducts':
                return <ManageProducts />;
            case 'editCoupon':
                return <EditCoupon />;
            case "CustomerDetails":
                return <CustomerDetails />;
            default:
                return <Dashboard />;
        }
    };

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
                        onClick={() => setSelectedSection('dashboard')}
                    >
                        Dashboard
                    </button>
                    <button
                        className={`w-full text-left p-2 rounded hover:bg-gray-200 ${selectedSection === 'sellers' ? 'bg-gray-200' : ''
                            }`}
                        onClick={() => setSelectedSection('sellers')}
                    >
                        Sellers
                    </button>
                    <button
                        className={`w-full text-left p-2 rounded hover:bg-gray-200 ${selectedSection === 'customers' ? 'bg-gray-200' : ''
                            }`}
                        onClick={() => setSelectedSection('customers')}
                    >
                        Customers
                    </button>
                    <button
                        className={`w-full text-left p-2 rounded hover:bg-gray-200 ${selectedSection === 'delivery' ? 'bg-gray-200' : ''
                            }`}
                        onClick={() => setSelectedSection('delivery')}
                    >
                        Delivery Agent
                    </button>
                    <button
                        className={`w-full text-left p-2 rounded hover:bg-gray-200 ${selectedSection === 'manageProducts' ? 'bg-gray-200' : ''
                            }`}
                        onClick={() => setSelectedSection('manageProducts')}
                    >
                        Manage Products
                    </button>
                    <button
                        className={`w-full text-left p-2 rounded hover:bg-gray-200 ${selectedSection === 'editCoupon' ? 'bg-gray-200' : ''
                            }`}
                        onClick={() => setSelectedSection('editCoupon')}
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

export default AdminPanel;

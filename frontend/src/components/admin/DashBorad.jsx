import React, { useState } from 'react';

import Sellers from './dashboard/Sellers';








const AdminPanel = () => {
    // Track which section is selected
    const [selectedSection, setSelectedSection] = useState('dashboard');

    // Render content on the right side based on selected section
    const renderContent = () => {
        switch (selectedSection) {
            case 'dashboard':
                return <Dashboard />;
            case 'sellers':
                return <Sellers />;
            case 'customers':
                return <Customers />;
            case 'delivery':
                return <DeliveryAgent />;
            case 'manageProducts':
                return <ManageProducts />;
            case 'editCoupon':
                return <EditCoupon />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md p-4">
                <h2 className="text-xl font-bold mb-6">Adiyain</h2>
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
                        onClick={() => console.log('Sign out logic here')}
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


const Customers = () => (
    <div>
        <h2 className="text-2xl font-bold mb-4">Customers</h2>
        <p>Customers content goes here.</p>
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

// import React, { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';


// const API_BASE_URL = import.meta.env.VITE_API_URL;



// function CustomerDetails() {

//     const [customer, setCustomer] = useState()

//     const navigate = useNavigate()
//     const { id } = useParams()

//     useEffect(() => {

//         const fetchDetails = async () => {

//             const response = await axios.get(`${API_BASE_URL}/admin/${id}/customer-details`)

//             setCustomer(response.data)
//         }


//         fetchDetails()
//     }, [])

//     useEffect(() => {
//         console.log(customer)
//     }, [customer])

//     if (customer.length < 1) {
//         return ""
//     }

//     return (
//         <div className="flex  bg-gray-100">
//             {/* Sidebar */}
//             <aside className="w-64 bg-white shadow-md p-4">
//                 <h2 className="text-xl font-bold mb-6">Admin</h2>
//                 <nav className="space-y-2">
//                     <button
//                         className={`w-full text-left p-2 rounded hover:bg-gray-200 
//                             }`}
//                     >
//                         Dashboard
//                     </button>
//                     <button
//                         className={`w-full text-left p-2 rounded hover:bg-gray-200 
//                             }`}
//                     >
//                         Sellers
//                     </button>
//                     <button
//                         className={`w-full text-left p-2 rounded hover:bg-gray-200 bg-gray-200
//                             }`}
//                     >
//                         Customers
//                     </button>
//                     <button
//                         className={`w-full text-left p-2 rounded hover:bg-gray-200 
//                             }`}
//                     >
//                         Delivery Agent
//                     </button>
//                     <button
//                         className={`w-full text-left p-2 rounded hover:bg-gray-200 
//                             }`}
//                     >
//                         Manage Products
//                     </button>
//                     <button
//                         className={`w-full text-left p-2 rounded hover:bg-gray-200 
//                             }`}
//                     >
//                         Edit Coupon
//                     </button>
//                     <button
//                         className="w-full text-left p-2 rounded hover:bg-gray-200"
//                     >
//                         Sign out
//                     </button>
//                 </nav>
//             </aside>

//             {/* Right-side content */}
//             <main className="flex-1 p-6">
//             </main>
//         </div>
//     );
// }

// export default CustomerDetails








import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';


const API_BASE_URL = import.meta.env.VITE_API_URL;

import CustomerRightSection from "./CustomerRightSection"


function CustomerDetails() {


    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { id } = useParams(); // Destructure `id` from useParams

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/admin/${id}/customer-details`);
                setCustomer(response.data.customer); // Set the customer data
                setError(null); // Clear any previous errors
            } catch (err) {
                console.error("Error fetching customer details:", err);
                setError("Failed to fetch customer details. Please try again later.");
            } finally {
                setLoading(false); // Set loading to false after the request completes
            }
        };

        fetchDetails();

    }, [id]);

    if (loading) {
        return <div className="flex bg-gray-100 p-6">Loading...</div>;
    }

    if (error) {
        return <div className="flex bg-gray-100 p-6 text-red-500">{error}</div>;
    }

    if (!customer) {
        return <div className="flex bg-gray-100 p-6">No customer data found.</div>;
    }

    return (
        <div className="flex bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md p-4">
                <h2 className="text-xl font-bold mb-6">Admin</h2>
                <nav className="space-y-2">
                    <button
                        className="w-full text-left p-2 rounded hover:bg-gray-200"
                        onClick={() => navigate('/admin/dashboard')}
                    >
                        Dashboard
                    </button>
                    <button
                        className="w-full text-left p-2 rounded hover:bg-gray-200"
                        onClick={() => navigate('/admin/sellers')}
                    >
                        Sellers
                    </button>
                    <button
                        className="w-full text-left p-2 rounded hover:bg-gray-200 bg-gray-200"
                        onClick={() => navigate('/admin/customers')}
                    >
                        Customers
                    </button>
                    <button
                        className="w-full text-left p-2 rounded hover:bg-gray-200"
                        onClick={() => navigate('/admin/delivery-agents')}
                    >
                        Delivery Agent
                    </button>
                    <button
                        className="w-full text-left p-2 rounded hover:bg-gray-200"
                        onClick={() => navigate('/admin/manage-products')}
                    >
                        Manage Products
                    </button>
                    <button
                        className="w-full text-left p-2 rounded hover:bg-gray-200"
                        onClick={() => navigate('/admin/edit-coupon')}
                    >
                        Edit Coupon
                    </button>
                    <button
                        className="w-full text-left p-2 rounded hover:bg-gray-200"
                        onClick={() => navigate('/logout')}
                    >
                        Sign out
                    </button>
                </nav>
            </aside>

            {/* Right-side content */}

            <CustomerRightSection customer={customer} />

        </div>
    );
}

export default CustomerDetails;
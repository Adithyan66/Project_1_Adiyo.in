




import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';

const API_BASE_URL = import.meta.env.VITE_API_URL;

import CustomerRightSection from "./CustomerRightSection"
import { setActiveSelection } from "../../../store/slices/adminSideSelectedSlice"
import { Coupen, CustomersListIcon, Dashboard, DeliveryTruck, ProductsIcon, ShopIcon } from '../../../icons/icons';


function CustomerDetails() {


    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const selectedSection = useSelector((state) => state.adminSideSelected.activeSelection)

    useEffect(() => {

        const fetchDetails = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/admin/${id}/customer-details`);
                setCustomer(response.data.customer);
                setError(null);
            } catch (err) {
                console.error("Error fetching customer details:", err);
                setError("Failed to fetch customer details. Please try again later.");
            } finally {
                setLoading(false);
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

            <aside className="w-64 bg-white shadow-md p-4 sticky top-5 h-[800px]">
                <h2 className="text-xl font-bold mb-6">Admin</h2>
                <nav className="space-y-2">
                    <div className={` flex w-full text-left p-2 rounded hover:bg-gray-200 ${selectedSection === 'dashboard' ? 'bg-black text-white hover:bg-gray-800' : ' hover:bg-gray-200'}`}
                        onClick={() => {
                            dispatch(setActiveSelection("dashboard"))
                            navigate("/admin/sellers")
                        }}>
                        <Dashboard />
                        <button
                            className='ml-3'>
                            Dashboard
                        </button>
                    </div>
                    <div className={` flex w-full text-left p-2 rounded hover:bg-gray-200 ${selectedSection === 'sellers' ? 'bg-black text-white hover:bg-gray-800' : ' hover:bg-gray-200'}`}
                        onClick={() => {
                            dispatch(setActiveSelection("sellers"))
                            navigate("/admin/sellers")
                        }}>
                        <ShopIcon />
                        <button
                            className='ml-3'>
                            Sellers
                        </button>
                    </div>
                    <div className={` flex w-full text-left p-2 rounded hover:bg-gray-200 ${selectedSection === 'customers' ? 'bg-black text-white hover:bg-gray-800' : ' hover:bg-gray-200'}`}
                        onClick={() => {
                            dispatch(setActiveSelection("customers"))
                            navigate("/admin/customers")
                        }}>
                        <CustomersListIcon />
                        <button
                            className='ml-3'>
                            Customers
                        </button>
                    </div>
                    <div className={` flex w-full text-left p-2 rounded hover:bg-gray-200 ${selectedSection === 'delivery' ? 'bg-black text-white hover:bg-gray-800' : ' hover:bg-gray-200'}`}
                        onClick={() => {
                            dispatch(setActiveSelection("delivery"))
                            navigate("/admin/delivery")
                        }}>
                        <DeliveryTruck />
                        <button
                            className='ml-3'>
                            Delivery Agent
                        </button>
                    </div>
                    <div className={` flex w-full text-left p-2 rounded hover:bg-gray-200 ${selectedSection === 'manageProducts' ? 'bg-black text-white hover:bg-gray-800' : ' hover:bg-gray-200'}`}
                        onClick={() => {
                            dispatch(setActiveSelection("manageProducts"))
                            navigate("/admin/manage-products")
                        }}>
                        <ProductsIcon />
                        <button
                            className='ml-3'>
                            Manage Products
                        </button>
                    </div>
                    <div className={` flex w-full text-left p-2 rounded hover:bg-gray-200 ${selectedSection === 'editCoupon' ? 'bg-black text-white hover:bg-gray-800' : ' hover:bg-gray-200'}`}
                        onClick={() => {
                            dispatch(setActiveSelection("editCoupon"))
                            navigate("/admin/coupons")
                        }}>
                        <Coupen />
                        <button
                            className='ml-3'>
                            Coupons
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

            {/* Right-side content */}

            <CustomerRightSection customer={customer} />

        </div>
    );
}

export default CustomerDetails;
import React, { useEffect, useState } from 'react'
import NavbarTwo from '../../components/common/NavbarTwo'
import Footer from '../../components/common/Footer'
import CustomerRightSection from '../../components/admin/forCustomers/CustomerRightSection'
import DashBoard from '../../components/admin/DashBorad'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { getCustomerDetails } from '../../services/adminCustomerServiced'
const API_BASE_URL = import.meta.env.VITE_API_URL;


function CustomerMoreDetailPage() {


    const [customer, setCustomer] = useState(null);


    const { id } = useParams();

    useEffect(() => {

        const fetchDetails = async () => {
            try {
                // const response = await axios.get(`${API_BASE_URL}/admin/${id}/customer-details`);
                const response = await getCustomerDetails(id)
                setCustomer(response.data.customer);
            } catch (err) {
                console.error("Error fetching customer details:", err);
            }
        };

        fetchDetails();

    }, [id]);

    return (
        <div>
            <NavbarTwo />
            <div className="px-[10%] py-6 flex">
                <DashBoard />
                {customer && <CustomerRightSection customer={customer} />}
            </div>
            <Footer />
        </div>
    )
}

export default CustomerMoreDetailPage



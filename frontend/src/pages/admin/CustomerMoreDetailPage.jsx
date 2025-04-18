import React, { useEffect, useState } from 'react'
import NavbarTwo from '../../components/common/NavbarTwo'
import Footer from '../../components/common/Footer'
import { useParams } from 'react-router-dom'
import { getCustomerDetails } from '../../services/adminCustomerServiced'
import Sidebar from '../../components/admin/sidebar.jsx'
import CustomerDetails from '../../components/admin/dashboard/forCustomers/CustomerDetails.jsx'


function CustomerMoreDetailPage() {


    const [customer, setCustomer] = useState(null);


    const { id } = useParams();

    useEffect(() => {

        const fetchDetails = async () => {
            try {
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
            <div className="px-0 sm:px-[10%] py-0 sm:py-6 flex flex-col md:flex-row">
                <Sidebar />
                {customer && <CustomerDetails customer={customer} />}
            </div>
            <Footer />
        </div>
    )
}

export default CustomerMoreDetailPage



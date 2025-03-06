import React from 'react'
import NavbarTwo from '../../components/common/NavbarTwo'
import Dashboard from "../../components/admin/DashBorad"
import Footer from '../../components/common/Footer'
import CustomerDetails from '../../components/admin/forCustomers/CustomerDetails'

function CustomerMoreDetailPage() {
    return (
        <div>
            <NavbarTwo />
            <div className="px-[10%] py-6">
                <CustomerDetails />
            </div>
            <Footer />

        </div>
    )
}

export default CustomerMoreDetailPage

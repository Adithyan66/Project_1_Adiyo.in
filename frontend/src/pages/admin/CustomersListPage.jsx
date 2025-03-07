import React from 'react'
import Customers from '../../components/admin/dashboard/Customers'
import NavbarTwo from '../../components/common/NavbarTwo'
import Footer from '../../components/common/Footer'
import DashBoard from "../../components/admin/DashBorad"

function CustomersListPage() {


    return (
        <div>
            <NavbarTwo />
            <div className="px-[10%] py-6 flex">
                <DashBoard />
                <Customers />
            </div>
            <Footer />
        </div>
    )
}

export default CustomersListPage

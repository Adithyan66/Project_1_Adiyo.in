import React from 'react'
import Customers from '../../components/admin/forCustomers/Customers'
import NavbarTwo from '../../components/common/NavbarTwo'
import Footer from '../../components/common/Footer'
import Sidebar from '../../components/admin/sidebar'

function CustomersListPage() {


    return (
        <div>
            <NavbarTwo />
            <div className="px-[10%] py-6 flex">
                <Sidebar />
                <Customers />
            </div>
            <Footer />
        </div>
    )
}

export default CustomersListPage

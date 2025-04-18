import React from 'react'
import NavbarTwo from '../../components/common/NavbarTwo'
import Footer from '../../components/common/Footer'
import Orders from '../../components/admin/dashboard/forOrders/Orders'
import Sidebar from '../../components/admin/sidebar'

function ManageOrdersPage() {
    return (
        <div>
            <NavbarTwo />
            <div className="px-0 sm:px-[10%] py-0 sm:py-6 flex flex-col md:flex-row">
                <Sidebar />
                <Orders />
            </div>
            <Footer />
        </div>
    )
}

export default ManageOrdersPage

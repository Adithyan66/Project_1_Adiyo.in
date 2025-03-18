import React from 'react'
import NavbarTwo from '../../components/common/NavbarTwo'
import DashBoard from '../../components/admin/DashBorad'
import Footer from '../../components/common/Footer'
import Orders from '../../components/admin/forOrders/Orders'

function ManageOrdersPage() {
    return (
        <div>
            <NavbarTwo />
            <div className="px-[10%] py-6 flex">
                <DashBoard />
                <Orders />
            </div>
            <Footer />
        </div>
    )
}

export default ManageOrdersPage

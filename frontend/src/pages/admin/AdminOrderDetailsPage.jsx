import React from 'react'
import Footer from '../../components/common/Footer'
import Sidebar from '../../components/admin/sidebar'
import OrderDetails from '../../components/admin/dashboard/forOrders/OrderDetails'
import NavbarTwo from '../../components/common/NavbarTwo'

function OrderDetailsPage() {
    return (
        <div>
            <NavbarTwo />
            <div className="px-0 sm:px-[10%] py-0 sm:py-6 flex flex-col md:flex-row">
                <Sidebar />
                <OrderDetails />
            </div>
            <Footer />
        </div>
    )
}

export default OrderDetailsPage

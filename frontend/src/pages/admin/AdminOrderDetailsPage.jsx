import React from 'react'
import NavbarTwo from '../../components/common/NavbarTwo'
import DashBoard from '../../components/admin/DashBorad'
import Footer from '../../components/common/Footer'
import OrderDetails from '../../components/admin/forOrders/OrderDetails'

function OrderDetailsPage() {
    return (
        <div>
            <NavbarTwo />
            <div className="px-[10%] py-6 flex">
                <DashBoard />
                <OrderDetails />
            </div>
            <Footer />
        </div>
    )
}

export default OrderDetailsPage

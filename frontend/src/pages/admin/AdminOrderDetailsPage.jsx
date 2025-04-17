import React from 'react'
import Footer from '../../components/common/Footer'
import OrderDetails from '../../components/admin/forOrders/OrderDetails'
import Sidebar from '../../components/admin/sidebar'

function OrderDetailsPage() {
    return (
        <div>
            <Sidebar />
            <div className="px-[10%] py-6 flex">
                <Sidebar />
                <OrderDetails />
            </div>
            <Footer />
        </div>
    )
}

export default OrderDetailsPage

import React from 'react'
import Navbar from '../../components/common/Navbar'
import ProfileSideBar from '../../components/customer/profile/ProfileSideBar'
import Footer from '../../components/common/Footer'
import OrderDetails from '../../components/customer/OrderDetails'

function OrderDetailsPage() {
    return (
        <div>
            <Navbar />
            <div className="px-[10%] py-6 flex mt-35">
                <ProfileSideBar />
                <OrderDetails />
            </div>
            <Footer />
        </div>
    )
}

export default OrderDetailsPage

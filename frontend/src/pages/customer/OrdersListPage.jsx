import React from 'react'
import Navbar from '../../components/common/Navbar'
import ProfileSideBar from '../../components/customer/profile/ProfileSideBar'
import Footer from '../../components/common/Footer'
import Cart from '../../components/customer/profile/Cart'
import OrdersList from '../../components/customer/profile/OrdersList'


function OrdersListPage() {
    return (
        <div>
            <Navbar />
            <div className="px-[10%] py-6 flex mt-35">
                <ProfileSideBar />
                <OrdersList />
            </div>
            <Footer />
        </div>
    )
}

export default OrdersListPage

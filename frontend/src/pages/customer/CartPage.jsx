import React from 'react'
import Navbar from '../../components/common/Navbar'
import ProfileSideBar from '../../components/customer/profile/ProfileSideBar'
import Footer from '../../components/common/Footer'
import Cart from '../../components/customer/profile/Cart'


function ManageAddressesPage() {
    return (
        <div>
            <Navbar />
            <div className="md:px-[10%] md:py-6 py-2 flex flex-col md:flex-row mt-16 md:mt-35">
                <div className="md:w-1/4">
                    <ProfileSideBar />
                </div>
                <div className="w-full md:w-3/4 mt-14 md:mt-0">
                    <Cart />
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default ManageAddressesPage

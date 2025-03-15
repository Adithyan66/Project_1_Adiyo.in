import React from 'react'
import Navbar from '../../components/common/Navbar'
import ProfileSideBar from '../../components/customer/profile/ProfileSideBar'
import Footer from '../../components/common/Footer'
import ManageAddresses from '../../components/customer/profile/ManageAddresses'

function ManageAddressesPage() {
    return (
        <div>
            <Navbar />
            <div className="px-[10%] py-6 flex mt-35">
                <ProfileSideBar />
                <ManageAddresses />
            </div>
            <Footer />
        </div>
    )
}

export default ManageAddressesPage

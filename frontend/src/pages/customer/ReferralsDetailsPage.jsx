import React from 'react'
import Navbar from '../../components/common/Navbar'
import ProfileSideBar from '../../components/customer/profile/ProfileSideBar'
import ReferralDetails from '../../components/customer/profile/ReferralDetails'
import Footer from '../../components/common/Footer'

function ReferralsDetailsPage() {
    return (
        <div>
            <Navbar
            />
            <div className="px-[10%] py-6 flex mt-35">
                <ProfileSideBar />
                <ReferralDetails />
            </div>
            <Footer />
        </div>
    )
}

export default ReferralsDetailsPage

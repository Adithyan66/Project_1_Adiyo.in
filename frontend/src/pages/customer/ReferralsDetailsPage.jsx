import React from 'react'
import Navbar from '../../components/common/Navbar'
import ProfileSideBar from '../../components/customer/profile/ProfileSideBar'
import ReferralDetails from '../../components/customer/profile/ReferralDetails'
import Footer from '../../components/common/Footer'

function ReferralsDetailsPage() {
    return (
        <div>
            <Navbar />
            <div className="md:px-[10%] md:py-6 py-2 flex flex-col md:flex-row mt-16 md:mt-35">
                <div className="md:w-1/4">
                    <ProfileSideBar />
                </div>
                <div className="w-full md:w-3/4 mt-14 md:mt-0">
                    <ReferralDetails />
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default ReferralsDetailsPage

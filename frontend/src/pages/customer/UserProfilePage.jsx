import React from 'react'
import Navbar from "../../components/common/Navbar"
import Footer from "../../components/common/Footer"
import ProfileSideBar from '../../components/customer/profile/ProfileSideBar'
import PersonalInformation from '../../components/customer/profile/PersonalInformation'

function UserProfilePage() {
    return (
        <div>
            <Navbar />
            <div className="px-[10%] py-6 flex mt-35">
                <ProfileSideBar />
                <PersonalInformation />
            </div>
            <Footer />
        </div>
    )
}

export default UserProfilePage

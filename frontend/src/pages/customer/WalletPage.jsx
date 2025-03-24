import React from 'react'
import Navbar from '../../components/common/Navbar'
import ProfileSideBar from '../../components/customer/profile/ProfileSideBar'
import Wallet from '../../components/customer/profile/Wallet'
import Footer from '../../components/common/Footer'

function WalletPage() {
    return (
        <div>
            <Navbar />
            <div className="px-[10%] py-6 flex mt-35">
                <ProfileSideBar />
                <Wallet />
            </div>
            <Footer />
        </div>
    )
}

export default WalletPage

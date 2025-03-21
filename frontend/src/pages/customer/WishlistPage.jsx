import React from 'react'
import Navbar from '../../components/common/Navbar'
import ProfileSideBar from '../../components/customer/profile/ProfileSideBar'
import Footer from '../../components/common/Footer'
import Wishlist from '../../components/customer/profile/Wishlist'

function WishlistPage() {
    return (
        <div>
            <Navbar />
            <div className="px-[10%] py-6 flex ">
                <ProfileSideBar />
                <Wishlist />
            </div>
            <Footer />
        </div>
    )
}

export default WishlistPage

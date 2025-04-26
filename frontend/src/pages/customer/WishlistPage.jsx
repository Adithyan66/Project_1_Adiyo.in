import React from 'react'
import Navbar from '../../components/common/Navbar'
import ProfileSideBar from '../../components/customer/profile/ProfileSideBar'
import Footer from '../../components/common/Footer'
import Wishlist from '../../components/customer/profile/Wishlist'

function WishlistPage() {
    return (
        // <div>
        //     <Navbar />
        //     <div className="md:px-[10%] md:py-6 py-2 flex flex-col md:flex-row mt-16 md:mt-35">
        //         <div className="md:w-1/4">
        //             <ProfileSideBar />
        //         </div>
        //         <div className="w-full md:w-3/4 mt-14 md:mt-0">
        //             <Wishlist />
        //         </div>
        //     </div>
        //     <Footer />
        // </div>
        <div>
            <Navbar />
            <div className="px-4 md:px-6 lg:px-8 xl:px-[10%] py-2 lg:py-6 flex flex-col lg:flex-row mt-16 lg:mt-20">
                <div className="lg:w-1/4 xl:w-1/4">
                    <ProfileSideBar />
                </div>
                <div className="w-full lg:w-3/4 xl:w-3/4 mt-14 lg:mt-0 lg:pl-4 xl:pl-6">
                    <Wishlist />
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default WishlistPage

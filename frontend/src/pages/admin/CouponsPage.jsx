import React from 'react'
import NavbarTwo from '../../components/common/NavbarTwo'
import Footer from '../../components/common/Footer'
import Coupons from '../../components/admin/forCoupons/Coupons'
import Sidebar from '../../components/admin/sidebar'

function CouponsPage() {
    return (
        <div>
            <NavbarTwo />
            <div className="px-[10%] py-6 flex">
                <Sidebar />
                <Coupons />
            </div>
            <Footer />
        </div>
    )
}

export default CouponsPage

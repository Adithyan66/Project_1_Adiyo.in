import React from 'react'
import NavbarTwo from '../../components/common/NavbarTwo'
import DashBoard from '../../components/admin/DashBorad'
import Footer from '../../components/common/Footer'
import Products from '../../components/admin/forProducts/Products'
import Coupons from '../../components/admin/forCoupons/Coupons'

function CouponsPage() {
    return (
        <div>
            <NavbarTwo />
            <div className="px-[10%] py-6 flex">
                <DashBoard />
                <Coupons />
            </div>
            <Footer />
        </div>
    )
}

export default CouponsPage

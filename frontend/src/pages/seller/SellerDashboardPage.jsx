import React from 'react'

import NavbarTwo from '../../components/common/NavbarTwo'
import Footer from "../../components/common/Footer"
import SellerPanel from '../../components/seller/SellerPanel'

function SellerDashboardPage() {
    return (
        <>
            <NavbarTwo />
            <div className="px-[10%] py-6">
                <SellerPanel />
            </div>
            <Footer />
        </>
    )
}

export default SellerDashboardPage

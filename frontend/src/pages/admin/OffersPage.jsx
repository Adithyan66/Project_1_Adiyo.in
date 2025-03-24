import React from 'react'
import NavbarTwo from '../../components/common/NavbarTwo'
import DashBoard from '../../components/admin/DashBorad'
import Footer from '../../components/common/Footer'
import Offers from '../../components/admin/dashboard/Offers'

function OffersPage() {
    return (
        <div>
            <NavbarTwo />
            <div className="px-[10%] py-6 flex">
                <DashBoard />
                <Offers />
            </div>
            <Footer />
        </div>
    )
}

export default OffersPage

import React from 'react'
import NavbarTwo from '../../components/common/NavbarTwo'
import Footer from '../../components/common/Footer'
import Offers from '../../components/admin/dashboard/Offers'
import Sidebar from '../../components/admin/sidebar'

function OffersPage() {
    return (
        <div>
            <NavbarTwo />
            <div className="px-[10%] py-6 flex">
                <Sidebar />
                <Offers />
            </div>
            <Footer />
        </div>
    )
}

export default OffersPage

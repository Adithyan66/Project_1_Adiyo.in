import React from 'react'
import NavbarTwo from '../../components/common/NavbarTwo'
import Footer from '../../components/common/Footer'
import Sellers from '../../components/admin/dashboard/Sellers'
import Sidebar from '../../components/admin/sidebar'


function SellersListPage() {
    return (
        <div>
            <NavbarTwo />
            <div className="px-0 sm:px-[10%] py-0 sm:py-6 flex flex-col md:flex-row">
                <Sidebar />
                <Sellers />
            </div>
            <Footer />
        </div>
    )
}

export default SellersListPage

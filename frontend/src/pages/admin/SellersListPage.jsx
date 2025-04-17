import React from 'react'
import NavbarTwo from '../../components/common/NavbarTwo'
import Footer from '../../components/common/Footer'
import Sellers from '../../components/admin/dashboard/Sellers'
import Sidebar from '../../components/admin/sidebar'


function SellersListPage() {
    return (
        <div>
            <NavbarTwo />
            <div className="px-[10%] py-6 flex">
                <Sidebar />
                <Sellers />
            </div>
            <Footer />
        </div>
    )
}

export default SellersListPage

import React from 'react'
import Customers from '../../components/admin/dashboard/Customers'
import NavbarTwo from '../../components/common/NavbarTwo'
import Footer from '../../components/common/Footer'
import DashBoard from "../../components/admin/DashBorad"
import Sellers from '../../components/admin/dashboard/Sellers'


function SellersListPage() {
    return (
        <div>
            <NavbarTwo />
            <div className="px-[10%] py-6 flex">
                <DashBoard />
                <Sellers />
            </div>
            <Footer />
        </div>
    )
}

export default SellersListPage

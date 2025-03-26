import React from 'react'
import NavbarTwo from '../../components/common/NavbarTwo'
import DashBoard from '../../components/admin/DashBorad'
import Footer from '../../components/common/Footer'
import SalesDetails from '../../components/admin/forSalesReport/SalesDetails'

function SalesDetailsPage() {
    return (
        <div>
            <NavbarTwo />
            <div className="px-[10%] py-6 flex">
                <DashBoard />
                <SalesDetails />
            </div>
            <Footer />
        </div>
    )
}

export default SalesDetailsPage

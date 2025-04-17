import React from 'react'
import NavbarTwo from '../../components/common/NavbarTwo'
import Footer from '../../components/common/Footer'
import SalesDetails from '../../components/admin/forSalesReport/SalesDetails'
import Sidebar from '../../components/admin/sidebar'

function SalesDetailsPage() {
    return (
        <div>
            <NavbarTwo />
            <div className="px-[10%] py-6 flex">
                <Sidebar />
                <SalesDetails />
            </div>
            <Footer />
        </div>
    )
}

export default SalesDetailsPage

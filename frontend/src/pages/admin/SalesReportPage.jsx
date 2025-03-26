import React from 'react'
import NavbarTwo from '../../components/common/NavbarTwo'
import DashBoard from '../../components/admin/DashBorad'
import Footer from '../../components/common/Footer'
import SalesReport from '../../components/admin/dashboard/SalesReport'

function SalesReportPage() {
    return (
        <div>
            <NavbarTwo />
            <div className="px-[10%] py-6 flex">
                <DashBoard />
                <SalesReport />
            </div>
            <Footer />
        </div>
    )
}

export default SalesReportPage

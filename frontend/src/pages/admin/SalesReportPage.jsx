import React from 'react'
import NavbarTwo from '../../components/common/NavbarTwo'
import Footer from '../../components/common/Footer'
import SalesReport from '../../components/admin/dashboard/SalesReport'
import Sidebar from '../../components/admin/sidebar'

function SalesReportPage() {
    return (
        <div>
            <NavbarTwo />
            <div className="px-[10%] py-6 flex">
                <Sidebar />
                <SalesReport />
            </div>
            <Footer />
        </div>
    )
}

export default SalesReportPage

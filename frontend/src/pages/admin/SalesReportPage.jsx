

import React from 'react'
import NavbarTwo from '../../components/common/NavbarTwo'
import Footer from '../../components/common/Footer'
import Sidebar from '../../components/admin/sidebar'
import SalesReport from '../../components/admin/dashboard/forSalesReport/SalesReport'

function SalesReportPage() {
    return (
        <div>
            <NavbarTwo />
            <div className="px-0 sm:px-[10%] py-0 sm:py-6 flex flex-col md:flex-row">
                <Sidebar />
                <SalesReport />
            </div>
            <Footer />
        </div>
    )
}

export default SalesReportPage
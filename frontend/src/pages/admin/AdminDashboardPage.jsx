import React from 'react'
import Dashboard from "../../components/admin/DashBorad"
import NavbarTwo from '../../components/common/NavbarTwo'
import Footer from '../../components/common/Footer'

function AdminDashboardPage() {
    return (
        <>
            <NavbarTwo />
            <div className="px-[10%] py-6">
                <Dashboard />
            </div>
            <Footer />
        </>
    )
}

export default AdminDashboardPage


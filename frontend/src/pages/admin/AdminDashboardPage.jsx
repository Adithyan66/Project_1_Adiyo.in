import React from 'react'
import Dashboard from "../../components/admin/DashBorad"
import NavbarTwo from '../../components/common/NavbarTwo'
import Footer from '../../components/common/Footer'
import AdminDashboardChart from '../../components/admin/dashboard/forChart/AdminDashboardChart'

function AdminDashboardPage() {
    return (
        <>
            <NavbarTwo />
            <div className="px-[10%] py-6 flex">
                <Dashboard />
                <AdminDashboardChart />
            </div>
            <Footer />
        </>
    )
}

export default AdminDashboardPage


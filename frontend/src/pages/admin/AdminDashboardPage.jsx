import React from 'react'
import Sidebar from "../../components/admin/sidebar"
import NavbarTwo from '../../components/common/NavbarTwo'
import Footer from '../../components/common/Footer'
import AdminDashboard from '../../components/admin/dashboard/forChart/AdminDashboard'

function AdminDashboardPage() {
    return (
        <>
            <NavbarTwo />
            <div className="px-[10%] py-6 flex">
                <Sidebar />
                <AdminDashboard />
            </div>
            <Footer />
        </>
    )
}

export default AdminDashboardPage


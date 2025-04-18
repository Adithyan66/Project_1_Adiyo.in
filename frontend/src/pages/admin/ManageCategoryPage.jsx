import React from 'react'
import NavbarTwo from '../../components/common/NavbarTwo'
import Footer from '../../components/common/Footer'
import Sidebar from '../../components/admin/sidebar'
import CategoryManagement from '../../components/admin/dashboard/forCategory/CategoryManagement'

function ManageCategoryPage() {
    return (
        <>
            <NavbarTwo />
            <div className="px-0 sm:px-[10%] py-0 sm:py-6 flex flex-col md:flex-row">
                <Sidebar />
                <CategoryManagement />
            </div>
            <Footer />
        </>
    )
}

export default ManageCategoryPage

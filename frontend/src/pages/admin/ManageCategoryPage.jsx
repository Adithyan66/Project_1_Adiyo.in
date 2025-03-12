import React from 'react'
import NavbarTwo from '../../components/common/NavbarTwo'
import DashBoard from '../../components/admin/DashBorad'
import Footer from '../../components/common/Footer'
import CategoryManagement from '../../components/admin/forCategory/CategoryManagement'

function ManageCategoryPage() {
    return (
        <>
            <NavbarTwo />
            <div className="px-[10%] py-6 flex">
                <DashBoard />
                <CategoryManagement />
            </div>
            <Footer />
        </>
    )
}

export default ManageCategoryPage

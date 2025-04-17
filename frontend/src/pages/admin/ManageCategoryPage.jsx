import React from 'react'
import NavbarTwo from '../../components/common/NavbarTwo'
import Footer from '../../components/common/Footer'
import CategoryManagement from '../../components/admin/forCategory/CategoryManagement'
import { Sidebar } from 'lucide-react'

function ManageCategoryPage() {
    return (
        <>
            <NavbarTwo />
            <div className="px-[10%] py-6 flex">
                <Sidebar />
                <CategoryManagement />
            </div>
            <Footer />
        </>
    )
}

export default ManageCategoryPage

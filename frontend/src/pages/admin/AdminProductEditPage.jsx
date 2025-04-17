import React from 'react'
import NavbarTwo from '../../components/common/NavbarTwo'
import Footer from '../../components/common/Footer'
import EditProduct from '../../components/admin/forProducts/EditProduct'
import Sidebar from '../../components/admin/sidebar'

function AdminProductEditPage() {
    return (
        <div>
            <NavbarTwo />
            <div className="px-[10%] py-6 flex">
                <Sidebar />
                <EditProduct />
            </div>
            <Footer />
        </div>
    )
}

export default AdminProductEditPage

import React from 'react'
import NavbarTwo from '../../components/common/NavbarTwo'
import Footer from '../../components/common/Footer'
import EditProduct from '../../components/admin/forProducts/EditProduct'
import DashBoard from '../../components/admin/DashBorad'

function AdminProductEditPage() {
    return (
        <div>
            <NavbarTwo />
            <div className="px-[10%] py-6 flex">
                <DashBoard />
                <EditProduct />
            </div>
            <Footer />
        </div>
    )
}

export default AdminProductEditPage

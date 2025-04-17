import React from 'react'

import NavbarTwo from "../../components/common/NavbarTwo"
import Footer from "../../components/common/Footer"
import Products from "../../components/admin/forProducts/Products"
import Sidebar from '../../components/admin/sidebar'



function ManageProductsPage() {
    return (
        <div>
            <NavbarTwo />
            <div className="px-[10%] py-6 flex">
                <Sidebar />
                <Products />
            </div>
            <Footer />
        </div>
    )
}

export default ManageProductsPage

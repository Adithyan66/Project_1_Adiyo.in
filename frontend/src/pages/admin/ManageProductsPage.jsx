import React from 'react'

import NavbarTwo from "../../components/common/NavbarTwo"
import Footer from "../../components/common/Footer"
import DashBoard from '../../components/admin/DashBorad'
import Products from "../../components/admin/forProducts/Products"



function ManageProductsPage() {
    return (
        <div>
            <NavbarTwo />
            <div className="px-[10%] py-6 flex">
                <DashBoard />
                <Products />
            </div>
            <Footer />
        </div>
    )
}

export default ManageProductsPage

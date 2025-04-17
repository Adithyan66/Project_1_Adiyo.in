import React from 'react'
import NavbarTwo from '../../components/common/NavbarTwo'
import Footer from '../../components/common/Footer'
import Orders from '../../components/admin/forOrders/Orders'
import { Sidebar } from 'lucide-react'

function ManageOrdersPage() {
    return (
        <div>
            <NavbarTwo />
            <div className="px-[10%] py-6 flex">
                <Sidebar />
                <Orders />
            </div>
            <Footer />
        </div>
    )
}

export default ManageOrdersPage

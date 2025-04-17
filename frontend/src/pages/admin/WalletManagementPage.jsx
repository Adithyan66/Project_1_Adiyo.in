import React from 'react'
import Footer from '../../components/common/Footer'
import NavbarTwo from '../../components/common/NavbarTwo'
import WalletManagement from '../../components/admin/dashboard/forWalletManagement/WalletManagement'
import Sidebar from '../../components/admin/sidebar'

function WalletManagementPage() {
    return (
        <div>
            <NavbarTwo />
            <div className="px-[10%] py-6 flex">
                <Sidebar />
                <WalletManagement />
            </div>
            <Footer />
        </div>
    )
}

export default WalletManagementPage

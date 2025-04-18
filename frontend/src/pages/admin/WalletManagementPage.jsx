import React from 'react'
import Footer from '../../components/common/Footer'
import NavbarTwo from '../../components/common/NavbarTwo'
import WalletManagement from '../../components/admin/dashboard/forWalletManagement/WalletManagement'
import Sidebar from '../../components/admin/sidebar'

function WalletManagementPage() {
    return (
        <div>
            <NavbarTwo />
            <div className="px-0 sm:px-[10%] py-0 sm:py-6 flex flex-col md:flex-row">
                <Sidebar />
                <WalletManagement />
            </div>
            <Footer />
        </div>
    )
}

export default WalletManagementPage

import React from 'react'
import DashBoard from '../../components/admin/DashBorad'
import Footer from '../../components/common/Footer'
import NavbarTwo from '../../components/common/NavbarTwo'
import WalletManagement from '../../components/admin/dashboard/forWalletManagement/WalletManagement'

function WalletManagementPage() {
    return (
        <div>
            <NavbarTwo />
            <div className="px-[10%] py-6 flex">
                <DashBoard />
                <WalletManagement />
            </div>
            <Footer />
        </div>
    )
}

export default WalletManagementPage

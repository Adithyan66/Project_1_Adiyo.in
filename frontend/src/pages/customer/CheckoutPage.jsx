import React from 'react'
import Checkout from '../../components/customer/checkout/CheckOut'
import NavbarThree from '../../components/common/NavbarThree'
import Footer from '../../components/common/Footer'

function CheckoutPage() {
    return (
        <div>
            <NavbarThree />
            <div className="md:mt-42">
                <Checkout />
            </div>
            {/* <Footer /> */}
        </div>
    )
}

export default CheckoutPage
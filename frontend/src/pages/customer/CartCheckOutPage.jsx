import React from 'react'
import Checkout from '../../components/customer/checkout/CheckOut'
import NavbarThree from '../../components/common/NavbarThree'
import Footer from '../../components/common/Footer'
import CartCheckOut from '../../components/customer/cartCheckout/CartCheckOut'

function CheckoutPage() {
    return (
        <div>
            <NavbarThree />
            <div className="mt-42">
                <CartCheckOut />
            </div>
            <Footer />
        </div>
    )
}

export default CheckoutPage

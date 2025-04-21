import React from 'react'
import Checkout from '../../components/customer/checkout/CheckOut'
import NavbarThree from '../../components/common/NavbarThree'
import Footer from '../../components/common/Footer'
// import CartCheckOut from '../../components/customer/cartCheckout/CartCheckOut'
import OrderSummary from '../../components/customer/checkout/Summary';
import Payment from '../../components/customer/checkout/Payment';
import OrderConfirmation from '../../components/customer/checkout/OrderConfirmation';
import OrderSummarySidebar from '../../components/customer/checkout/OrderSummarySidebar';
import { setCartCurrentStep, setCartConfirmationData } from '../../store/slices/cartCheckoutSlice'

function CheckoutPage() {
    return (
        <div>
            <NavbarThree />
            <div className="mt-42">
                {/* <CartCheckOut /> */}
                <Checkout
                    checkoutState={state => state.cartCheckout}
                    setCurrentStep={setCartCurrentStep} // Use setCartCurrentStep for cart
                    setConfirmationData={setCartConfirmationData} // Use setCartConfirmationData for cart
                    // clearCart={clearCart}
                    isCartCheckout={true} // Set to true for cart checkout
                    OrderSummaryComponent={OrderSummary}
                    PaymentComponent={Payment}
                    OrderConfirmationComponent={OrderConfirmation}
                    OrderSummarySidebarComponent={OrderSummarySidebar}
                />
            </div>
            <Footer />
        </div>
    )
}

export default CheckoutPage

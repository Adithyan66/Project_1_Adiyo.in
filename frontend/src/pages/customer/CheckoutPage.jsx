import React from 'react'
// import Checkout from '../../components/customer/checkout/CheckOut'
import NavbarThree from '../../components/common/NavbarThree'
import Footer from '../../components/common/Footer'


// import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { CreditCard, ShoppingBag, Truck, CheckCircle } from 'lucide-react';
// import AddressSelection from '../../customer/profile/ManageAddresses';
import OrderSummary from '../../components/customer/checkout/Summary';
import Payment from '../../components/customer/checkout/Payment';
import OrderConfirmation from '../../components/customer/checkout/OrderConfirmation';
import OrderSummarySidebar from '../../components/customer/checkout/OrderSummarySidebar';
import { setCurrentStep, setConfirmationData } from '../../store/slices/checkoutSlice';
import Checkout from '../../components/customer/checkout/CheckOut';
// import { placeOrder } from '../../../services/checkoutService';



function CheckoutPage() {
    return (
        <div>
            <NavbarThree />
            <div className="md:mt-42">
                <Checkout
                    checkoutState={state => state.checkout}
                    setCurrentStep={setCurrentStep} // Use setCartCurrentStep for cart
                    setConfirmationData={setConfirmationData} // Use setCartConfirmationData for cart
                    // clearCart={clearCart}
                    isCartCheckout={false} // Set to true for cart checkout
                    OrderSummaryComponent={OrderSummary}
                    PaymentComponent={Payment}
                    OrderConfirmationComponent={OrderConfirmation}
                    OrderSummarySidebarComponent={OrderSummarySidebar}
                />
            </div>
            {/* <Footer /> */}
        </div>
    )
}

export default CheckoutPage
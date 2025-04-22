// Custom Hook: useCheckou

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCartItems } from "../../../services/cartService";
import { placeOrder } from "../../../services/checkoutService";


function useCheckout({
    checkoutState,
    setCurrentStep,
    setConfirmationData,
    clearCart,
    isCartCheckout = false,
    navigate,
    toast
}) {
    const { currentStep, address, order, payment, coupon } = useSelector(checkoutState);
    const dispatch = useDispatch();
    const [orderResponse, setOrderResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


    let data = useSelector((state) => state.cartCheckout.confirmationData)


    useEffect(() => {
        const isOrderEmpty = isCartCheckout
            ? (!order || (Array.isArray(order) && order.length === 0))
            : (!order || !order.productDetails);
        if (isOrderEmpty && currentStep !== 'confirmation') {
            toast.error("No products selected for checkout");
            navigate('/');
        }
        if (currentStep === 'confirmation' && !orderResponse) {
            dispatch(setCurrentStep('address'));
        }
    }, [order, currentStep, navigate, dispatch, toast, isCartCheckout, orderResponse]);

    const calculateOrderSummary = () => {
        if (!order) return null;
        const items = isCartCheckout
            ? order.map(item => ({
                productDetails: item.productDetails,
                productColor: item.productColor,
                productSize: item.productSize,
                quantity: item.quantity
            }))
            : [{
                productDetails: order.productDetails,
                productColor: order.productColor,
                productSize: order.productSize,
                quantity: order.quantity
            }];
        return {
            items,
            deliveryCharge: 0,
            estimatedDeliveryDays: "3-5",
            paymentMethod: payment?.selectedMethod || "COD"
        };
    };

    const handlePlaceOrder = async (paymentMethod, captchaValue, orderId) => {
        if (paymentMethod === 'cod' && captchaValue === '') {
            toast.error("Please complete the captcha verification");
            return Promise.reject(new Error("Captcha verification required"));
        }

        if (!address || !address[0]?._id) {
            toast.error("Please select a shipping address");
            return Promise.reject(new Error("Shipping address required"));
        }

        if (paymentMethod === 'paypal' && !orderId) {
            toast.error("PayPal payment not completed. Please try again.");
            return Promise.reject(new Error("PayPal order ID missing"));
        }

        if (paymentMethod === "razorpay" && !orderId) {
            toast.error("Razorpay payment not completed. Please try again.");
            return Promise.reject(new Error("Razorpay order ID missing"));
        }

        setIsLoading(true);

        try {
            let productDetails;
            if (isCartCheckout) {
                const cartItems = await getCartItems();
                productDetails = cartItems.data.items.map(item => ({
                    productId: item.product._id,
                    productColor: item.selectedColor,
                    productSize: item.selectedSize,
                    quantity: item.quantity
                }));
            } else {
                productDetails = [{
                    productId: order.productDetails._id,
                    productColor: order.productColor,
                    productSize: order.productSize,
                    quantity: order.quantity
                }];
            }

            const orderData = {
                addressId: address[0]._id,
                productDetails,
                paymentMethod,
                ...(paymentMethod === 'paypal' && { paypalOrderID: orderId }),
                ...(paymentMethod === 'razorpay' && {
                    razorpayOrderDetails: {
                        razorpay_order_id: orderId.razorpay_order_id,
                        razorpay_payment_id: orderId.razorpay_payment_id,
                        razorpay_signature: orderId.razorpay_signature
                    }
                }),
                couponCode: coupon
            };

            const response = await placeOrder(orderData);
            console.log("respooooooooo", response.data);
            setOrderResponse(response.data.order);

            if (response.data.success) {
                dispatch(setConfirmationData(response.data.order));
                if (isCartCheckout) {
                    // await mockClearUserCart();
                    // dispatch(clearCart());
                }
                toast.success("Order placed successfully!");
                dispatch(setCurrentStep('confirmation'));

            } else if (!response.data.success) {
                dispatch(setCurrentStep('failure'));
                return response.data;
            }

        } catch (error) {

            console.error("Error placing order:", error);
            toast.error(error.response?.data?.message || "Failed to place order. Please try again.");
            throw error;

        } finally {
            setIsLoading(false);
        }
    };

    return {
        currentStep,
        orderResponse,
        isLoading,
        calculateOrderSummary,
        handlePlaceOrder
    };
}

export default useCheckout
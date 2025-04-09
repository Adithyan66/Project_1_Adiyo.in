

import React, { useEffect, useState } from 'react';
import { X, Plus, Minus, ChevronRight, ShoppingBag, CreditCard, Truck, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;
import { useDispatch } from 'react-redux';
import { addProducts, setCartCurrentStep, clearCart } from '../../../store/slices/cartCheckoutSlice';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { deleteCartItem, getCartItems, updateQuantity as updateQuantityService } from '../../../services/cartService';
import paypal from "../../../assets/images/paypal.png"
import visa from "../../../assets/images/visa.png";
import mastercard from "../../../assets/images/mastercard.png";
import applepay from "../../../assets/images/applepay.png";
import gpay from "../../../assets/images/gpay.png";


const Cart = () => {


    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const calculateSubtotal = () => {
        return cartItems.reduce((sum, item) => {
            // Find the correct color object in the product
            const colorObj = item.product.colors.find(c => c.color === item.selectedColor);
            return sum + (colorObj ? colorObj.discountPrice * item.quantity : 0);
        }, 0);
    };

    const updateQuantity = async (itemId, change) => {

        try {
            const item = cartItems.find(item => item._id === itemId);
            const newQuantity = Math.max(1, item.quantity + change);
            console.log(change);

            if (item.quantity >= 3 && change > 0) {
                return toast.error("maximum quantity is 3 in cart")
            }
            // await axios.patch(`${API_BASE_URL}/user/cart-items/${itemId}`, {
            //     newQuantity
            // }, {
            //     withCredentials: true
            // });
            await updateQuantityService(itemId, newQuantity);

            fetchCartItems()

        } catch (error) {

            toast.error(error.response.data.message);
        }
    };

    const removeItem = async (itemId) => {
        try {
            // await axios.delete(`${API_BASE_URL}/user/cart-items/${itemId}`, {
            //     withCredentials: true
            // });

            await deleteCartItem(itemId);

            fetchCartItems()

        } catch (error) {

            console.error("Error removing item:", error);
        }
    };

    const fetchCartItems = async () => {
        setIsLoading(true);
        try {
            // const response = await axios.get(`${API_BASE_URL}/user/cart-items`, {
            //     withCredentials: true
            // });
            const response = await getCartItems();

            setCartItems(response.data.items || []);

        } catch (error) {
            console.error("Error fetching cart items:", error);
            setError("Failed to load cart items");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    // Get product image for selected color
    const getProductImage = (product, selectedColor) => {
        if (!product || !product.colors) return null;

        const colorObject = product.colors.find(c => c.color === selectedColor);
        return colorObject && colorObject.images && colorObject.images.length > 0
            ? colorObject.images[0]
            : null;
    };

    // Get product price for selected color
    const getProductPrice = (product, selectedColor) => {
        if (!product || !product.colors) return { basePrice: 0, discountPrice: 0 };

        const colorObject = product.colors.find(c => c.color === selectedColor);
        return colorObject
            ? {
                basePrice: colorObject.basePrice,
                discountPrice: colorObject.discountPrice,
                discountPercentage: colorObject.discountPercentage
            }
            : { basePrice: 0, discountPrice: 0 };
    };

    // Format variant name
    const formatVariantName = (variant) => {
        return variant.charAt(0).toUpperCase() + variant.slice(1);
    };

    const subtotal = calculateSubtotal();
    const shipping = subtotal < 499 ? 49 : 0;
    const discount = subtotal > 0 ? 0.00 : 0;
    const total = subtotal + shipping - discount;

    if (isLoading) {
        return (
            <div className="flex-1 p-6 bg-white m-6 rounded-md min-h-[800px] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your cart...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 p-6 bg-white m-6 rounded-md min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={fetchCartItems}
                        className="bg-black text-white px-4 py-2 rounded-lg"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-6 bg-white m-6 rounded-md min-h-[800px]">
            {/* Cart Header */}
            <div className="bg-gray-50 p-6  rounded-t-md">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <ShoppingBag className="mr-3" size={24} />
                        <h2 className="text-2xl font-medium">Your Shopping Cart</h2>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="bg-black text-white px-3 py-1 rounded-full">
                            {cartItems.length} items
                        </span>
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center text-gray-600 hover:text-black"
                        >
                            <ArrowLeft size={18} className="mr-1" />
                            <span>Continue Shopping</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Cart Content - Split into two columns on laptop */}
            <div className="flex flex-col md:flex-row">
                {/* Cart Items */}
                <div className="flex-grow p-6 overflow-y-auto">
                    {cartItems.length > 0 ? (
                        <div>
                            {/* Table Header */}
                            <div className="hidden md:grid grid-cols-12 gap-4 border-b border-gray-200 pb-4 text-gray-500 font-medium">
                                <div className="col-span-6">Product</div>
                                <div className="col-span-2 text-center">Price</div>
                                <div className="col-span-2 text-center">Quantity</div>
                                <div className="col-span-2 text-right">Total</div>
                            </div>

                            {/* Cart Items */}
                            {cartItems.map(item => {
                                const productImage = getProductImage(item.product, item.selectedColor);
                                const { basePrice, discountPrice, discountPercentage } = getProductPrice(item.product, item.selectedColor);

                                return (
                                    <div key={item._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 py-6 border-b border-gray-200 items-center">
                                        {/* Product Image & Info */}
                                        <div className="col-span-1 md:col-span-6">
                                            <div className="flex flex-col md:flex-row">
                                                <div className="w-full md:w-30 h-40 mb-4 md:mb-0 md:mr-4">
                                                    {productImage ? (
                                                        <img
                                                            src={productImage}
                                                            alt={item.product.name}
                                                            className="w-full h-full object-cover rounded-md"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                                                            <span className="text-gray-400">No image</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col justify-between py-2">
                                                    <div>
                                                        <h3 className="font-medium text-lg">{item.product.name}</h3>
                                                        <div className="text-sm text-gray-500 mt-1">
                                                            {item.product.shortDescription}
                                                        </div>
                                                        <div className="text-sm text-gray-500 mt-1">
                                                            Size: {formatVariantName(item.selectedSize)} | Color: {item.selectedColor}
                                                        </div>
                                                        <div className="mt-2">
                                                            <span className="text-sm bg-gray-100 px-2 py-1 rounded">SKU: {item.product.sku}</span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => removeItem(item._id)}
                                                        className="flex items-center text-gray-500 hover:text-black text-sm mt-4"
                                                    >
                                                        <X size={14} className="mr-1" />
                                                        <span>Remove</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="col-span-1 md:col-span-2 text-left md:text-center mt-4 md:mt-0">
                                            <div className="md:hidden text-gray-500 mb-1">Price:</div>
                                            <div className="flex flex-col">
                                                <span className="text-gray-500 line-through text-sm">₹{basePrice.toFixed(2)}</span>
                                                <span className="font-medium">₹{discountPrice.toFixed(2)}</span>
                                                <span className="text-green-600 text-xs">-{discountPercentage.toFixed(0)}% off</span>
                                            </div>
                                        </div>

                                        {/* Quantity */}
                                        <div className="col-span-1 md:col-span-2 text-left md:text-center mt-4 md:mt-0">
                                            <div className="md:hidden text-gray-500 mb-1">Quantity:</div>
                                            <div className="flex items-center md:justify-center border rounded-md w-32">
                                                <button
                                                    onClick={() => updateQuantity(item._id, -1)}
                                                    className="px-3 py-2 hover:bg-gray-100"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="px-4 font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item._id, 1)}
                                                    className="px-3 py-2 hover:bg-gray-100"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Total */}
                                        <div className="col-span-1 md:col-span-2 text-left md:text-right mt-4 md:mt-0">
                                            <div className="md:hidden text-gray-500 mb-1">Total:</div>
                                            <div className="font-medium text-lg">
                                                ₹{(discountPrice * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <ShoppingBag size={64} className="mx-auto text-gray-300 mb-6" />
                            <p className="text-xl text-gray-500 mb-2">Your cart is empty</p>
                            <p className="text-gray-400 mb-6">Looks like you haven't added any items to your cart yet.</p>
                            <button
                                onClick={() => navigate('/user/wishlist')}
                                className="bg-black text-white px-8 py-3 rounded-lg text-md font-medium"
                            >
                                Check Wishlist
                            </button>
                        </div>
                    )}
                </div>

                {/* Order Summary */}
                {cartItems.length > 0 && (
                    <div className=" md:w-80 bg-gray-50 p-6  mt-6 md:mt-10 ml-6 rounded-md">
                        <h3 className="text-xl font-medium mb-6">Order Summary</h3>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Shipping</span>
                                <span>₹{shipping.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-green-600">
                                <span>Discount</span>
                                <span>-₹{discount.toFixed(2)}</span>
                            </div>
                            <div className="border-t pt-3 mt-3">
                                <div className="flex justify-between font-medium text-xl">
                                    <span>Total</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1 text-right">
                                    Including GST
                                </div>
                            </div>
                        </div>



                        {/* Shipping Estimate */}
                        <div className="bg-white border rounded-lg p-4 mb-6">
                            <div className="flex items-center mb-2">
                                <Truck size={16} className="mr-2 text-gray-600" />
                                <span className="text-sm font-medium">Estimated Delivery</span>
                            </div>
                            <div className="text-sm text-gray-500">
                                March 18 - March 20
                            </div>
                        </div>

                        {/* Checkout Button */}
                        <button
                            onClick={() => {
                                console.log(cartItems)
                                dispatch(setCartCurrentStep("address"))
                                dispatch(clearCart())
                                dispatch(addProducts(cartItems))
                                navigate("/user/cart-check-out")
                            }}
                            className="w-full bg-black text-white py-3 rounded-lg flex items-center justify-center mb-3"
                        >
                            <CreditCard size={16} className="mr-2" />
                            <span>Proceed to Checkout</span>
                        </button>

                        {/* Secure payment notice */}
                        <div className="text-xs text-center text-gray-500 flex items-center justify-center mt-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span>Secure checkout powered by Stripe</span>
                        </div>

                        {/* Payment methods */}
                        <div className="flex justify-center mt-4">
                            <img src={paypal} alt="Accepted payment methods" className="h-8" />
                            <img src={visa} alt="Accepted payment methods" className="h-8" />
                            <img src={mastercard} alt="Accepted payment methods" className="h-8" />
                            <img src={applepay} alt="Accepted payment methods" className="h-8" />
                            <img src={gpay} alt="Accepted payment methods" className="h-8" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
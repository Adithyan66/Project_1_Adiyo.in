


// import React, { useEffect, useState } from 'react';
// import { X, Plus, Minus, ChevronRight, ShoppingBag, CreditCard, Truck, ArrowLeft } from 'lucide-react';

// import { useDispatch } from 'react-redux';
// import { addProducts, setCartCurrentStep, clearCart } from '../../../store/slices/cartCheckoutSlice';
// import { useNavigate } from 'react-router';
// import { toast } from 'react-toastify';
// import { checkAvailable, deleteCartItem, getCartItems, updateQuantity as updateQuantityService } from '../../../services/cartService';
// import paypal from "../../../assets/images/paypal.png"
// import visa from "../../../assets/images/visa.png";
// import mastercard from "../../../assets/images/mastercard.png";
// import applepay from "../../../assets/images/applepay.png";
// import gpay from "../../../assets/images/gpay.png";
// import CartShimmer from '../shimmerUI/CartShimmer';

// const Cart = () => {
//     const [cartItems, setCartItems] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const dispatch = useDispatch()
//     const navigate = useNavigate()

//     const calculateSubtotal = () => {
//         return cartItems.reduce((sum, item) => {
//             const colorObj = item.product.colors.find(c => c.color === item.selectedColor);
//             return sum + (colorObj ? colorObj.discountPrice * item.quantity : 0);
//         }, 0);
//     };

//     const updateQuantity = async (itemId, change) => {
//         try {
//             const item = cartItems.find(item => item._id === itemId);
//             const newQuantity = Math.max(1, item.quantity + change);
//             console.log(change);

//             if (item.quantity >= 3 && change > 0) {
//                 return toast.error("maximum quantity is 3 in cart")
//             }

//             await updateQuantityService(itemId, newQuantity);

//             fetchCartItems()

//         } catch (error) {
//             toast.error(error.response.data.message);
//         }
//     };

//     const removeItem = async (itemId) => {
//         try {
//             await deleteCartItem(itemId);
//             fetchCartItems()
//         } catch (error) {
//             console.error("Error removing item:", error);
//         }
//     };

//     const fetchCartItems = async () => {
//         setIsLoading(true);
//         try {
//             const response = await getCartItems();
//             setCartItems(response.data.items || []);
//         } catch (error) {
//             console.error("Error fetching cart items:", error);
//             setError("Failed to load cart items");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchCartItems();
//     }, []);

//     const handleCheckOutCart = async () => {

//         const products = cartItems.map((product) => {
//             return {
//                 productId: product.product._id,
//                 selectedColor: product.selectedColor,
//                 selectedSize: product.selectedSize,
//                 quantity: product.quantity
//             }
//         })

//         const response = await checkAvailable(products)

//         if (response.data.success) {
//             dispatch(setCartCurrentStep("address"))
//             dispatch(clearCart())
//             dispatch(addProducts(cartItems))
//             navigate("/user/cart-check-out")
//         } else {
//             response.data.availability.map((product) => toast.error(`${product.productName} ${product.stock === 0 ? `out of stock` : `${product.stock} only available`}`))
//         }
//     }

//     const getProductImage = (product, selectedColor) => {
//         if (!product || !product.colors) return null;

//         const colorObject = product.colors.find(c => c.color === selectedColor);
//         return colorObject && colorObject.images && colorObject.images.length > 0
//             ? colorObject.images[0]
//             : null;
//     };

//     const getProductPrice = (product, selectedColor) => {
//         if (!product || !product.colors) return { basePrice: 0, discountPrice: 0 };

//         const colorObject = product.colors.find(c => c.color === selectedColor);
//         return colorObject
//             ? {
//                 basePrice: colorObject.basePrice,
//                 discountPrice: colorObject.discountPrice,
//                 discountPercentage: colorObject.discountPercentage
//             }
//             : { basePrice: 0, discountPrice: 0 };
//     };

//     // Format variant name
//     const formatVariantName = (variant) => {
//         return variant.charAt(0).toUpperCase() + variant.slice(1);
//     };

//     const subtotal = calculateSubtotal();
//     const shipping = subtotal < 499 ? 49 : 0;
//     const discount = subtotal > 0 ? 0.00 : 0;
//     const total = subtotal + shipping - discount;

//     if (isLoading) {
//         return <CartShimmer />
//     }

//     if (error) {
//         return (
//             <div className="flex-1 p-4 sm:p-6 bg-white m-2 sm:m-6 rounded-md min-h-[400px] flex items-center justify-center">
//                 <div className="text-center">
//                     <p className="text-red-500 mb-4">{error}</p>
//                     <button
//                         onClick={fetchCartItems}
//                         className="bg-black text-white px-4 py-2 rounded-lg"
//                     >
//                         Try Again
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="flex-1 p-3 sm:p-6 bg-white m-2 sm:m-6 rounded-md min-h-[800px]">
//             {/* Cart Header */}
//             <div className="bg-gray-50 p-4 sm:p-6 rounded-t-md">
//                 <div className="flex items-center justify-between">
//                     <div className="flex items-center">
//                         <ShoppingBag className="mr-2 sm:mr-3" size={20} />
//                         <h2 className="text-xl sm:text-2xl font-medium">Your Shopping Cart</h2>
//                     </div>
//                     <div className="flex items-center">
//                         <span className="bg-black text-white px-2 sm:px-3 py-1 rounded-full text-sm">
//                             {cartItems.length} items
//                         </span>
//                     </div>
//                 </div>
//             </div>

//             {/* Cart Content - Split into two columns on laptop */}
//             <div className="flex flex-col md:flex-row">
//                 {/* Cart Items */}
//                 <div className="flex-grow p-3 sm:p-6 overflow-y-auto">
//                     {cartItems.length > 0 ? (
//                         <div>
//                             {/* Table Header */}
//                             <div className="hidden md:grid grid-cols-12 gap-4 border-b border-gray-200 pb-4 text-gray-500 font-medium">
//                                 <div className="col-span-6">Product</div>
//                                 <div className="col-span-2 text-center">Price</div>
//                                 <div className="col-span-2 text-center">Quantity</div>
//                                 <div className="col-span-2 text-right">Total</div>
//                             </div>

//                             {/* Cart Items */}
//                             {cartItems.map(item => {
//                                 const productImage = getProductImage(item.product, item.selectedColor);
//                                 const { basePrice, discountPrice, discountPercentage } = getProductPrice(item.product, item.selectedColor);

//                                 return (
//                                     <div key={item._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 py-6 border-b border-gray-200 items-center">
//                                         {/* Product Image & Info - Mobile Layout */}
//                                         <div className="col-span-1 md:col-span-6">
//                                             <div className="flex flex-row md:flex-row">
//                                                 {/* Image takes full height on mobile */}
//                                                 <div className="w-1/3 sm:w-30 h-auto min-h-[120px] mb-0 md:mb-0 md:mr-4">
//                                                     {productImage ? (
//                                                         <img
//                                                             src={productImage}
//                                                             alt={item.product.name}
//                                                             className="w-full h-full object-cover rounded-md"
//                                                         />
//                                                     ) : (
//                                                         <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
//                                                             <span className="text-gray-400">No image</span>
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                                 {/* All details to the right on mobile */}
//                                                 <div className="flex flex-col justify-between py-2 pl-4 w-2/3">
//                                                     <div>
//                                                         <h3 className="font-medium text-base sm:text-lg">{item.product.name}</h3>
//                                                         <div className="text-xs sm:text-sm text-gray-500 mt-1">
//                                                             {item.product.shortDescription}
//                                                         </div>
//                                                         <div className="text-xs sm:text-sm text-gray-500 mt-1">
//                                                             Size: {formatVariantName(item.selectedSize)} | Color: {item.selectedColor}
//                                                         </div>
//                                                         <div className="mt-2">
//                                                             <span className="text-xs sm:text-sm bg-gray-100 px-2 py-1 rounded">SKU: {item.product.sku}</span>
//                                                         </div>
//                                                     </div>
//                                                     <button
//                                                         onClick={() => removeItem(item._id)}
//                                                         className="flex items-center text-gray-500 hover:text-black text-xs sm:text-sm mt-4"
//                                                     >
//                                                         <X size={14} className="mr-1" />
//                                                         <span>Remove</span>
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         {/* Price */}
//                                         <div className="col-span-1 md:col-span-2 text-left md:text-center mt-4 md:mt-0 flex flex-row items-center justify-between sm:justify-start sm:flex-col">
//                                             <div className="md:hidden text-xs sm:text-sm text-gray-500">Price:</div>
//                                             <div className="flex flex-row sm:flex-col items-end sm:items-center">
//                                                 <span className="text-gray-500 line-through text-xs sm:text-sm mr-2 sm:mr-0">₹{basePrice.toFixed(2)}</span>
//                                                 <span className="font-medium text-sm sm:text-base">₹{discountPrice.toFixed(2)}</span>
//                                                 <span className="text-green-600 text-xs ml-2 sm:ml-0">-{discountPercentage.toFixed(0)}% off</span>
//                                             </div>
//                                         </div>

//                                         {/* Quantity */}
//                                         <div className="col-span-1 md:col-span-2 text-left md:text-center mt-3 md:mt-0 flex flex-row items-center justify-between sm:justify-start sm:flex-col">
//                                             <div className="md:hidden text-xs sm:text-sm text-gray-500">Quantity:</div>
//                                             <div className="flex items-center md:justify-center border rounded-md w-24 sm:w-32">
//                                                 <button
//                                                     onClick={() => updateQuantity(item._id, -1)}
//                                                     className="px-2 sm:px-3 py-1 sm:py-2 hover:bg-gray-100"
//                                                 >
//                                                     <Minus size={14} />
//                                                 </button>
//                                                 <span className="px-2 sm:px-4 font-medium text-sm sm:text-base">{item.quantity}</span>
//                                                 <button
//                                                     onClick={() => updateQuantity(item._id, 1)}
//                                                     className="px-2 sm:px-3 py-1 sm:py-2 hover:bg-gray-100"
//                                                 >
//                                                     <Plus size={14} />
//                                                 </button>
//                                             </div>
//                                         </div>

//                                         {/* Total */}
//                                         <div className="col-span-1 md:col-span-2 text-left md:text-right mt-3 md:mt-0 flex flex-row items-center justify-between sm:justify-start sm:flex-col">
//                                             <div className="md:hidden text-xs sm:text-sm text-gray-500">Total:</div>
//                                             <div className="font-medium text-base sm:text-lg">
//                                                 ₹{(discountPrice * item.quantity).toFixed(2)}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     ) : (
//                         <div className="text-center py-10 sm:py-16">
//                             <ShoppingBag size={48} className="mx-auto text-gray-300 mb-6" />
//                             <p className="text-lg sm:text-xl text-gray-500 mb-2">Your cart is empty</p>
//                             <p className="text-gray-400 mb-6">Looks like you haven't added any items to your cart yet.</p>
//                             <button
//                                 onClick={() => navigate('/user/wishlist')}
//                                 className="bg-black text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium"
//                             >
//                                 Check Wishlist
//                             </button>
//                         </div>
//                     )}
//                 </div>

//                 {/* Order Summary */}
//                 {cartItems.length > 0 && (
//                     <div className="md:w-80 bg-gray-50 p-4 sm:p-6 mx-3 sm:mx-0 mt-4 md:mt-10 sm:ml-6 rounded-md">
//                         <h3 className="text-lg sm:text-xl font-medium mb-4 sm:mb-6">Order Summary</h3>

//                         <div className="space-y-3 mb-4 sm:mb-6">
//                             <div className="flex justify-between">
//                                 <span className="text-gray-600">Subtotal</span>
//                                 <span>₹{subtotal.toFixed(2)}</span>
//                             </div>
//                             <div className="flex justify-between">
//                                 <span className="text-gray-600">Shipping</span>
//                                 <span>₹{shipping.toFixed(2)}</span>
//                             </div>
//                             <div className="flex justify-between text-green-600">
//                                 <span>Discount</span>
//                                 <span>-₹{discount.toFixed(2)}</span>
//                             </div>
//                             <div className="border-t pt-3 mt-3">
//                                 <div className="flex justify-between font-medium text-lg sm:text-xl">
//                                     <span>Total</span>
//                                     <span>₹{total.toFixed(2)}</span>
//                                 </div>
//                                 <div className="text-xs text-gray-500 mt-1 text-right">
//                                     Including GST
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Shipping Estimate */}
//                         <div className="bg-white border rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
//                             <div className="flex items-center mb-2">
//                                 <Truck size={16} className="mr-2 text-gray-600" />
//                                 <span className="text-sm font-medium">Estimated Delivery</span>
//                             </div>
//                             <div className="text-xs sm:text-sm text-gray-500">
//                                 March 18 - March 20
//                             </div>
//                         </div>

//                         {/* Checkout Button */}
//                         <button
//                             onClick={() => {
//                                 handleCheckOutCart()
//                             }}
//                             className="w-full bg-black text-white py-2 sm:py-3 rounded-lg flex items-center justify-center mb-3 text-sm sm:text-base"
//                         >
//                             <CreditCard size={16} className="mr-2" />
//                             <span>Proceed to Checkout</span>
//                         </button>

//                         {/* Secure payment notice */}
//                         <div className="text-xs text-center text-gray-500 flex items-center justify-center mt-3">
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                             </svg>
//                             <span>Secure checkout powered by Stripe</span>
//                         </div>

//                         {/* Payment methods */}
//                         <div className="flex justify-center mt-4 space-x-1 sm:space-x-0">
//                             <img src={paypal} alt="Accepted payment methods" className="h-6 sm:h-8" />
//                             <img src={visa} alt="Accepted payment methods" className="h-6 sm:h-8" />
//                             <img src={mastercard} alt="Accepted payment methods" className="h-6 sm:h-8" />
//                             <img src={applepay} alt="Accepted payment methods" className="h-6 sm:h-8" />
//                             <img src={gpay} alt="Accepted payment methods" className="h-6 sm:h-8" />
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Cart;












import React, { useEffect, useState } from 'react';
import { X, Plus, Minus, ChevronRight, ShoppingBag, CreditCard, Truck, ArrowLeft } from 'lucide-react';

import { useDispatch } from 'react-redux';
import { addProducts, setCartCurrentStep, clearCart } from '../../../store/slices/cartCheckoutSlice';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { checkAvailable, deleteCartItem, getCartItems, updateQuantity as updateQuantityService } from '../../../services/cartService';
import paypal from "../../../assets/images/paypal.png"
import visa from "../../../assets/images/visa.png";
import mastercard from "../../../assets/images/mastercard.png";
import applepay from "../../../assets/images/applepay.png";
import gpay from "../../../assets/images/gpay.png";
import CartShimmer from '../shimmerUI/CartShimmer';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const calculateSubtotal = () => {
        return cartItems.reduce((sum, item) => {
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

            await updateQuantityService(itemId, newQuantity);

            fetchCartItems()

        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const removeItem = async (itemId) => {
        try {
            await deleteCartItem(itemId);
            fetchCartItems()
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    const fetchCartItems = async () => {
        setIsLoading(true);
        try {
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

    const handleCheckOutCart = async () => {

        const products = cartItems.map((product) => {
            return {
                productId: product.product._id,
                selectedColor: product.selectedColor,
                selectedSize: product.selectedSize,
                quantity: product.quantity
            }
        })

        const response = await checkAvailable(products)

        if (response.data.success) {
            dispatch(setCartCurrentStep("address"))
            dispatch(clearCart())
            dispatch(addProducts(cartItems))
            navigate("/user/cart-check-out")
        } else {
            response.data.availability.map((product) => toast.error(`${product.productName} ${product.stock === 0 ? `out of stock` : `${product.stock} only available`}`))
        }
    }

    const getProductImage = (product, selectedColor) => {
        if (!product || !product.colors) return null;

        const colorObject = product.colors.find(c => c.color === selectedColor);
        return colorObject && colorObject.images && colorObject.images.length > 0
            ? colorObject.images[0]
            : null;
    };

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
        return <CartShimmer />
    }

    if (error) {
        return (
            <div className="flex-1 p-4 sm:p-6 bg-white m-2 sm:m-6 rounded-md min-h-[400px] flex items-center justify-center">
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
        <div className="flex-1 p-3 sm:p-6 bg-white m-2 sm:m-6 rounded-md min-h-[800px]">
            {/* Cart Header */}
            <div className="bg-gray-50 p-4 sm:p-6 rounded-t-md">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <ShoppingBag className="mr-2 sm:mr-3" size={20} />
                        <h2 className="text-xl sm:text-2xl font-medium">Your Shopping Cart</h2>
                    </div>
                    <div className="flex items-center">
                        <span className="bg-black text-white px-2 sm:px-3 py-1 rounded-full text-sm">
                            {cartItems.length} items
                        </span>
                    </div>
                </div>
            </div>

            {/* Cart Content - Split into two columns on laptop */}
            <div className="flex flex-col md:flex-row">
                {/* Cart Items */}
                <div className="flex-grow p-3 sm:p-6 overflow-y-auto">
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
                                        {/* Product Image & Info - Mobile Layout */}
                                        <div className="col-span-1 md:col-span-6">
                                            <div className="flex flex-row md:flex-row">
                                                {/* Image takes full height on mobile */}
                                                <div className="w-1/3 sm:w-30 h-auto min-h-[120px] mb-0 md:mb-0 md:mr-4">
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
                                                {/* All details to the right on mobile */}
                                                <div className="flex flex-col justify-between py-2 pl-4 w-2/3">
                                                    <div>
                                                        <h3 className="font-medium text-base sm:text-lg">{item.product.name}</h3>
                                                        <div className="text-xs sm:text-sm text-gray-500 mt-1">
                                                            {item.product.shortDescription}
                                                        </div>
                                                        <div className="text-xs sm:text-sm text-gray-500 mt-1">
                                                            Size: {formatVariantName(item.selectedSize)} | Color: {item.selectedColor}
                                                        </div>
                                                        <div className="mt-2">
                                                            <span className="text-xs sm:text-sm bg-gray-100 px-2 py-1 rounded">SKU: {item.product.sku}</span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => removeItem(item._id)}
                                                        className="flex items-center text-gray-500 hover:text-black text-xs sm:text-sm mt-4"
                                                    >
                                                        <X size={14} className="mr-1" />
                                                        <span>Remove</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="col-span-1 md:col-span-2 text-left md:text-center mt-4 md:mt-0 flex flex-row items-center justify-between sm:justify-start sm:flex-col">
                                            <div className="md:hidden text-xs sm:text-sm text-gray-500">Price:</div>
                                            <div className="flex flex-row sm:flex-col items-end sm:items-center">
                                                <span className="text-gray-500 line-through text-xs sm:text-sm mr-2 sm:mr-0">₹{basePrice.toFixed(2)}</span>
                                                <span className="font-medium text-sm sm:text-base">₹{discountPrice.toFixed(2)}</span>
                                                <span className="text-green-600 text-xs ml-2 sm:ml-0">-{discountPercentage.toFixed(0)}% off</span>
                                            </div>
                                        </div>

                                        {/* Quantity */}
                                        <div className="col-span-1 md:col-span-2 text-left md:text-center mt-3 md:mt-0 flex flex-row items-center justify-between sm:justify-start sm:flex-col">
                                            <div className="md:hidden text-xs sm:text-sm text-gray-500">Quantity:</div>
                                            <div className="flex items-center md:justify-center border rounded-md w-24 sm:w-32">
                                                <button
                                                    onClick={() => updateQuantity(item._id, -1)}
                                                    className="px-2 sm:px-3 py-1 sm:py-2 hover:bg-gray-100"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="px-2 sm:px-4 font-medium text-sm sm:text-base">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item._id, 1)}
                                                    className="px-2 sm:px-3 py-1 sm:py-2 hover:bg-gray-100"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Total */}
                                        <div className="col-span-1 md:col-span-2 text-left md:text-right mt-3 md:mt-0 flex flex-row items-center justify-between sm:justify-start sm:flex-col">
                                            <div className="md:hidden text-xs sm:text-sm text-gray-500">Total:</div>
                                            <div className="font-medium text-base sm:text-lg">
                                                ₹{(discountPrice * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-10 sm:py-16">
                            <ShoppingBag size={48} className="mx-auto text-gray-300 mb-6" />
                            <p className="text-lg sm:text-xl text-gray-500 mb-2">Your cart is empty</p>
                            <p className="text-gray-400 mb-6">Looks like you haven't added any items to your cart yet.</p>
                            <button
                                onClick={() => navigate('/user/wishlist')}
                                className="bg-black text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium"
                            >
                                Check Wishlist
                            </button>
                        </div>
                    )}
                </div>

                {/* Order Summary - Fixed width on desktop */}
                {cartItems.length > 0 && (
                    <div className="md:w-80 lg:w-80 flex-shrink-0 bg-gray-50 p-4 sm:p-6 mx-3 sm:mx-0 mt-4 md:mt-10 sm:ml-6 rounded-md">
                        <h3 className="text-lg sm:text-xl font-medium mb-4 sm:mb-6">Order Summary</h3>

                        <div className="space-y-3 mb-4 sm:mb-6">
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
                                <div className="flex justify-between font-medium text-lg sm:text-xl">
                                    <span>Total</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1 text-right">
                                    Including GST
                                </div>
                            </div>
                        </div>

                        {/* Shipping Estimate */}
                        <div className="bg-white border rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                            <div className="flex items-center mb-2">
                                <Truck size={16} className="mr-2 text-gray-600" />
                                <span className="text-sm font-medium">Estimated Delivery</span>
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500">
                                March 18 - March 20
                            </div>
                        </div>

                        {/* Checkout Button */}
                        <button
                            onClick={() => {
                                handleCheckOutCart()
                            }}
                            className="w-full bg-black text-white py-2 sm:py-3 rounded-lg flex items-center justify-center mb-3 text-sm sm:text-base"
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
                        <div className="flex justify-center mt-4 space-x-1 sm:space-x-0">
                            <img src={paypal} alt="Accepted payment methods" className="h-6 sm:h-8" />
                            <img src={visa} alt="Accepted payment methods" className="h-6 sm:h-8" />
                            <img src={mastercard} alt="Accepted payment methods" className="h-6 sm:h-8" />
                            <img src={applepay} alt="Accepted payment methods" className="h-6 sm:h-8" />
                            <img src={gpay} alt="Accepted payment methods" className="h-6 sm:h-8" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;

import express from "express"
import multer from "multer"

const router = express.Router()

// import { authenticateUser } from "../middlewares/authenticateUser.js"
import { authenticateUser, authenticateAdmin } from "../middlewares/authentication.js"


import {
    profileDetails,
    updateProfile,
    changeEmail,
    changePassword,
}
    from "../controllers/userController.js"

import {

    verifyRazorpayPayment
}
    from "../middlewares/razopay.js"

import {
    getNewArrivals,
    getTopSellingProducts,
    productDetail,
    productList
}
    from "../controllers/userProductController.js"

import {
    forgotPassword,
    googleLogin,
    login,
    logout,
    profile,
    resetPassword,
    signUp,
    tokenRefresh
}
    from "../controllers/authController.js"

import {
    changeEmailOtp,
    signupOTP,
    validateOTP
}
    from "../controllers/otpController.js"

import {
    addReview,
    getReviews
}
    from "../controllers/reviewController.js"

import {
    deleteAddress,
    editAddress,
    getUserAddresses,
    makeDefaultAddress,
    saveAddress
}
    from "../controllers/addressController.js"

import {
    addCart,
    cartItems,
    checkAvailability,
    checkCart,
    deleteCart,
    removeCartItem,
    updateCartQuantity
}
    from "../controllers/cartController.js"

import {
    cancelOrder,
    createOrder,
    getOrderById,
    getUserOrders,
    returnRequest
}
    from "../controllers/userOrderController.js"

import {
    addWishlist,
    getWishlist,
    removeWishlistItem
} from
    "../controllers/wishlistController.js"

import {
    validateCoupon
}
    from "../controllers/couponController.js"

import {
    getWalletBalance,
    getWalletDetails,
    walletRecharge
}
    from "../controllers/walletController.js"

import {
    checkOffer
}
    from "../controllers/offerController.js"

import {
    referalDetails
}
    from "../controllers/referalController.js"

import { addMoneyRazopay } from "../controllers/payment.js"


const upload = multer({ dest: "uploads/" });



router.post("/signUp", signUp)
router.post("/login", login)
router.post("/forgot-password", forgotPassword)
router.post("/signup-send-otp", signupOTP)
router.post("/validate-otp", validateOTP)
router.post("/reset-password", resetPassword)
router.post("/google-login", googleLogin)
router.post("/logout", logout)
router.post("/:productId/addreviews", authenticateUser, addReview)
router.post("/:id/change-email/otp-request", changeEmailOtp)
router.post("/:id/change-emailid", changeEmail)
router.post("/update-profile", authenticateUser, upload.single('file'), updateProfile)
router.post("/save-address", authenticateUser, saveAddress)
router.post("/cart/add", authenticateUser, addCart)
router.post("/place-orders", authenticateUser, createOrder)
router.post("/orders/:orderId/return", authenticateUser, returnRequest)
router.post("/wishlist/add", authenticateUser, addWishlist)
router.post("/coupons/validate", validateCoupon)
router.post("/wallet-recharge", authenticateUser, verifyRazorpayPayment, walletRecharge)
router.post("/add-money-razopay", authenticateUser, addMoneyRazopay)
router.post("/check-cart-availablity", checkAvailability)


router.get("/refresh-token", tokenRefresh)
router.get("/profile", profile)
router.get("/product-list", productList)
router.get("/product/:id", productDetail)
router.get("/:productId/reviews", getReviews)
router.get("/user-details", authenticateUser, profileDetails)
router.get("/address", authenticateUser, getUserAddresses)
router.get("/cart-items", authenticateUser, cartItems)
router.get("/check-cart", authenticateUser, checkCart)
router.get("/orders", authenticateUser, getUserOrders)
router.get("/orders/:orderId", authenticateUser, getOrderById)
router.get("/new-arrivals", getNewArrivals)
router.get("/top-selling", getTopSellingProducts)
router.get("/wishlist", authenticateUser, getWishlist)
router.get("/wallet", authenticateUser, getWalletDetails)
router.get("/get-wallet-balance", authenticateUser, getWalletBalance)
router.get("/offers/product/:productId", checkOffer)
router.get("/referrals", authenticateUser, referalDetails)








router.put("/:id/change-password", changePassword)
router.put("/update-address", authenticateUser, editAddress)
router.put("/set-default-address/:addressId", authenticateUser, makeDefaultAddress)
router.put("/orders/:orderId/cancel", authenticateUser, cancelOrder)



router.patch("/cart-items/:itemId", authenticateUser, updateCartQuantity)



router.delete("/delete-address/:id", authenticateUser, deleteAddress)
router.delete("/cart", authenticateUser, deleteCart)
router.delete("/cart-items/:itemId", authenticateUser, removeCartItem)
router.delete("/wishlist/remove", authenticateUser, removeWishlistItem)













export default router
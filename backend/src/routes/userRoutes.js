
import express from "express"
import multer from "multer"

const router = express.Router()

import { authenticateUser } from "../middlewares/authenticateUser.js"

import {
    signUp,
    login,
    forgotPassword,
    resetPassword,
    validateOTP,
    googleLogin,
    productList,
    logout,
    profile,
    productDetail,
    addReview,
    getReviews,
    signupOTP,
    profileDetails,
    updateProfile,
    changeEmailOtp,
    changeEmail,
    changePassword,
    saveAddress,
    getUserAddresses,
    editAddress,
    deleteAddress,
    makeDefaultAddress,
    addCart,
    cartItems,
    removeCartItem,
    updateCartQuantity,
    checkCart,
    createOrder,
    getUserOrders,
    getOrderById
} from
    "../controllers/userController.js"


const upload = multer({ dest: "uploads/" });



router.post("/signUp", signUp)
router.post("/login", login)
router.post("/forgot-password", forgotPassword)
router.post("/signup-send-otp", signupOTP)
router.post("/validate-otp", validateOTP)
router.post("/reset-password", resetPassword)
router.post("/google-login", googleLogin)
router.post("/logout", logout)
router.post("/:productId/addreviews", addReview)
router.post("/:id/change-email/otp-request", changeEmailOtp)
router.post("/:id/change-emailid", changeEmail)
router.post("/update-profile", authenticateUser, upload.single('file'), updateProfile)
router.post("/save-address", authenticateUser, saveAddress)
router.post("/cart/add", authenticateUser, addCart)
router.post("/place-orders", authenticateUser, createOrder)



router.get("/profile", authenticateUser, profile)
router.get("/product-list", productList)
router.get("/product/:id", productDetail)
router.get("/:productId/reviews", getReviews)
router.get("/user-details", authenticateUser, profileDetails)
router.get("/address", authenticateUser, getUserAddresses)
router.get("/cart-items", authenticateUser, cartItems)
router.get("/check-cart", authenticateUser, checkCart)
router.get("/orders", authenticateUser, getUserOrders)
router.get("/orders/:orderId", getOrderById)



router.put("/:id/change-password", changePassword)
router.put("/update-address", authenticateUser, editAddress)
router.put("/set-default-address/:addressId", authenticateUser, makeDefaultAddress)




router.patch("/cart-items/:itemId", authenticateUser, updateCartQuantity)



router.delete("/delete-address/:id", authenticateUser, deleteAddress)
router.delete("/cart-items/:itemId", authenticateUser, removeCartItem)












export default router
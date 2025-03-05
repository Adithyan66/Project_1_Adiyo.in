
import express from "express"

const router = express.Router()


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
    getReviews
} from
    "../controllers/userController.js"


router.post("/signUp", signUp)
router.post("/login", login)
router.post("/forgot-password", forgotPassword)
router.post("/validate-otp", validateOTP)
router.post("/reset-password", resetPassword)
router.post("/google-login", googleLogin)
router.post("/logout", logout)
router.post("/:productId/addreviews", addReview)



router.get("/profile", profile)
router.get("/product-list", productList)
router.get("/product/:id", productDetail)
router.get("/:productId/reviews", getReviews)




export default router
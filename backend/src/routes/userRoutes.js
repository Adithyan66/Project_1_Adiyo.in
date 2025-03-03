
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
    profile
} from "../controllers/userController.js"


router.post("/signUp", signUp)
router.post("/login", login)
router.post("/forgot-password", forgotPassword)
router.post("/validate-otp", validateOTP)
router.post("/reset-password", resetPassword)
router.post("/google-login", googleLogin)
router.post("/logout", logout)
router.get("/profile", profile)

router.get("/product-list", productList)




export default router
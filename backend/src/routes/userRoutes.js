
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
    updateProfile
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



router.get("/profile", authenticateUser, profile)
router.get("/product-list", productList)
router.get("/product/:id", productDetail)
router.get("/:productId/reviews", getReviews)
router.get("/user-details", authenticateUser, profileDetails)

router.post("/update-profile", authenticateUser, upload.single('file'), updateProfile)


export default router

import express from "express"

const router = express.Router()


import { signUp, login, forgotPassword, resetPassword, validateOTP } from "../controllers/userController.js"



router.post("/signUp", signUp)
router.post("/login", login)
router.post("/forgot-password", forgotPassword)
router.post("/validate-otp", validateOTP)
router.post("/reset-password", resetPassword)




export default router
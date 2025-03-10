import express from "express";

const router = express.Router()

import {
    customersList,
    customerDetails,
    blockUser,
    deleteProduct,
    getProducts,
    productDetails,
    addCoupon,
    getCoupons,
    deleteCoupon
} from "../controllers/adminController.js"



router.get("/customers-list", customersList)
router.get("/:customerId/customer-details", customerDetails)
router.get("/products", getProducts)
router.get("/products/:id", productDetails)
router.get("/coupons", getCoupons)




router.post("/add-coupon", addCoupon)



router.patch("/block-user/:id", blockUser)


router.delete("/delete-product/:id", deleteProduct)
router.delete("/delete-coupon/:id", deleteCoupon)



export default router
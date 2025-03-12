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
    deleteCoupon,
    addCategory,
    addSubCategories,
    getCategories,
    editSubcategoryName,
    deleteCategories,
    deleteSubCategories
} from "../controllers/adminController.js"



router.get("/customers-list", customersList)
router.get("/:customerId/customer-details", customerDetails)
router.get("/products", getProducts)
router.get("/products/:id", productDetails)
router.get("/coupons", getCoupons)
router.get("/categories", getCategories)




router.post("/add-coupon", addCoupon)
router.post("/add-category", addCategory)
router.post("/:categoryId/add-subcategories", addSubCategories)



router.put("/categories/:categoryId/subcategories/:subcategoryId", editSubcategoryName)


router.patch("/block-user/:id", blockUser)


router.delete("/delete-product/:id", deleteProduct)
router.delete("/delete-coupon/:id", deleteCoupon)
router.delete("/delete-categories/:categoryId", deleteCategories)
router.delete("/categories/:categoryId/subcategories/:subcategoryId", deleteSubCategories)



export default router
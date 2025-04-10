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
    deleteSubCategories,
    getOrders,
    updateOrderStatus,
    getOrderDetails,
    verifyReturn,
    productNames,
    createProductOffer,
    getAllProductOffers,
    createCategoryOffer,
    getAllCategoryOffers,
    createReferalOffer,
    editReferalOffer,
    getReferalOffers,
    salesReport,
    updateCoupon,
    toggleReferalStatus,
    deleteReferealOffer,
    editProductOffer,
    deleteProductOffer,
    editCategoryOffer,
    deleteCategoryOffer,
    walletTransactions,
    getDashboardData
} from "../controllers/adminController.js"



router.get("/customers-list", customersList)
router.get("/:customerId/customer-details", customerDetails)
router.get("/products", getProducts)
router.get("/products/:id", productDetails)
router.get("/coupons", getCoupons)
router.get("/categories", getCategories)
router.get("/orders", getOrders)
router.get("/orders/:orderId", getOrderDetails)
router.get("/product-names", productNames)
router.get("/product-offers", getAllProductOffers)
router.get("/category-offers", getAllCategoryOffers)
router.get("/referral-offers", getReferalOffers)
router.get("/sales-report", salesReport)
router.get("/wallet-transactions", walletTransactions)
router.get("/dashboard", getDashboardData)




router.post("/add-coupon", addCoupon)
router.post("/add-category", addCategory)
router.post("/:categoryId/add-subcategories", addSubCategories)
router.post("/orders/:orderId/return-verification", verifyReturn)
router.post("/create-product-offer", createProductOffer)
router.post("/create-category-offer", createCategoryOffer)
router.post("/create-referral-offer", createReferalOffer)




router.put("/categories/:categoryId/subcategories/:subcategoryId", editSubcategoryName)
router.put("/referral-offer/:id", editReferalOffer)
router.put("/edit-product-offer/:id", editProductOffer)
router.put("/category-offer/:id", editCategoryOffer)


router.patch("/block-user/:id", blockUser)
router.patch("/orders/:orderId/status", updateOrderStatus)
router.patch("/edit-coupon", updateCoupon)
router.patch("/referral-offer/toggle-status/:id", toggleReferalStatus)



router.delete("/delete-product/:id", deleteProduct)
router.delete("/delete-coupon/:id", deleteCoupon)
router.delete("/delete-categories/:categoryId", deleteCategories)
router.delete("/categories/:categoryId/subcategories/:subcategoryId", deleteSubCategories)
router.delete("/referral-offer/:id", deleteReferealOffer)
router.delete("/product-offer/:id", deleteProductOffer)
router.delete("/category-offer/:id", deleteCategoryOffer)



export default router
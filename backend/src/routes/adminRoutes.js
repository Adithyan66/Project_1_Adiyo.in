import express from "express";

const router = express.Router()

import { blockUser, customerDetails, customersList } from "../controllers/customerController.js";
import { deleteProduct, getProducts, productDetails, productNames } from "../controllers/adminProductController.js";
import { addCoupon, deleteCoupon, getCoupons, updateCoupon } from "../controllers/couponController.js";
import { addCategory, addSubCategories, deleteCategories, deleteSubCategories, editSubcategoryName, getCategories } from "../controllers/categoryController.js";
import { getOrderDetails, getOrders, updateOrderStatus, verifyReturn } from "../controllers/adminOrderController.js";
import { createProductOffer, deleteProductOffer, editProductOffer, getAllProductOffers } from "../controllers/productOfferController.js";
import { createCategoryOffer, deleteCategoryOffer, editCategoryOffer, getAllCategoryOffers } from "../controllers/categoryOfferController.js";
import { createReferalOffer, deleteReferealOffer, editReferalOffer, getReferalOffers, toggleReferalStatus } from "../controllers/referalOfferController.js";
import { walletTransactions } from "../controllers/walletController.js";
import { getDashboardData, salesReport } from "../controllers/adminDashboardController.js";



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
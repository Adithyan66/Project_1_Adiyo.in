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
import { authenticateAdmin } from "../middlewares/authentication.js"



router.get("/customers-list", authenticateAdmin, customersList)
router.get("/:customerId/customer-details", authenticateAdmin, customerDetails)
router.get("/products", authenticateAdmin, getProducts)
router.get("/products/:id", authenticateAdmin, productDetails)
router.get("/coupons", authenticateAdmin, getCoupons)
router.get("/categories", getCategories)
router.get("/orders", authenticateAdmin, getOrders)
router.get("/orders/:orderId", authenticateAdmin, getOrderDetails)
router.get("/product-names", authenticateAdmin, productNames)
router.get("/product-offers", authenticateAdmin, getAllProductOffers)
router.get("/category-offers", authenticateAdmin, getAllCategoryOffers)
router.get("/referral-offers", authenticateAdmin, getReferalOffers)
router.get("/sales-report", authenticateAdmin, salesReport)
router.get("/wallet-transactions", authenticateAdmin, walletTransactions)
router.get("/dashboard", authenticateAdmin, getDashboardData)




router.post("/add-coupon", authenticateAdmin, addCoupon)
router.post("/add-category", authenticateAdmin, addCategory)
router.post("/:categoryId/add-subcategories", authenticateAdmin, addSubCategories)
router.post("/orders/:orderId/return-verification", authenticateAdmin, verifyReturn)
router.post("/create-product-offer", authenticateAdmin, createProductOffer)
router.post("/create-category-offer", authenticateAdmin, createCategoryOffer)
router.post("/create-referral-offer", authenticateAdmin, createReferalOffer)




router.put("/categories/:categoryId/subcategories/:subcategoryId", authenticateAdmin, editSubcategoryName)
router.put("/referral-offer/:id", authenticateAdmin, editReferalOffer)
router.put("/edit-product-offer/:id", authenticateAdmin, editProductOffer)
router.put("/category-offer/:id", authenticateAdmin, editCategoryOffer)


router.patch("/block-user/:id", authenticateAdmin, blockUser)
router.patch("/orders/:orderId/status", authenticateAdmin, updateOrderStatus)
router.patch("/edit-coupon", authenticateAdmin, updateCoupon)
router.patch("/referral-offer/toggle-status/:id", authenticateAdmin, toggleReferalStatus)



router.delete("/delete-product/:id", authenticateAdmin, deleteProduct)
router.delete("/delete-coupon/:id", authenticateAdmin, deleteCoupon)
router.delete("/delete-categories/:categoryId", authenticateAdmin, deleteCategories)
router.delete("/categories/:categoryId/subcategories/:subcategoryId", authenticateAdmin, deleteSubCategories)
router.delete("/referral-offer/:id", authenticateAdmin, deleteReferealOffer)
router.delete("/product-offer/:id", authenticateAdmin, deleteProductOffer)
router.delete("/category-offer/:id", authenticateAdmin, deleteCategoryOffer)



export default router
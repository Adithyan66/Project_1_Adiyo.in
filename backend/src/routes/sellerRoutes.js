import express from "express";
import multer from "multer";


const router = express.Router();


import { addProduct, getProducts, productDetails, editProduct } from "../controllers/sellerController.js";


const upload = multer({ dest: "uploads/" });


router.get("/products", getProducts)
router.get("/products/:id", productDetails)


router.post("/add-products", upload.any(), addProduct);
router.put("/edit-product/:id", upload.any(), editProduct)




export default router;
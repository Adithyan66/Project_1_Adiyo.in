import express, { application } from "express";
import multer from "multer";


const router = express.Router();


import { addProduct } from "../controllers/sellerController.js";


const upload = multer({ dest: "uploads/" });


router.post("/add-products", upload.array("images", 5), addProduct);
router.post("/add-products", addProduct)

export default router;
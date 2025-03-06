import express from "express";

const router = express.Router()

import { customersList, customerDetails } from "../controllers/adminController.js"



router.get("/customers-list", customersList)
router.get("/:customerId/customer-details", customerDetails)





export default router
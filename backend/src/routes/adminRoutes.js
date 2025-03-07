import express from "express";

const router = express.Router()

import { customersList, customerDetails, blockUser } from "../controllers/adminController.js"



router.get("/customers-list", customersList)
router.get("/:customerId/customer-details", customerDetails)


router.patch("/block-user/:id", blockUser)


export default router
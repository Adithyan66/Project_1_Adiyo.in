import express from "express";

const router = express.Router()

import { customersList } from "../controllers/adminController.js"



router.get("/customers-list", customersList)





export default router
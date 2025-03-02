import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";


import userRouter from "./routes/userRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";



import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json({ limit: '10mb' })); // Only include this once
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);



connectDB();

app.use("/seller", sellerRoutes)
app.use("/user", userRouter);



export default app;

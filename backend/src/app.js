import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";


import userRouter from "./routes/userRoutes.js";



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



// Database Connection
connectDB();


// Routes
app.use("/user", userRouter);



export default app;

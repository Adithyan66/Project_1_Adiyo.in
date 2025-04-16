import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";


import userRouter from "./routes/userRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js"
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';



import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(morgan('dev'));

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);


app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);



connectDB();


const accessLogStream = fs.createWriteStream(
    path.join('logs', 'access.log'),
    { flags: 'a' }
);

app.use(morgan('combined', { stream: accessLogStream }));

if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

const logStream = fs.createWriteStream(path.join(__dirname, 'logs', 'access.log'), { flags: 'a' });

app.use(morgan('combined', { stream: logStream }));



app.use("/admin", adminRoutes)
app.use("/seller", sellerRoutes)
app.use("/user", userRouter);



export default app;

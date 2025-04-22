import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { corsOptions } from "./config/corsConfig.js";

import userRouter from "./routes/userRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js"
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import HttpStatusCodefrom from "./utils/httpStatusCodes.js";
const { NOT_FOUND } = HttpStatusCodefrom

dotenv.config();

const app = express();

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);


app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(cors(corsOptions));

connectDB();

const accessLogStream = fs.createWriteStream(
    path.join('logs', 'access.log'),
    { flags: 'a' }
);

app.use(morgan('combined', { stream: accessLogStream }));

// if (process.env.NODE_ENV !== 'production') {
//     app.use(morgan('dev'));
// }

const logStream = fs.createWriteStream(path.join(__dirname, 'logs', 'access.log'), { flags: 'a' });

app.use(morgan('combined', { stream: logStream }));

app.use("/admin", adminRoutes)
app.use("/seller", sellerRoutes)
app.use("/user", userRouter);
app.use((req, res, next) => {
    res.status(NOT_FOUND).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    const status = err.statusCode || 500;
    res.status(status).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
});


export default app;

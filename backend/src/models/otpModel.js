import mongoose from "mongoose";




const otpSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, index: true },
        otp: { type: String, required: true },
        createdAt: { type: Date, default: Date.now, expires: 60 }
    },
    { timestamps: true } // Ensures Mongoose correctly handles dates
);

const Otp = mongoose.model("Otp", otpSchema);

export default Otp;

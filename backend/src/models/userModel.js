import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        enum: ["admin", "customer", "seller", "delivery"],
        default: "customer",
    },
    resetPasswordOTP: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
    resetPasswordToken: {
        type: String
    },
    googleId: {
        type: String
    }
})

const User = mongoose.model("User", userSchema);

export default User;
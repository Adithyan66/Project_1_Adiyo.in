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





// const mongoose = require("mongoose");

// const UserSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   phone: { type: String, unique: true },
//   password: { type: String, required: true },
//   address: [
//     {
//       type: { type: String, enum: ["billing", "shipping"], required: true },
//       street: String,
//       city: String,
//       state: String,
//       zip: String,
//       country: String,
//     }
//   ],
//   role: { type: String, enum: ["user", "admin"], default: "user" },
//   status: { type: String, enum: ["active", "inactive", "banned"], default: "active" },
//   cart: [{ productId: mongoose.Schema.Types.ObjectId, quantity: Number }],
//   wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
//   orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
//   lastLogin: { type: Date },
// }, { timestamps: true });

// module.exports = mongoose.model("User", UserSchema);

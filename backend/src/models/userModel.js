

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({


    userId: {
        type: String,
        unique: true,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
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
    },
    addresses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    }],
    defaultAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    },
    phone: String,
    status: {
        type: String,
        enum: ['Active', 'Blocked'],
        default: 'Active',
    },
    role: {
        type: String,
        enum: ["admin", "customer", "seller", "delivery"],
        default: 'customer',
    },
    registrationDate: {
        type: Date,
        default: Date.now,
    },
    avatar: String,
    lastTransaction: Date,
    lastOnline: Date,
    products: {
        type: Number,
        default: 0,
    },
    sales: {
        type: Number,
        default: 0.0,
    },
    isActive: {
        type: Boolean,
        default: true,
        enum: [true, false]
    },

    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    },
    dateOfBirth: {
        type: String,
    },
    mobile: {
        type: String,
        trim: true
    },
    profileImg: {
        type: String,
    }
});

const User = mongoose.model("User", userSchema);

export default User;
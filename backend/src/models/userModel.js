
// const userSchema = new mongoose.Schema({
//     username: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true
//     },
//     password: {
//         type: String,
//     },
//     role: {
//         type: String,
//         enum: ["admin", "customer", "seller", "delivery"],
//         default: "customer",
//     },
//     resetPasswordOTP: {
//         type: String,
//     },
//     resetPasswordExpires: {
//         type: Date,
//     },
//     resetPasswordToken: {
//         type: String
//     },
//     googleId: {
//         type: String
//     }
// })

// const User = mongoose.model("User", userSchema);

// export default User;





import mongoose from "mongoose"

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
    }, resetPasswordOTP: {
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
    address: String,
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
    }
});

const User = mongoose.model("User", userSchema);

export default User;


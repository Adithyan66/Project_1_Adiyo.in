import mongoose from "mongoose";


const AddressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
    },
    alternatePhone: {
        type: String,
        match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'],
        default: ''
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true
    },
    locality: {
        type: String,
        required: [true, 'Locality/Town is required'],
        trim: true
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true
    },
    state: {
        type: String,
        required: [true, 'State is required'],
        trim: true
    },
    pincode: {
        type: String,
        required: [true, 'Pincode is required'],
        match: [/^\d{6}$/, 'Please enter a valid 6-digit pincode']
    },
    landmark: {
        type: String,
        trim: true,
        default: ''
    },
    addressType: {
        type: String,
        enum: ['Home', 'Work', 'Other'],
        default: 'Home'
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});


const Address = mongoose.model("Address", AddressSchema)

export default Address
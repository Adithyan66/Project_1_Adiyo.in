// import mongoose from 'mongoose';

// const ProductOfferSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     discount: {
//         type: Number,
//         required: true,
//         min: 1,
//         max: 99
//     },
//     products: {
//         type: [String],
//         required: true,
//         validate: [array => array.length > 0, 'At least one product must be specified']
//     },
//     startDate: {
//         type: Date,
//         required: true
//     },
//     endDate: {
//         type: Date,
//         required: true,
//         validate: {
//             validator: function (value) {
//                 return value > this.startDate;
//             },
//             message: 'End date must be after start date'
//         }
//     },
//     status: {
//         type: String,
//         enum: ['active', 'inactive'],
//         default: 'active'
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     },
//     updatedAt: {
//         type: Date,
//         default: Date.now
//     }
// });

// ProductOfferSchema.pre('save', function (next) {
//     this.updatedAt = Date.now();
//     next();
// });

// const ProductOffer = mongoose.model('ProductOffer', ProductOfferSchema)


// export default ProductOffer




import mongoose from 'mongoose';

const ProductOfferSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    discount: {
        type: Number,
        required: true,
        min: 1,
        max: 99
    },
    products: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Product',
        required: true,
        validate: [array => array.length > 0, 'At least one product must be specified']
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value > this.startDate;
            },
            message: 'End date must be after start date'
        }
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

ProductOfferSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const ProductOffer = mongoose.model('ProductOffer', ProductOfferSchema);

export default ProductOffer;

import HttpStatusCode from "../utils/httpStatusCodes.js";

const {
    OK,
    CREATED,
    ACCEPTED,
    NO_CONTENT,
    BAD_REQUEST,
    UNAUTHORIZED,
    FORBIDDEN,
    NOT_FOUND,
    METHOD_NOT_ALLOWED,
    CONFLICT,
    UNPROCESSABLE_ENTITY,
    INTERNAL_SERVER_ERROR,
    BAD_GATEWAY,
    SERVICE_UNAVAILABLE,
    GATEWAY_TIMEOUT
} = HttpStatusCode

const ObjectId = mongoose.Types.ObjectId;
import mongoose from "mongoose";
import Product from "../models/productModel.js"


export const getNewArrivals = async (req, res) => {

    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 4;
        const skip = (page - 1) * limit;

        const products = await Product.find({ deletedAt: null })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('category', 'name')
            .lean();

        const transformedProducts = products.map(product => {
            const firstColor = product.colors[0];
            return {
                id: product._id,
                title: product.name,
                image: firstColor?.images[0] || '',
                price: firstColor?.discountPrice || 0,
                oldPrice: firstColor?.basePrice || 0,
                rating: 4,
                brand: product.brand,
                category: product.category?.name || 'Uncategorized'
            };
        });

        res.status(OK).json({
            success: true,
            products: transformedProducts,
            total: await Product.countDocuments({ deletedAt: null })
        });
    } catch (error) {
        console.error('Error fetching new arrivals:', error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch new arrivals',
            error: error.message
        });
    }
};



export const getTopSellingProducts = async (req, res) => {

    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 4;
        const skip = (page - 1) * limit;

        const products = await Product.find({ deletedAt: null })
            .sort({ totalQuantity: -1 })
            .skip(skip)
            .limit(limit)
            .populate('category', 'name')
            .lean();

        const transformedProducts = products.map(product => {
            const firstColor = product.colors[0];
            return {
                id: product._id,
                title: product.name,
                image: firstColor?.images[0] || '',
                price: firstColor?.discountPrice || 0,
                oldPrice: firstColor?.basePrice || 0,
                rating: 4,
                brand: product.brand,
                category: product.category?.name || 'Uncategorized'
            };
        });

        res.status(OK).json({
            success: true,
            products: transformedProducts,
            total: await Product.countDocuments({ deletedAt: null })
        });

    } catch (error) {

        console.error('Error fetching top selling products:', error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch top selling products',
            error: error.message
        });
    }
};


export const productList = async (req, res) => {

    try {
        const match = {};
        match.deletedAt = null;

        if (req.query.search) {
            match.name = { $regex: req.query.search, $options: "i" };
        }

        if (req.query.category) {
            try {
                match.category = new ObjectId(req.query.category);
            } catch (error) {
                console.log(error.message);
                return res.status(BAD_REQUEST).json({
                    status: false,
                    message: "Invalid category ID format."
                });
            }
        }

        if (req.query.subCategory) {
            try {
                match.subCategory = new ObjectId(req.query.subCategory);
            } catch (error) {
                return res.status(BAD_REQUEST).json({
                    status: false,
                    message: "Invalid subCategory ID format."
                });
            }
        }

        if (req.query.minPrice || req.query.maxPrice) {
            const priceFilter = {};
            if (req.query.minPrice) {
                priceFilter.$gte = Number(req.query.minPrice);
            }
            if (req.query.maxPrice) {
                priceFilter.$lte = Number(req.query.maxPrice);
            }
            match.colors = { $elemMatch: { discountPrice: priceFilter } };
        }

        if (req.query.color) {
            const colorsArray = req.query.color.split(",");
            if (match.colors) {
                match.colors.$elemMatch = {
                    ...match.colors.$elemMatch,
                    color: { $in: colorsArray },
                };
            } else {
                match.colors = { $elemMatch: { color: { $in: colorsArray } } };
            }
        }


        if (req.query.size) {
            const sizesArray = req.query.size.split(",");
            const sizeConditions = [];

            sizesArray.forEach(size => {

                sizeConditions.push({
                    colors: {
                        $elemMatch: {
                            [`variants.${size}.stock`]: { $gt: 0 }
                        }
                    }
                });
            });

            if (sizeConditions.length > 0) {
                if (!match.$or) {
                    match.$or = [];
                }
                match.$or = [...match.$or, ...sizeConditions];
            }
        }

        const pipeline = [
            { $match: match },
            {
                $addFields: {
                    minDiscountPrice: { $min: "$colors.discountPrice" },
                },
            }
        ];

        if (req.query.color) {
            const colorsArray = req.query.color.split(",");
            pipeline.push({
                $project: {
                    name: 1,
                    shortDescription: 1,
                    description: 1,
                    brand: 1,
                    category: 1,
                    subCategory: 1,
                    sku: 1,
                    material: 1,
                    careInstructions: 1,
                    colors: {
                        $filter: {
                            input: "$colors",
                            as: "color",
                            cond: { $in: ["$$color.color", colorsArray] }
                        }
                    },
                    createdAt: 1,
                    updatedAt: 1
                }
            });

            pipeline.push({
                $addFields: {
                    minDiscountPrice: { $min: "$colors.discountPrice" },
                }
            });
        }

        let sortStage = {};
        if (req.query.sort) {
            switch (req.query.sort) {
                case "price_low_high":
                    sortStage = { minDiscountPrice: 1 };
                    break;
                case "price_high_low":
                    sortStage = { minDiscountPrice: -1 };
                    break;
                case "name_a_z":
                    sortStage = { name: 1 };
                    break;
                case "name_z_a":
                    sortStage = { name: -1 };
                    break;
                default:
                    break;
            }
        }
        if (Object.keys(sortStage).length > 0) {
            pipeline.push({ $sort: sortStage });
        }

        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;
        pipeline.push({ $skip: skip }, { $limit: limit });


        // console.log("Pipeline:", JSON.stringify(pipeline, null, 2));

        const products = await Product.aggregate(pipeline);
        const countPipeline = [{ $match: match }, { $count: "total" }];
        const countResult = await Product.aggregate(countPipeline);
        const totalProducts = countResult[0] ? countResult[0].total : 0;

        res.status(OK).json({
            status: true,
            message: "Fetched successfully",
            page,
            totalPages: Math.ceil(totalProducts / limit),
            totalProducts,
            products,
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(INTERNAL_SERVER_ERROR).json({
            status: false,
            message: "Server error",
        });
    }
};



export const productDetail = async (req, res) => {

    try {

        const { id } = req.params;

        const product = await Product.findOne({ _id: id, deletedAt: null });

        if (!product) {
            return res.status(NOT_FOUND).json({
                status: false,
                message: "Product not found"
            });
        }

        res.status(OK).json({
            status: true,
            message: "product detail fetched succesfully",
            product
        })

    } catch (error) {

        console.error("Error fetching product:", error);

        res.status(INTERNAL_SERVER_ERROR).json({
            status: false,
            message: "server error on fetching"
        });
    }
}


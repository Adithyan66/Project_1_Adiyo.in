
// import cloudinary from '../config/cloudinary.js';
// import Product from '../models/productModel.js';
// import Category from '../models/categoryModel.js';
// import fs from "fs";
// import mongoose from 'mongoose';
// import { attachSignedUrlsToProduct } from '../utils/imageService.js';
// const ObjectId = mongoose.Types.ObjectId;

// export const addProduct = async (req, res) => {

//     const {
//         name,
//         shortDescription,
//         description,
//         brand,
//         category,
//         subCategory,
//         sku,
//         material,
//         careInstructions,
//         totalQuantity
//     } = req.body;

//     let parsedCareInstructions;

//     try {
//         parsedCareInstructions = careInstructions ? JSON.parse(careInstructions) : [];
//     } catch (err) {
//         return res.status(400).json({
//             status: false,
//             message: 'Invalid careInstructions format',
//         });
//     }

//     let colorsData;
//     try {
//         colorsData = req.body.colors ? JSON.parse(req.body.colors) : [];
//     } catch (err) {
//         return res.status(400).json({
//             status: false,
//             message: 'Invalid colors data format',
//         });
//     }

//     const filesByColor = {};
//     if (!req.files || req.files.length === 0) {
//         return res.status(400).json({
//             status: false,
//             message: 'Please upload image files for each color variant',
//         });
//     }

//     req.files.forEach((file) => {
//         const match = file.fieldname.match(/color(\d+)_image/);
//         if (match) {
//             const colorIndex = match[1];
//             if (!filesByColor[colorIndex]) {
//                 filesByColor[colorIndex] = [];
//             }
//             filesByColor[colorIndex].push(file);
//         }
//     });


//     for (let i = 0; i < colorsData.length; i++) {
//         if (!filesByColor[i] || filesByColor[i].length !== 5) {
//             return res.status(400).json({
//                 status: false,
//                 message: `Color variant at index ${i} must have exactly 5 images`,
//             });
//         }
//     }

//     try {

//         for (let i = 0; i < colorsData.length; i++) {
//             const colorFiles = filesByColor[i];
//             const cloudinaryResults = await Promise.all(
//                 colorFiles.map((file) => {
//                     return cloudinary.uploader.upload(file.path, {
//                         folder: "Adiyo/productsImages",
//                     });
//                 })
//             );
//             const imageUrls = cloudinaryResults.map((result) => result.secure_url);
//             const imagePublicIds = cloudinaryResults.map((result) => result.public_id);

//             colorsData[i].images = imagePublicIds;
//             // colorsData[i].imagePublicIds = imagePublicIds;
//         }


//         const product = new Product({
//             sku,
//             name,
//             shortDescription,
//             description,
//             brand,
//             category,
//             subCategory,
//             material,
//             careInstructions: parsedCareInstructions,
//             colors: colorsData,
//             totalQuantity
//         });

//         await product.save();

//         res.json({
//             status: true,
//             message: 'Product added successfully',
//             product,
//         });

//     } catch (error) {

//         if (req.files && req.files.length > 0) {
//             req.files.forEach(async (file) => {

//             });
//         }
//         console.error(error);
//         res.status(500).json({
//             status: false,
//             message: 'Server error',
//         });
//     }
// };

// export const getProducts = async (req, res) => {

//     try {

//         const products = await Product.find({ deletedAt: null }).populate("category")

//         res.status(200).json({
//             status: true,
//             message: "products fetched succesfully",
//             products
//         })


//     } catch (error) {

//         console.log("error fetching in products", error);
//         res.status(500).json({
//             success: false,
//             message: "server error"
//         })


//     }
// }

// export const productDetails = async (req, res) => {

//     const { id } = req.params;

//     try {
//         const product = await Product.findById(id);

//         if (!product) {
//             return res.status(404).json({
//                 status: false,
//                 message: "Product not found"
//             });
//         }

//         const productForRes = await attachSignedUrlsToProduct(product)

//         res.status(200).json({
//             status: true,
//             message: "Product details fetched successfully",
//             product: productForRes
//         });
//     } catch (error) {
//         console.error("Error fetching product:", error);
//         res.status(500).json({
//             status: false,
//             message: "Server error"
//         });
//     }
// };


// const extractPublicIdFromUrl = (url) => {
//     if (!url || typeof url !== 'string') return null;
//     const parts = url.split('/v1/');
//     if (parts.length < 2) return null;
//     const publicId = parts[1].split('?')[0];
//     return publicId;
// };

// export const editProduct = async (req, res) => {
//     const {
//         name,
//         shortDescription,
//         description,
//         brand,
//         category,
//         subCategory,
//         sku,
//         material,
//         careInstructions,
//         totalQuantity,
//     } = req.body;

//     let parsedCareInstructions;
//     try {
//         parsedCareInstructions = careInstructions ? JSON.parse(careInstructions) : [];
//     } catch (err) {
//         return res.status(400).json({ status: false, message: "Invalid careInstructions format" });
//     }

//     let colorsData;
//     try {
//         colorsData = req.body.colors ? JSON.parse(req.body.colors) : [];
//     } catch (err) {
//         return res.status(400).json({ status: false, message: "Invalid colors data format" });
//     }

//     const filesByColorAndIndex = {};
//     if (req.files && req.files.length > 0) {
//         req.files.forEach((file) => {
//             const match = file.fieldname.match(/color(\d+)_image_(\d+)/);
//             if (match) {
//                 const colorIndex = Number(match[1]);
//                 const imageIndex = Number(match[2]);
//                 if (!filesByColorAndIndex[colorIndex]) {
//                     filesByColorAndIndex[colorIndex] = {};
//                 }
//                 filesByColorAndIndex[colorIndex][imageIndex] = file;
//             }
//         });
//     }

//     try {
//         for (let i = 0; i < colorsData.length; i++) {
//             if (!Array.isArray(colorsData[i].images)) {
//                 colorsData[i].images = [];
//             }

//             const updatedImages = colorsData[i].images.map((img, j) => {
//                 if (img === null && filesByColorAndIndex[i]?.[j]) {
//                     // New upload will replace this index
//                     return null;
//                 }
//                 return extractPublicIdFromUrl(img) || img;
//             });

//             colorsData[i].images = updatedImages;

//             if (filesByColorAndIndex[i]) {
//                 const imageUpdates = filesByColorAndIndex[i];
//                 for (const imageIndex in imageUpdates) {
//                     const file = imageUpdates[imageIndex];

//                     const cloudinaryResult = await cloudinary.uploader.upload(file.path, {
//                         folder: "Adiyo/productsImages",
//                         resource_type: "auto",
//                         use_filename: true,
//                         unique_filename: true,
//                         overwrite: true,
//                         transformation: [],
//                         flags: "attachment"
//                     });

//                     colorsData[i].images[imageIndex] = cloudinaryResult.public_id;

//                     fs.unlinkSync(file.path);
//                 }
//             }
//         }

//         const updatedProduct = await Product.findByIdAndUpdate(
//             req.params.id,
//             {
//                 sku,
//                 name,
//                 shortDescription,
//                 description,
//                 brand,
//                 category: new ObjectId(category),
//                 subCategory: new ObjectId(subCategory),
//                 material,
//                 careInstructions: parsedCareInstructions,
//                 totalQuantity,
//                 colors: colorsData,
//             },
//             { new: true }
//         );

//         if (!updatedProduct) {
//             return res.status(404).json({ status: false, message: "Product not found" });
//         }

//         res.status(200).json({
//             status: true,
//             message: "Product updated successfully",
//             product: updatedProduct,
//         });
//     } catch (error) {
//         console.error("Error updating product:", error);
//         res.status(500).json({ status: false, message: "Server error" });
//     }
// };

// export const deleteProduct = async (req, res) => {
//     try {
//         const productId = req.params.id;
//         const product = await Product.findByIdAndUpdate(
//             productId,
//             { deletedAt: new Date() },
//             { new: true }
//         );

//         if (!product) {
//             return res.status(404).json({ message: 'Product not found' });
//         }

//         res.status(200).json({
//             status: true,
//             message: 'Product soft deleted successfully',
//             product
//         });

//     } catch (error) {

//         console.error('Error soft deleting product:', error);
//         res.status(500).json({ message: 'Server error' });
//     }

// }

// export const getCategories = async (req, res) => {

//     try {

//         const categories = await Category.find()

//         if (!categories) {
//             return res.status(400).json({
//                 status: false,
//                 message: "Categories not found"
//             })
//         }

//         res.status(200).json({
//             status: true,
//             message: "categories fetched succesfully",
//             categories
//         })


//     } catch (error) {
//         console.log(error.message);

//         res.status(500).json({
//             status: false,
//             message: "server error"
//         }
//         )

//     }
// }














import HttpStatusCode from "../utils/httpStatusCodes.js";
import messages from "../utils/messages.js";

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
} = HttpStatusCode;

import cloudinary from '../config/cloudinary.js';
import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';
import fs from "fs";
import mongoose from 'mongoose';
import { attachSignedUrlsToProduct } from '../utils/imageService.js';
const ObjectId = mongoose.Types.ObjectId;

export const addProduct = async (req, res) => {
    const {
        name,
        shortDescription,
        description,
        brand,
        category,
        subCategory,
        sku,
        material,
        careInstructions,
        totalQuantity
    } = req.body;

    let parsedCareInstructions;
    try {
        parsedCareInstructions = careInstructions ? JSON.parse(careInstructions) : [];
    } catch (err) {
        return res.status(BAD_REQUEST).json({
            success: false,
            message: messages.PRODUCT.INVALID_CARE_INSTRUCTIONS
        });
    }

    let colorsData;
    try {
        colorsData = req.body.colors ? JSON.parse(req.body.colors) : [];
    } catch (err) {
        return res.status(BAD_REQUEST).json({
            success: false,
            message: messages.PRODUCT.INVALID_COLORS_DATA
        });
    }

    const filesByColor = {};
    if (!req.files || req.files.length === 0) {
        return res.status(BAD_REQUEST).json({
            success: false,
            message: messages.PRODUCT.MISSING_IMAGES
        });
    }

    req.files.forEach((file) => {
        const match = file.fieldname.match(/color(\d+)_image/);
        if (match) {
            const colorIndex = match[1];
            if (!filesByColor[colorIndex]) {
                filesByColor[colorIndex] = [];
            }
            filesByColor[colorIndex].push(file);
        }
    });

    for (let i = 0; i < colorsData.length; i++) {
        if (!filesByColor[i] || filesByColor[i].length !== 5) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: messages.PRODUCT.INVALID_IMAGE_COUNT
            });
        }
    }

    try {
        for (let i = 0; i < colorsData.length; i++) {
            const colorFiles = filesByColor[i];
            const cloudinaryResults = await Promise.all(
                colorFiles.map((file) => {
                    return cloudinary.uploader.upload(file.path, {
                        folder: "Adiyo/productsImages",
                    });
                })
            );
            const imagePublicIds = cloudinaryResults.map((result) => result.public_id);
            colorsData[i].images = imagePublicIds;
        }

        const product = new Product({
            sku,
            name,
            shortDescription,
            description,
            brand,
            category,
            subCategory,
            material,
            careInstructions: parsedCareInstructions,
            colors: colorsData,
            totalQuantity
        });

        await product.save();

        res.status(CREATED).json({
            success: true,
            message: messages.PRODUCT.CREATED_SUCCESSFULLY,
            product
        });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.PRODUCT.FAILED_CREATE
        });
    }
};

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({ deletedAt: null }).populate("category");

        res.status(OK).json({
            success: true,
            message: messages.PRODUCT.FETCHED_SUCCESSFULLY,
            products
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.PRODUCT.FAILED_FETCH
        });
    }
};

export const productDetails = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(NOT_FOUND).json({
                success: false,
                message: messages.PRODUCT.NOT_FOUND
            });
        }

        const productForRes = await attachSignedUrlsToProduct(product);

        res.status(OK).json({
            success: true,
            message: messages.PRODUCT.DETAILS_FETCHED_SUCCESSFULLY,
            product: productForRes
        });
    } catch (error) {
        console.error("Error fetching product details:", error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.PRODUCT.FAILED_FETCH_DETAILS
        });
    }
};

const extractPublicIdFromUrl = (url) => {
    if (!url || typeof url !== 'string') return null;
    const parts = url.split('/v1/');
    if (parts.length < 2) return null;
    const publicId = parts[1].split('?')[0];
    return publicId;
};

export const editProduct = async (req, res) => {
    const {
        name,
        shortDescription,
        description,
        brand,
        category,
        subCategory,
        sku,
        material,
        careInstructions,
        totalQuantity,
    } = req.body;

    let parsedCareInstructions;
    try {
        parsedCareInstructions = careInstructions ? JSON.parse(careInstructions) : [];
    } catch (err) {
        return res.status(BAD_REQUEST).json({
            success: false,
            message: messages.PRODUCT.INVALID_CARE_INSTRUCTIONS
        });
    }

    let colorsData;
    try {
        colorsData = req.body.colors ? JSON.parse(req.body.colors) : [];
    } catch (err) {
        return res.status(BAD_REQUEST).json({
            success: false,
            message: messages.PRODUCT.INVALID_COLORS_DATA
        });
    }

    const filesByColorAndIndex = {};
    if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
            const match = file.fieldname.match(/color(\d+)_image_(\d+)/);
            if (match) {
                const colorIndex = Number(match[1]);
                const imageIndex = Number(match[2]);
                if (!filesByColorAndIndex[colorIndex]) {
                    filesByColorAndIndex[colorIndex] = {};
                }
                filesByColorAndIndex[colorIndex][imageIndex] = file;
            }
        });
    }

    try {
        for (let i = 0; i < colorsData.length; i++) {
            if (!Array.isArray(colorsData[i].images)) {
                colorsData[i].images = [];
            }

            const updatedImages = colorsData[i].images.map((img, j) => {
                if (img === null && filesByColorAndIndex[i]?.[j]) {
                    return null;
                }
                return extractPublicIdFromUrl(img) || img;
            });

            colorsData[i].images = updatedImages;

            if (filesByColorAndIndex[i]) {
                const imageUpdates = filesByColorAndIndex[i];
                for (const imageIndex in imageUpdates) {
                    const file = imageUpdates[imageIndex];

                    const cloudinaryResult = await cloudinary.uploader.upload(file.path, {
                        folder: "Adiyo/productsImages",
                        resource_type: "auto",
                        use_filename: true,
                        unique_filename: true,
                        overwrite: true,
                        transformation: [],
                        flags: "attachment"
                    });

                    colorsData[i].images[imageIndex] = cloudinaryResult.public_id;

                    fs.unlinkSync(file.path);
                }
            }
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                sku,
                name,
                shortDescription,
                description,
                brand,
                category: new ObjectId(category),
                subCategory: new ObjectId(subCategory),
                material,
                careInstructions: parsedCareInstructions,
                totalQuantity,
                colors: colorsData,
            },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(NOT_FOUND).json({
                success: false,
                message: messages.PRODUCT.NOT_FOUND
            });
        }

        res.status(OK).json({
            success: true,
            message: messages.PRODUCT.UPDATED_SUCCESSFULLY,
            product: updatedProduct
        });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.PRODUCT.FAILED_UPDATE
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findByIdAndUpdate(
            productId,
            { deletedAt: new Date() },
            { new: true }
        );

        if (!product) {
            return res.status(NOT_FOUND).json({
                success: false,
                message: messages.PRODUCT.NOT_FOUND
            });
        }

        res.status(OK).json({
            success: true,
            message: messages.PRODUCT.DELETED_SUCCESSFULLY,
            product
        });
    } catch (error) {
        console.error('Error soft deleting product:', error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.PRODUCT.FAILED_DELETE
        });
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();

        if (!categories || categories.length === 0) {
            return res.status(NOT_FOUND).json({
                success: false,
                message: messages.CATEGORY.NOT_FOUND
            });
        }

        res.status(OK).json({
            success: true,
            message: messages.CATEGORY.FETCHED_SUCCESSFULLY,
            categories
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.CATEGORY.FAILED_FETCH
        });
    }
};
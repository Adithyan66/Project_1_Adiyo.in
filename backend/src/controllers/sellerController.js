
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
        return res.status(400).json({
            status: false,
            message: 'Invalid careInstructions format',
        });
    }

    let colorsData;
    try {
        colorsData = req.body.colors ? JSON.parse(req.body.colors) : [];
    } catch (err) {
        return res.status(400).json({
            status: false,
            message: 'Invalid colors data format',
        });
    }

    const filesByColor = {};
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({
            status: false,
            message: 'Please upload image files for each color variant',
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
            return res.status(400).json({
                status: false,
                message: `Color variant at index ${i} must have exactly 5 images`,
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
            const imageUrls = cloudinaryResults.map((result) => result.secure_url);
            const imagePublicIds = cloudinaryResults.map((result) => result.public_id);

            colorsData[i].images = imagePublicIds;
            // colorsData[i].imagePublicIds = imagePublicIds;
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

        res.json({
            status: true,
            message: 'Product added successfully',
            product,
        });

    } catch (error) {

        if (req.files && req.files.length > 0) {
            req.files.forEach(async (file) => {

            });
        }
        console.error(error);
        res.status(500).json({
            status: false,
            message: 'Server error',
        });
    }
};

export const getProducts = async (req, res) => {

    try {

        const products = await Product.find({ deletedAt: null }).populate("category")

        res.status(200).json({
            status: true,
            message: "products fetched succesfully",
            products
        })


    } catch (error) {

        console.log("error fetching in products", error);
        res.status(500).json({
            success: false,
            message: "server error"
        })


    }
}

export const productDetails = async (req, res) => {

    const { id } = req.params;

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                status: false,
                message: "Product not found"
            });
        }

        const productForRes = await attachSignedUrlsToProduct(product)

        res.status(200).json({
            status: true,
            message: "Product details fetched successfully",
            product: productForRes
        });
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({
            status: false,
            message: "Server error"
        });
    }
};

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
//             if (filesByColorAndIndex[i]) {
//                 const imageUpdates = filesByColorAndIndex[i];
//                 if (!Array.isArray(colorsData[i].images)) {
//                     colorsData[i].images = [];
//                 }
//                 if (!Array.isArray(colorsData[i].imagePublicIds)) {
//                     colorsData[i].imagePublicIds = [];
//                 }
//                 for (const imageIndex in imageUpdates) {
//                     const file = imageUpdates[imageIndex];
//                     if (
//                         colorsData[i].imagePublicIds &&
//                         colorsData[i].imagePublicIds[imageIndex]
//                     ) {
//                         try {
//                             await cloudinary.uploader.destroy(colorsData[i].imagePublicIds[imageIndex]);
//                         } catch (error) {
//                             console.error(`Error deleting image with publicId ${colorsData[i].imagePublicIds[imageIndex]}:`, error);
//                         }
//                     }

//                     const cloudinaryResult = await cloudinary.uploader.upload(file.path, {
//                         folder: "Adiyo/productsImages",
//                         resource_type: "auto",
//                         use_filename: true,
//                         unique_filename: true,
//                         overwrite: true,
//                         transformation: [],
//                         flags: "attachment"
//                     });

//                     // colorsData[i].images[imageIndex] = cloudinaryResult.secure_url;
//                     // colorsData[i].imagePublicIds[imageIndex] = cloudinaryResult.public_id;

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




// Utility function to extract public ID from a Cloudinary signed URL
const extractPublicIdFromUrl = (url) => {
    if (!url || typeof url !== 'string') return null;
    // Signed URL format: https://res.cloudinary.com/<cloud_name>/image/upload/s--<signature>--/v1/<public_id>
    const parts = url.split('/v1/');
    if (parts.length < 2) return null;
    const publicId = parts[1].split('?')[0]; // Remove query params if any
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
        return res.status(400).json({ status: false, message: "Invalid careInstructions format" });
    }

    let colorsData;
    try {
        colorsData = req.body.colors ? JSON.parse(req.body.colors) : [];
    } catch (err) {
        return res.status(400).json({ status: false, message: "Invalid colors data format" });
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
        // Process colors to extract public IDs and handle new uploads
        for (let i = 0; i < colorsData.length; i++) {
            if (!Array.isArray(colorsData[i].images)) {
                colorsData[i].images = [];
            }

            // Convert signed URLs to public IDs for unchanged images
            const updatedImages = colorsData[i].images.map((img, j) => {
                if (img === null && filesByColorAndIndex[i]?.[j]) {
                    // New upload will replace this index
                    return null;
                }
                // Extract public ID from signed URL for unchanged images
                return extractPublicIdFromUrl(img) || img; // Fallback to img if not a valid URL
            });

            colorsData[i].images = updatedImages;

            // Handle new image uploads
            if (filesByColorAndIndex[i]) {
                const imageUpdates = filesByColorAndIndex[i];
                for (const imageIndex in imageUpdates) {
                    const file = imageUpdates[imageIndex];

                    // Upload new image to Cloudinary
                    const cloudinaryResult = await cloudinary.uploader.upload(file.path, {
                        folder: "Adiyo/productsImages",
                        resource_type: "auto",
                        use_filename: true,
                        unique_filename: true,
                        overwrite: true,
                        transformation: [],
                        flags: "attachment"
                    });

                    // Update the image at imageIndex with the new public ID
                    colorsData[i].images[imageIndex] = cloudinaryResult.public_id;

                    // Clean up temporary file
                    fs.unlinkSync(file.path);
                }
            }
        }

        // Update the product in the database
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
            return res.status(404).json({ status: false, message: "Product not found" });
        }

        res.status(200).json({
            status: true,
            message: "Product updated successfully",
            product: updatedProduct,
        });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ status: false, message: "Server error" });
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
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({
            status: true,
            message: 'Product soft deleted successfully',
            product
        });

    } catch (error) {

        console.error('Error soft deleting product:', error);
        res.status(500).json({ message: 'Server error' });
    }

}

export const getCategories = async (req, res) => {

    try {

        const categories = await Category.find()

        if (!categories) {
            return res.status(400).json({
                status: false,
                message: "Categories not found"
            })
        }

        res.status(200).json({
            status: true,
            message: "categories fetched succesfully",
            categories
        })


    } catch (error) {
        console.log(error.message);

        res.status(500).json({
            status: false,
            message: "server error"
        }
        )

    }
}

import cloudinary from '../config/cloudinary.js';
import Product from '../models/productModel.js';
import fs from "fs";






export const addProduct = async (req, res) => {
    const {
        name,
        shortDescription,
        description,
        brand,
        category,
        subCategory,
        sku, // auto-generated on the client or can be generated here
        material,
        careInstructions,
    } = req.body;

    // careInstructions is expected to be a JSON string
    let parsedCareInstructions;
    try {
        parsedCareInstructions = careInstructions ? JSON.parse(careInstructions) : [];
    } catch (err) {
        return res.status(400).json({
            status: false,
            message: 'Invalid careInstructions format',
        });
    }

    // colors is a JSON string (array of color objects)
    let colorsData;
    try {
        colorsData = req.body.colors ? JSON.parse(req.body.colors) : [];
    } catch (err) {
        return res.status(400).json({
            status: false,
            message: 'Invalid colors data format',
        });
    }

    // Group files by color index.
    // Expecting field names like "color0_image", "color0_image", ... "color1_image", etc.
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
            const colorIndex = match[1]; // e.g., "0" or "1"
            if (!filesByColor[colorIndex]) {
                filesByColor[colorIndex] = [];
            }
            filesByColor[colorIndex].push(file);
        }
    });

    // Validate that for each color variant, exactly 5 images are uploaded.
    for (let i = 0; i < colorsData.length; i++) {
        if (!filesByColor[i] || filesByColor[i].length !== 5) {
            return res.status(400).json({
                status: false,
                message: `Color variant at index ${i} must have exactly 5 images`,
            });
        }
    }

    try {
        // For each color, upload the corresponding files to Cloudinary.
        // We'll update the colorsData array with the image URLs and public IDs.
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
            // Save the URLs into the colors object
            colorsData[i].images = imageUrls;
            // (Optional) You could store public IDs as well if needed:
            colorsData[i].imagePublicIds = imagePublicIds;
        }

        // Create the product document using the new schema.
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
        });

        await product.save();

        res.json({
            status: true,
            message: 'Product added successfully',
            product,
        });
    } catch (error) {
        // If there's an error, remove any uploaded files from Cloudinary
        if (req.files && req.files.length > 0) {
            req.files.forEach(async (file) => {
                // This assumes you saved the cloudinary public_id in your local cloudinaryResults
                // You might need to adjust this based on your implementation.
                // Here we assume cloudinaryResults exist, so for each result, destroy the image.
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

        const products = await Product.find()

        res.status(200).json({
            status: true,
            message: "products fetched succesfully",
            products
        })


    } catch (error) {

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

        res.status(200).json({
            status: true,
            message: "Product details fetched successfully",
            product
        });
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({
            status: false,
            message: "Server error"
        });
    }
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

    // Group files by color index. Expect field names like "color0_image"
    const filesByColor = {};
    if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
            const match = file.fieldname.match(/color(\d+)_image/);
            if (match) {
                const colorIndex = match[1]; // e.g., "0", "1", etc.
                if (!filesByColor[colorIndex]) {
                    filesByColor[colorIndex] = [];
                }
                filesByColor[colorIndex].push(file);
            }
        });
    }

    // For any color variant where new images are uploaded,
    // you might want to enforce a rule like exactly 5 images if desired.
    for (let i = 0; i < colorsData.length; i++) {
        if (filesByColor[i] && filesByColor[i].length !== 5) {
            return res.status(400).json({
                status: false,
                message: `If updating color variant at index ${i}, please provide exactly 5 images`
            });
        }
    }

    try {
        // Process each color variant that has new images.
        for (let i = 0; i < colorsData.length; i++) {
            if (filesByColor[i]) {
                // Delete old images if they exist.
                if (colorsData[i].imagePublicIds && Array.isArray(colorsData[i].imagePublicIds)) {
                    for (const publicId of colorsData[i].imagePublicIds) {
                        try {
                            await cloudinary.uploader.destroy(publicId);
                        } catch (error) {
                            console.error(`Error deleting image with publicId ${publicId}:`, error);
                        }
                    }
                }

                // Upload new images
                const colorFiles = filesByColor[i];
                const cloudinaryResults = await Promise.all(
                    colorFiles.map((file) =>
                        cloudinary.uploader.upload(file.path, { folder: "Adiyo/productsImages" })
                    )
                );
                const imageUrls = cloudinaryResults.map((result) => result.secure_url);
                const imagePublicIds = cloudinaryResults.map((result) => result.public_id);
                // Update the colorsData for this variant with the new images.
                colorsData[i].images = imageUrls;
                colorsData[i].imagePublicIds = imagePublicIds;
                // Remove local files after upload.
                colorFiles.forEach((file) => fs.unlinkSync(file.path));
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
                category,
                subCategory,
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

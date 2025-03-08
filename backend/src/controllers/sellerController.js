
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

        const products = await Product.find({ deletedAt: null })

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

    // Parse careInstructions JSON
    let parsedCareInstructions;
    try {
        parsedCareInstructions = careInstructions ? JSON.parse(careInstructions) : [];
    } catch (err) {
        return res.status(400).json({ status: false, message: "Invalid careInstructions format" });
    }

    // Parse colors JSON which includes existing image URLs and public IDs
    let colorsData;
    try {
        colorsData = req.body.colors ? JSON.parse(req.body.colors) : [];
    } catch (err) {
        return res.status(400).json({ status: false, message: "Invalid colors data format" });
    }

    // Group files by color index and image index.
    // Expect field names like "color0_image_1", "color1_image_3", etc.
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
        // For each color variant, update only the images that are provided.
        for (let i = 0; i < colorsData.length; i++) {
            if (filesByColorAndIndex[i]) {
                const imageUpdates = filesByColorAndIndex[i];
                // Ensure images arrays exist; if not, initialize them.
                if (!Array.isArray(colorsData[i].images)) {
                    colorsData[i].images = [];
                }
                if (!Array.isArray(colorsData[i].imagePublicIds)) {
                    colorsData[i].imagePublicIds = [];
                }
                // Process each image index provided for this color variant.
                for (const imageIndex in imageUpdates) {
                    const file = imageUpdates[imageIndex];
                    // If there is an old image at this index, delete it from Cloudinary.
                    if (
                        colorsData[i].imagePublicIds &&
                        colorsData[i].imagePublicIds[imageIndex]
                    ) {
                        try {
                            await cloudinary.uploader.destroy(colorsData[i].imagePublicIds[imageIndex]);
                        } catch (error) {
                            console.error(`Error deleting image with publicId ${colorsData[i].imagePublicIds[imageIndex]}:`, error);
                        }
                    }

                    const cloudinaryResult = await cloudinary.uploader.upload(file.path, {
                        folder: "Adiyo/productsImages",
                        resource_type: "auto",
                        use_filename: true,
                        unique_filename: true,
                        overwrite: true,
                        transformation: [], // Empty transformation array to override defaults
                        flags: "attachment" // Forces Cloudinary to keep the original file as-is
                    });
                    // Upload the new image.
                    // const cloudinaryResult = await cloudinary.uploader.upload(file.path, {
                    //     folder: "Adiyo/productsImages",
                    //     transformation: [{ quality: "100" }]
                    // });
                    // Update only the specific index for this color variant.
                    colorsData[i].images[imageIndex] = cloudinaryResult.secure_url;
                    colorsData[i].imagePublicIds[imageIndex] = cloudinaryResult.public_id;
                    // Remove the local file after upload.
                    fs.unlinkSync(file.path);
                }
            }
        }

        // Update the product with the new data (only changed images are updated)
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
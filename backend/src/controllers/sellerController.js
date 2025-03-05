

// import cloudinary from '../config/cloudinary.js';
// import Product from '../models/productModel.js';



// const addProduct = async (req, res) => {


//     const {
//         name,
//         shortDescription,
//         description,
//         brand,
//         category,
//         subCategory,
//         sku,
//         price,
//         discountPrice,
//         discountPercentage,
//         material,
//         gender,
//         color,
//         size

//     } = req.body;

//     const totalStockNumber = parseInt(req.body.totalStock, 10);


//     let cloudinaryResults = [];


//     try {

//         if (!req.files || req.files.length === 0) {

//             return res.status(400).json({
//                 status: false,
//                 message: 'Please upload at least one  image for now'  //change to 5
//             })

//         }

//         let careInstructions = req.body.careInstructions;
//         let variants = req.body.variants;

//         try {

//             if (careInstructions) {
//                 careInstructions = JSON.parse(careInstructions);
//             }
//             if (variants) {
//                 variants = JSON.parse(variants);
//             }

//         } catch (err) {
//             return res.status(400).json({
//                 status: false,
//                 message: 'Invalid careInstructions or variants'
//             })
//         }


//         cloudinaryResults = await Promise.all(
//             req.files.map((file) => {
//                 return cloudinary.uploader.upload(file.path, {
//                     folder: "Adiyo/productsImages"
//                 })
//             })
//         )

//         const imageUrls = cloudinaryResults.map((result) => result.secure_url);
//         const imagePublicIds = cloudinaryResults.map(result => result.public_id);

//         console.log(imageUrls);
//         console.log(imagePublicIds);


//         const product = new Product({
//             sku,
//             name,
//             shortDescription,
//             description,
//             brand,
//             category,
//             subCategory,
//             price,
//             discountPrice,
//             discountPercentage,
//             material,
//             careInstructions,
//             gender,
//             variants,
//             totalStock: totalStockNumber,
//             imageUrls,
//             imagePublicIds,
//             color,
//             size
//         });



//         await product.save();

//         res.json({

//             status: true,
//             message: 'Product added successfully',
//             product
//         });

//     } catch (error) {

//         if (cloudinaryResults.length > 0) {
//             cloudinaryResults.map(async (result) => {
//                 if (result && result.public_id) {
//                     await cloudinary.uploader.destroy(result.public_id)
//                 }
//             })
//         }
//         console.error(error);

//         res.status(500).json({
//             status: false,
//             message: 'Server error'
//         });
//     }
// }


// export { addProduct };







import cloudinary from '../config/cloudinary.js';
import Product from '../models/productModel.js';

const addProduct = async (req, res) => {
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

export { addProduct };

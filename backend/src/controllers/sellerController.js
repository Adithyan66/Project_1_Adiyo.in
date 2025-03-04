

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
        sku,
        price,
        discountPrice,
        discountPercentage,
        material,
        gender,
        color,
        size

    } = req.body;

    const totalStockNumber = parseInt(req.body.totalStock, 10);


    let cloudinaryResults = [];


    try {

        if (!req.files || req.files.length === 0) {

            return res.status(400).json({
                status: false,
                message: 'Please upload at least one  image for now'  //change to 5
            })

        }

        let careInstructions = req.body.careInstructions;
        let variants = req.body.variants;

        try {

            if (careInstructions) {
                careInstructions = JSON.parse(careInstructions);
            }
            if (variants) {
                variants = JSON.parse(variants);
            }

        } catch (err) {
            return res.status(400).json({
                status: false,
                message: 'Invalid careInstructions or variants'
            })
        }


        cloudinaryResults = await Promise.all(
            req.files.map((file) => {
                return cloudinary.uploader.upload(file.path, {
                    folder: "Adiyo/productsImages"
                })
            })
        )

        const imageUrls = cloudinaryResults.map((result) => result.secure_url);
        const imagePublicIds = cloudinaryResults.map(result => result.public_id);

        console.log(imageUrls);
        console.log(imagePublicIds);


        const product = new Product({
            sku,
            name,
            shortDescription,
            description,
            brand,
            category,
            subCategory,
            price,
            discountPrice,
            discountPercentage,
            material,
            careInstructions,
            gender,
            variants,
            totalStock: totalStockNumber,
            imageUrls,
            imagePublicIds,
            color,
            size
        });



        await product.save();

        res.json({

            status: true,
            message: 'Product added successfully',
            product
        });

    } catch (error) {

        if (cloudinaryResults.length > 0) {
            cloudinaryResults.map(async (result) => {
                if (result && result.public_id) {
                    await cloudinary.uploader.destroy(result.public_id)
                }
            })
        }
        console.error(error);

        res.status(500).json({
            status: false,
            message: 'Server error'
        });
    }
}


export { addProduct };






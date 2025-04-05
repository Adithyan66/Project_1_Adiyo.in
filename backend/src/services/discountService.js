



import Product from '../models/productModel.js';
import ProductOffer from '../models/productOfferModel.js';
import CategoryOffer from '../models/categoryOfferModel.js';
import cron from 'node-cron';

export async function updateProductDiscounts() {
    try {
        const productOffers = await ProductOffer.find({
            status: 'active',
            startDate: { $lte: new Date() },
            endDate: { $gte: new Date() }
        });

        let categoryOffers = await CategoryOffer.find({
            status: 'active',
            startDate: { $lte: new Date() },
            endDate: { $gte: new Date() }
        });

        const productOfferMap = new Map();
        const categoryOfferMap = new Map();

        productOffers.forEach(offer => {
            offer.products.forEach(productId => {
                const idString = productId.toString();
                if (!productOfferMap.has(idString) || productOfferMap.get(idString) < offer.discount) {
                    productOfferMap.set(idString, offer.discount);
                }
            });
        });

        categoryOffers = Array.isArray(categoryOffers) ? categoryOffers : [categoryOffers];

        categoryOffers.forEach(offer => {
            const idString = offer.category.toString();
            if (!categoryOfferMap.has(idString) || categoryOfferMap.get(idString) < offer.discount) {
                categoryOfferMap.set(idString, offer.discount);
            }
        });

        const products = await Product.find({ deletedAt: null });

        for (const product of products) {
            const productId = product._id.toString();
            const categoryId = product.category.toString();

            const productOfferDiscount = productOfferMap.has(productId) ? productOfferMap.get(productId) : 0;
            const categoryOfferDiscount = categoryOfferMap.has(categoryId) ? categoryOfferMap.get(categoryId) : 0;

            for (const colorVariant of product.colors) {
                const basePrice = colorVariant.basePrice;

                const highestDiscount = Math.max(
                    productOfferDiscount,
                    categoryOfferDiscount
                );

                const newDiscountPrice = Math.floor(basePrice - (basePrice * highestDiscount / 100));

                if (productOfferDiscount > 0 || categoryOfferDiscount > 0) {
                    colorVariant.discountPercentage = highestDiscount;
                    colorVariant.discountPrice = Math.min(newDiscountPrice, 999); // Respect the max constraint
                } else {
                    colorVariant.discountPercentage = 0;
                    colorVariant.discountPrice = basePrice;
                }
            }

            await product.save();
        }

        return { success: true, message: 'Discount prices updated successfully' };
    } catch (error) {
        console.error('Error updating discount prices:', error);
        return { success: false, error: error.message };
    }
}


export async function handleExpiredOffers() {
    const currentDate = new Date();

    try {
        const expiredProductOffers = await ProductOffer.updateMany(
            {
                status: 'active',
                endDate: { $lt: currentDate }
            },
            {
                $set: { status: 'inactive' }
            }
        );

        const expiredCategoryOffers = await CategoryOffer.updateMany(
            {
                status: 'active',
                endDate: { $lt: currentDate }
            },
            {
                $set: { status: 'inactive' }
            }
        );

        if (expiredProductOffers.modifiedCount > 0 || expiredCategoryOffers.modifiedCount > 0) {
            await updateProductDiscounts();
            console.log(`Updated status for ${expiredProductOffers.modifiedCount} product offers and ${expiredCategoryOffers.modifiedCount} category offers that expired`);
        }

        return {
            success: true,
            expiredProductOffers: expiredProductOffers.modifiedCount,
            expiredCategoryOffers: expiredCategoryOffers.modifiedCount
        };
    } catch (error) {
        console.error('Error handling expired offers:', error);
        return { success: false, error: error.message };
    }
}


export const setupCronJobs = () => {
    cron.schedule('0 0 * * *', async () => {
        console.log('Running scheduled task: Handling expired offers');
        await handleExpiredOffers();
        console.log('Running scheduled task: Updating product discounts');
        await updateProductDiscounts();
    });

    cron.schedule('0 * * * *', async () => {
        console.log('Running hourly check for expired offers');
        await handleExpiredOffers();
    });

    console.log('Discount management cron jobs set up successfully');
};


export async function updateProductDiscountsForSingleProduct(productId) {
    try {
        const product = await Product.findById(productId);
        if (!product || product.deletedAt) {
            return { success: false, message: 'Product not found or deleted' };
        }

        const categoryId = product.category.toString();

        const productOffers = await ProductOffer.find({
            products: productId,
            status: 'active',
            startDate: { $lte: new Date() },
            endDate: { $gte: new Date() }
        });

        let categoryOffers = await CategoryOffer.find({
            category: categoryId,
            status: 'active',
            startDate: { $lte: new Date() },
            endDate: { $gte: new Date() }
        });

        categoryOffers = Array.isArray(categoryOffers) ? categoryOffers : [categoryOffers];

        let highestProductDiscount = 0;
        productOffers.forEach(offer => {
            if (offer.discount > highestProductDiscount) {
                highestProductDiscount = offer.discount;
            }
        });

        let highestCategoryDiscount = 0;
        categoryOffers.forEach(offer => {
            if (offer.discount > highestCategoryDiscount) {
                highestCategoryDiscount = offer.discount;
            }
        });

        for (const colorVariant of product.colors) {
            const basePrice = colorVariant.basePrice;

            if (productOffers.length === 0 && categoryOffers.length === 0) {
                colorVariant.discountPercentage = 0;
                colorVariant.discountPrice = basePrice;
            } else {
                const highestDiscount = Math.max(highestProductDiscount, highestCategoryDiscount);
                colorVariant.discountPercentage = highestDiscount;
                colorVariant.discountPrice = Math.floor(basePrice - (basePrice * highestDiscount / 100));

                colorVariant.discountPrice = Math.min(colorVariant.discountPrice, 999);
            }
        }

        await product.save();

        return { success: true, message: 'Product discount updated successfully' };
    } catch (error) {
        console.error('Error updating discount for single product:', error);
        return { success: false, error: error.message };
    }
}

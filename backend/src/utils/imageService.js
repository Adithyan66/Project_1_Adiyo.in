

import cloudinary from '../config/cloudinary.js';


export async function getSignedImageUrl(publicId) {
    try {
        const signedUrl = cloudinary.url(publicId, {
            resource_type: 'image',
            secure: true,
            sign_url: true,
        });

        return signedUrl;
    } catch (error) {
        console.error('Error in generating signed url:', error.message);
        return null;
    }
}

export const productsWithSignedUrls = (products) => {

    return Promise.all(
        products.map(async (product) => {
            const updatedColors = await Promise.all(
                (product.colors || []).map(async (color) => {
                    const signedUrls = await Promise.all(
                        (color.images || []).map((publicId) =>
                            getSignedImageUrl(publicId)
                        )
                    );

                    return {
                        ...color.toObject?.() || color,
                        images: signedUrls,
                    };
                })
            );

            return {
                ...product,
                colors: updatedColors,
            };
        })
    );
}


export const singleProductWithSignedUrls = async (productDoc) => {
    if (!productDoc || !productDoc.colors) return productDoc;

    const product = productDoc.toObject?.() || productDoc;

    const updatedColors = await Promise.all(
        product.colors.map(async (color) => {
            const signedUrls = await Promise.all(
                (color.images || []).map((publicId) =>
                    getSignedImageUrl(publicId)
                )
            );

            return {
                ...color.toObject?.() || color,
                images: signedUrls,
            };
        })
    );

    return {
        ...product,
        colors: updatedColors,
    };
};


export const attachSignedUrlsToOrders = async (orders) => {
    const plainOrders = orders.map(order => order.toJSON ? order.toJSON() : order);
    return Promise.all(
        plainOrders.map(async (order) => {
            const updatedItems = await Promise.all(
                order.orderItems.map(async (item) => {
                    const product = item.product;
                    if (!product?.colors) return item;

                    const updatedColors = await Promise.all(
                        product.colors.map(async (color) => {
                            if (Array.isArray(color.images)) {
                                const signedUrls = await Promise.all(
                                    color.images.map(publicId => getSignedImageUrl(publicId))
                                );
                                return { ...color, images: signedUrls.filter(url => url !== null) };
                            }
                            return color;
                        })
                    );

                    return {
                        ...item,
                        product: { ...product, colors: updatedColors },
                    };
                })
            );

            return {
                ...order,
                orderItems: updatedItems,
            };
        })
    );
};


export const attachSignedUrlsToCartItems = async (items) => {
    if (!Array.isArray(items)) {
        return items;
    }

    const updatedItems = await Promise.all(
        items.map(async (item) => {
            // Convert item to plain JSON if it's a Mongoose document
            const plainItem = item.toJSON ? item.toJSON() : item;
            const product = plainItem.product;
            if (!product?.colors) {
                console.log('No colors found for product:', product?._id);
                return plainItem;
            }

            const updatedColors = await Promise.all(
                product.colors.map(async (color) => {
                    if (Array.isArray(color.images)) {
                        const signedUrls = await Promise.all(
                            color.images.map(publicId => getSignedImageUrl(publicId))
                        );
                        const validUrls = signedUrls.filter(url => url !== null);
                        return { ...color, images: validUrls };
                    }
                    return color;
                })
            );

            return {
                ...plainItem,
                product: { ...product, colors: updatedColors },
            };
        })
    );

    return updatedItems;
};




export const attachSignedUrlsToWishlistItems = async (items) => {
    // Validate items
    if (!Array.isArray(items)) {
        return items;
    }


    const updatedItems = await Promise.all(
        items.map(async (item) => {
            // Convert item to plain JSON if it's a Mongoose document
            const plainItem = item.toJSON ? item.toJSON() : item;
            const product = plainItem.product;
            if (!product?.colors) {
                console.log('No colors found for product:', product?._id);
                return plainItem;
            }

            const updatedColors = await Promise.all(
                product.colors.map(async (color) => {
                    if (Array.isArray(color.images)) {
                        const signedUrls = await Promise.all(
                            color.images.map(publicId => getSignedImageUrl(publicId))
                        );
                        const validUrls = signedUrls.filter(url => url !== null);
                        return { ...color, images: validUrls };
                    }
                    return color;
                })
            );

            return {
                ...plainItem,
                product: { ...product, colors: updatedColors },
            };
        })
    );

    return updatedItems;
};




export const attachSignedUrlsToOrderItems = async (order) => {
    // Convert order to plain JSON if it's a Mongoose document
    const plainOrder = order.toJSON ? order.toJSON() : order;

    // Validate order and orderItems
    if (!plainOrder || !Array.isArray(plainOrder.orderItems)) {
        console.warn('Invalid order or missing orderItems:', plainOrder);
        return plainOrder;
    }


    const updatedItems = await Promise.all(
        plainOrder.orderItems.map(async (item) => {
            const product = item.product;
            if (!product?.colors) {
                console.log('No colors found for product:', product?._id);
                return item;
            }

            const updatedColors = await Promise.all(
                product.colors.map(async (color) => {
                    if (Array.isArray(color.images)) {
                        const signedUrls = await Promise.all(
                            color.images.map(publicId => getSignedImageUrl(publicId))
                        );
                        const validUrls = signedUrls.filter(url => url !== null);
                        return { ...color, images: validUrls };
                    }
                    return color;
                })
            );

            return {
                ...item,
                product: { ...product, colors: updatedColors },
            };
        })
    );

    return {
        ...plainOrder,
        orderItems: updatedItems,
    };
};




export const attachSignedUrlsToProduct = async (product) => {
    // Convert product to plain JSON if it's a Mongoose document
    const plainProduct = product.toJSON ? product.toJSON() : product;

    // Validate product and colors
    if (!plainProduct || !Array.isArray(plainProduct.colors)) {
        console.warn('Invalid product or missing colors:', plainProduct);
        return plainProduct;
    }


    const updatedColors = await Promise.all(
        plainProduct.colors.map(async (color) => {
            if (Array.isArray(color.images)) {
                const signedUrls = await Promise.all(
                    color.images.map(publicId => getSignedImageUrl(publicId))
                );
                const validUrls = signedUrls.filter(url => url !== null);
                return { ...color, images: validUrls };
            }
            return color;
        })
    );

    const updatedProduct = {
        ...plainProduct,
        colors: updatedColors,
    };

    return updatedProduct;
};
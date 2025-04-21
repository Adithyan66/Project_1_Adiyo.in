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
import Cart from "../models/cartSchema.js";
import Wishlist from "../models/wishListModel.js";
import { attachSignedUrlsToCartItems } from "../utils/imageService.js";




export const addCart = async (req, res) => {

    const userId = req.user.userId

    const {
        productId,
        selectedColor,
        selectedSize,
        quantity,
        removeFromWishlist
    } = req.body.data

    try {

        if (!productId || !selectedColor || !selectedSize || !quantity) {

            return res.status(BAD_REQUEST).json({
                success: false,
                message: "Missing required fields."
            });
        }

        const product = await Product.findById(productId);

        if (!product) {

            return res.status(NOT_FOUND).json({
                success: false,
                message: "product not found"
            })
        }

        if (product.deletedAt) {

            return res.status(BAD_REQUEST).json({
                success: false,
                message: "product not available"
            })
        }

        const colorVarient = product.colors.find(
            (col) => col.color.toLowerCase() === selectedColor.toLowerCase()
        )
        if (!colorVarient) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: "selected color varient not found"
            })
        }

        const variant = colorVarient.variants[selectedSize];

        if (!variant) {

            return res.status(BAD_REQUEST).json({
                status: false,
                message: "selected size not available"
            })
        }

        if (variant.stock < quantity) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: "Insufficient stock for the selected variant."
            });
        }

        if (removeFromWishlist) {
            const wishlist = await Wishlist.findOne({ user: req.user.userId });
            if (wishlist) {
                wishlist.items = wishlist.items.filter(
                    item => !(item.product.toString() === productId && item.selectedColor === selectedColor)
                );
                await wishlist.save();
            }
        }

        let cart = await Cart.findOne({ user: userId })

        if (!cart) {
            cart = new Cart({ user: userId, items: [] })
        }

        const existingItemIndex = cart.items.findIndex(
            (item) =>
                item.product.toString() === productId &&
                item.selectedColor.toLowerCase() === selectedColor.toLowerCase() &&
                item.selectedSize === selectedSize.toLowerCase()
        )

        const maxAllowed = 5;

        if (existingItemIndex > -1) {
            const cartItem = cart.items[existingItemIndex]
            const newQuantity = cartItem.quantity + quantity

            if (newQuantity > maxAllowed) {
                return res.status(BAD_REQUEST).json({
                    success: false,
                    message: "Reached maximum allowed quantity for this product"
                })
            }
            if (newQuantity > variant.stock) {
                return res.status(BAD_REQUEST).json({
                    success: false,
                    message: "Insufficient stock to add the requested quantity"
                })
            }

            cart.items[existingItemIndex].quantity = newQuantity

        } else {

            cart.items.push({
                product: new ObjectId(productId),
                selectedColor,
                selectedSize,
                quantity
            })
        }

        await cart.save()

        res.status(OK).json({
            success: true,
            message: "product added to cart succesfully"
        })

    } catch (error) {

        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "server error"
        })
    }
}


export const cartItems = async (req, res) => {

    const userId = req.user.userId

    try {
        if (!userId) {
            return res.status(UNAUTHORIZED).json({
                success: false,
                message: "Unauthorized User not authenticated"
            })
        }

        const cart = await Cart.findOne({ user: userId }).populate("items.product")

        if (!cart) {
            return res.status(OK).json({
                success: true,
                message: "cart is empty",
                items: []
            })
        }

        const cartItemsForRes = await attachSignedUrlsToCartItems(cart.items)

        res.status(OK).json({
            success: true,
            message: "cart items fetched succesfully",
            items: cartItemsForRes
        })

    } catch (error) {

        console.log(error)
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "server error"
        })
    }
}


export const removeCartItem = async (req, res) => {

    const { userId } = req.user

    const itemId = req.params.itemId

    try {

        if (!userId || !itemId) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: "not authorised or no cart Id"
            })
        }

        const cart = await Cart.findOne({ user: userId })

        if (!cart) {
            return res.status(NOT_FOUND).json({
                success: false,
                message: "cart not found"
            })
        }

        const removedItem = cart.items.pull(itemId)

        if (!removedItem) {
            return res.status(NOT_FOUND).json({
                status: false,
                message: "cart item not found",
            })
        }

        await cart.save()

        res.status(OK).json({
            success: true,
            message: "cart item removed"
        })

    } catch (error) {

        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "server error"
        })
    }
}

export const updateCartQuantity = async (req, res) => {

    try {

        if (!req.user || !req.user.userId) {
            return res.status(UNAUTHORIZED).json({
                success: false,
                message: "Unauthorized: User not authenticated"
            });
        }

        const userId = req.user.userId;
        const { itemId } = req.params;
        const { newQuantity } = req.body;

        if (!newQuantity || newQuantity < 1) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: "Invalid quantity. It must be at least 1"
            });
        }

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(NOT_FOUND).json({
                success: false,
                message: "Cart not found."
            });
        }

        const cartItem = cart.items.id(itemId);

        if (!cartItem) {
            return res.status(NOT_FOUND).json({
                success: false,
                message: "Cart item not found"
            });
        }

        const product = await Product.findById(cartItem.product);

        if (!product) {
            return res.status(NOT_FOUND).json({
                success: false,
                message: "Product not found"
            });
        }

        const selectedColor = product.colors.find(color => color.color === cartItem.selectedColor);

        if (!selectedColor) {
            return res.status(NOT_FOUND).json({
                success: false,
                message: "Selected color not found for this product"
            });
        }

        const selectedSizeKey = cartItem.selectedSize.toLowerCase();
        const selectedVariant = selectedColor.variants[selectedSizeKey];

        if (!selectedVariant) {
            return res.status(NOT_FOUND).json({
                success: false,
                message: "Selected size not found for this product color"
            });
        }

        if (newQuantity > selectedVariant.stock) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: `Only ${selectedVariant.stock} units available in stock`,
                availableStock: selectedVariant.stock
            });
        }

        cartItem.quantity = newQuantity;
        await cart.save();

        return res.status(OK).json({
            success: true,
            message: "Cart item quantity updated successfully."
        });

    } catch (error) {

        console.error("Error updating cart item quantity:", error);
        return res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Server error while updating cart item quantity."
        });
    }
}

export const checkCart = async (req, res) => {

    try {

        const userId = req.user.userId;

        const cart = await Cart.findOne({ user: userId })
            .populate({
                path: 'items.product',
                select: 'name size colors _id'
            });

        if (!cart) {
            return res.status(OK).json({
                status: true,
                cart: []
            });
        }

        return res.status(OK).json({
            status: true,
            cart: cart.items
        });

    } catch (error) {

        console.error("Error fetching cart:", error);
        return res.status(INTERNAL_SERVER_ERROR).json({
            status: false,
            message: "Server error"
        });
    }
};



export const deleteCart = async (req, res) => {

    try {

        const userId = req.user.userId;

        const result = await Cart.findOneAndUpdate(
            { user: userId },
            { $set: { items: [] } },
            { new: true }
        );

        if (!result) {
            return res.status(NOT_FOUND).json({
                success: false,
                message: 'Cart not found'
            });
        }

        return res.status(OK).json({
            success: true,
            message: 'Cart cleared successfully'
        });

    } catch (error) {

        console.error('Error clearing cart:', error);
        return res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Server error while clearing cart'
        });
    }
}



export const checkAvailability = async (req, res) => {
    try {
        const { items } = req.body;
        // items: [{ productId, selectedColor, selectedSize, quantity }, …]

        const availability = await Promise.all(items.map(async item => {

            const { productId, selectedColor, selectedSize, quantity } = item;

            const product = await Product.findById(productId)
                //    .select('colors')
                .lean();
            if (!product) {
                return { productId, productName: product.name, available: false, reason: 'Not found' };
            }

            const colorDoc = product.colors.find(c => c.color === selectedColor);
            if (!colorDoc) {
                return { productId, productName: product.name, available: false, reason: 'Color not available' };
            }

            const sizeKey = selectedSize.toLowerCase();
            const variant = colorDoc.variants?.[sizeKey];
            if (!variant) {
                return { productId, productName: product.name, available: false, reason: 'Size not available' };
            }

            const inStock = variant.stock >= quantity;
            return {
                productName: product.name,
                available: inStock,
                stock: variant.stock,
                reason: inStock ? null : 'Insufficient stock'
            };
        }));

        const status = availability.filter(product => product.available === false)

        console.log("statusssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss", status);


        if (status.length > 0) {
            return res.status(OK).json({ success: false, availability: status })
        }

        return res.status(OK).json({ success: true, availability });

    } catch (err) {
        console.error('Error in checkAvailability:', err);
        return res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Server error' });
    }
};

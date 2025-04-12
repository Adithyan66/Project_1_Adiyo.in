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


import Wishlist from "../models/wishListModel.js";



export const getWishlist = async (req, res) => {

    try {

        let wishlist = await Wishlist.findOne({ user: req.user.userId })
            .populate({
                path: 'items.product',
                select: 'name colors'
            });

        if (!wishlist) {
            wishlist = { items: [] };
        }

        res.status(OK).json({
            success: true,
            wishlist: wishlist.items
        });

    } catch (error) {
        console.error('Get wishlist error:', error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Server error'
        });
    }
}



export const addWishlist = async (req, res) => {

    try {
        const { productId, selectedColor } = req.body.data;

        let wishlist = await Wishlist.findOne({ user: req.user.userId });
        if (!wishlist) {
            wishlist = new Wishlist({
                user: req.user.userId,
                items: []
            });
        }

        const existingItemIndex = wishlist.items.findIndex(
            item => item.product.toString() === productId && item.selectedColor === selectedColor
        );

        if (existingItemIndex >= 0) {
            return res.status(OK).json({
                success: true,
                message: 'Item already in wishlist'
            });
        }

        wishlist.items.push({
            product: productId,
            selectedColor
        });

        await wishlist.save();

        res.status(CREATED).json({
            success: true,
            message: 'Item added to wishlist',
            wishlist
        });

    } catch (error) {

        console.error('Add to wishlist error:', error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Server error'
        });
    }
}


export const removeWishlistItem = async (req, res) => {

    try {
        const { productId, selectedColor } = req.body;

        const wishlist = await Wishlist.findOne({ user: req.user.userId });
        if (!wishlist) {
            return res.status(NOT_FOUND).json({
                success: false,
                message: 'Wishlist not found'
            });
        }

        wishlist.items = wishlist.items.filter(
            item => !(item.product.toString() === productId && item.selectedColor === selectedColor)
        );

        await wishlist.save();

        res.status(OK).json({
            success: true,
            message: 'Item removed from wishlist',
            wishlist
        });
    } catch (error) {
        console.error('Remove from wishlist error:', error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Server error'
        });
    }
}

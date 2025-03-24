import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_URL;

function Wishlist() {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${API_BASE_URL}/user/wishlist`, {
                withCredentials: true
            });

            if (response.data.success) {
                setWishlistItems(response.data.wishlist || []);
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            toast.error('Failed to load wishlist');
        } finally {
            setIsLoading(false);
        }
    };

    const removeFromWishlist = async (productId, selectedColor) => {
        const loadingKey = `${productId}-${selectedColor}`;
        try {
            setActionLoading({ ...actionLoading, [loadingKey]: true });

            const response = await axios.delete(`${API_BASE_URL}/user/wishlist/remove`, {
                data: {
                    productId: productId,
                    selectedColor: selectedColor
                },
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.data.success) {
                // Update the wishlist by filtering out the removed item
                setWishlistItems(wishlistItems.filter(item =>
                    !(item.product._id === productId && item.selectedColor === selectedColor)
                ));
                toast.success('Item removed from wishlist');
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            toast.error('Failed to remove item from wishlist');
        } finally {
            setActionLoading({ ...actionLoading, [loadingKey]: false });
        }
    };

    const addToCart = async (item) => {
        const loadingKey = `${item.product._id}-${item.selectedColor}-cart`;

        try {
            setActionLoading({ ...actionLoading, [loadingKey]: true });

            // For products that require size selection (like clothing)
            if (item.product.colors.some(color =>
                color.color === item.selectedColor &&
                Object.keys(color.variants || {}).length > 0
            )) {
                // Navigate to product detail page for size selection
                navigate(`/product/${item.product._id}`);
                return;
            }

            // For products that don't need size selection
            const response = await axios.post(`${API_BASE_URL}/user/cart/add`, {
                productId: item.product._id,
                selectedColor: item.selectedColor,
                selectedSize: item.selectedSize || '',
                quantity: 1,
                removeFromWishlist: true
            }, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.data.success) {
                // Remove item from wishlist since we added to cart
                setWishlistItems(wishlistItems.filter(wishlistItem =>
                    !(wishlistItem.product._id === item.product._id &&
                        wishlistItem.selectedColor === item.selectedColor)
                ));
                toast.success('Item moved to cart');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Failed to add item to cart');
        } finally {
            setActionLoading({ ...actionLoading, [loadingKey]: false });
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8 mt-[150px] flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    if (wishlistItems.length === 0) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8 mt-[150px] text-center">
                <h1 className="text-2xl font-bold mb-4">Your Wishlist</h1>
                <div className="p-8 border border-gray-300 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                    <p className="mt-4 text-lg">Your wishlist is empty</p>
                    <Link to="/products-list" className="mt-6 inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 ">
            <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistItems.map((item, index) => {
                    // Find the color object from the product
                    const colorObject = item.product.colors.find(c => c.color === item.selectedColor);
                    const loadingKey = `${item.product._id}-${item.selectedColor}`;
                    const cartLoadingKey = `${item.product._id}-${item.selectedColor}-cart`;

                    return (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="relative">
                                {/* Product Image */}
                                <Link to={`/product-detail/${item.product._id}`}>
                                    <img
                                        src={colorObject?.images?.[0] || '/placeholder-image.jpg'}
                                        alt={item.product.name}
                                        className="w-full h-64 object-cover"
                                    />
                                </Link>

                                {/* Remove button */}
                                <button
                                    onClick={() => removeFromWishlist(item.product._id, item.selectedColor)}
                                    disabled={actionLoading[loadingKey]}
                                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                                >
                                    {actionLoading[loadingKey] ? (
                                        <span className="block w-6 h-6 rounded-full animate-pulse bg-gray-200"></span>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24" strokeWidth={1.5} stroke="black" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            <div className="p-4">
                                {/* Product Info */}
                                <h3 className="font-medium text-lg mb-2">{item.product.name}</h3>

                                {/* Color display */}
                                <div className="flex items-center mb-3">
                                    <span className="mr-2 text-gray-600 text-sm">Color:</span>
                                    <div
                                        className="w-6 h-6 rounded-full border border-gray-300"
                                        style={{ backgroundColor: item.selectedColor }}
                                    ></div>
                                </div>

                                {/* Price (if available in colorObject) */}
                                {colorObject?.discountPrice && (
                                    <div className="flex items-center space-x-2 mb-4">
                                        <span className="font-semibold">₹{colorObject.discountPrice}</span>
                                        {colorObject.basePrice && (
                                            <>
                                                <span className="text-gray-500 line-through text-sm">₹{colorObject.basePrice}</span>
                                                <span className="text-red-500 text-sm">
                                                    -{Math.ceil(colorObject.discountPercentage || 0)}%
                                                </span>
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* Action buttons */}
                                <div className="flex space-x-2 mt-2">
                                    <button
                                        onClick={() => addToCart(item)}
                                        disabled={actionLoading[cartLoadingKey]}
                                        className="flex-1 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                                    >
                                        {actionLoading[cartLoadingKey] ? (
                                            <span className="flex justify-center">
                                                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                                            </span>
                                        ) : (
                                            "Move to Cart"
                                        )}
                                    </button>

                                    <Link
                                        to={`/product-detail/${item.product._id}`}
                                        className="flex-1 text-center py-2 border border-black text-black rounded-md hover:bg-black hover:text-white transition-colors"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 flex justify-center">
                <Link to="/" className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
}

export default Wishlist;
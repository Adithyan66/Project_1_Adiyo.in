


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { WalletIcon, Heart, ShoppingCart, Info } from 'lucide-react';
import { removeFromWishlist as removeFromWishlistService } from '../../../services/wishlistService';
import { addToCart as addToCartService } from '../../../services/cartService';

const API_BASE_URL = import.meta.env.VITE_API_URL;

function Wishlist() {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');
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

            // const response = await axios.delete(`${API_BASE_URL}/user/wishlist/remove`, {
            //     data: {
            //         productId: productId,
            //         selectedColor: selectedColor
            //     },
            //     withCredentials: true,
            //     headers: {
            //         "Content-Type": "application/json"
            //     }
            // });
            const data = {
                productId: productId,
                selectedColor: selectedColor
            }

            const response = await removeFromWishlistService(data);

            if (response.data.success) {
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
                navigate(`/product/${item.product._id}`);
                return;
            }

            // For products that don't need size selection
            // const response = await axios.post(`${API_BASE_URL}/user/cart/add`, {
            //     productId: item.product._id,
            //     selectedColor: item.selectedColor,
            //     selectedSize: item.selectedSize || '',
            //     quantity: 1,
            //     removeFromWishlist: true
            // }, {
            //     withCredentials: true,
            //     headers: {
            //         "Content-Type": "application/json"
            //     }
            // });

            const data = {
                productId: item.product._id,
                selectedColor: item.selectedColor,
                selectedSize: item.selectedSize || '',
                quantity: 1,
                removeFromWishlist: true
            }
            const response = await addToCartService(data)

            if (response.data.success) {
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

    const filteredWishlist = wishlistItems.filter(item =>
        item.product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex-1 p-6 bg-white m-6 rounded-md shadow-sm min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-6 bg-white m-6 rounded-md shadow-sm min-h-screen">
            {/* Header Section */}
            <div className="bg-gray-50 p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Heart className="mr-3 text-gray-800" size={24} />
                        <h2 className="text-2xl font-semibold text-gray-900">My Wishlist</h2>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="bg-black text-white px-4 py-1 rounded-full text-sm font-medium">
                            {wishlistItems.length} items
                        </span>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                    <div className="relative w-full md:w-72">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Info size={18} className="text-gray-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search wishlist items..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Empty Wishlist State */}
            {wishlistItems.length === 0 && (
                <div className="text-center py-16">
                    <Heart size={64} className="mx-auto text-gray-300 mb-6" />
                    <p className="text-xl text-gray-700 font-medium mb-2">Your wishlist is empty</p>
                    <p className="text-gray-500 mb-6">
                        Explore our products and add items you love
                    </p>
                    <Link
                        to="/products-list"
                        className="bg-black text-white px-8 py-3 rounded-lg text-md font-medium hover:bg-gray-800 transition-colors duration-200"
                    >
                        Continue Shopping
                    </Link>
                </div>
            )}

            {/* Wishlist Items */}
            {wishlistItems.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
                    {filteredWishlist.map((item, index) => {
                        const colorObject = item.product.colors.find(c => c.color === item.selectedColor);
                        const loadingKey = `${item.product._id}-${item.selectedColor}`;
                        const cartLoadingKey = `${item.product._id}-${item.selectedColor}-cart`;

                        return (
                            <div
                                key={index}
                                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="relative">
                                    <Link to={`/product-detail/${item.product._id}`}>
                                        <img
                                            src={colorObject?.images?.[0] || '/placeholder-image.jpg'}
                                            alt={item.product.name}
                                            className="w-full h-64 object-cover rounded-t-lg"
                                        />
                                    </Link>
                                    <button
                                        onClick={() => removeFromWishlist(item.product._id, item.selectedColor)}
                                        disabled={actionLoading[loadingKey]}
                                        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                                    >
                                        {actionLoading[loadingKey] ? (
                                            <span className="block w-6 h-6 rounded-full animate-pulse bg-gray-200"></span>
                                        ) : (
                                            <Heart size={20} className="text-gray-600" fill="currentColor" />
                                        )}
                                    </button>
                                </div>

                                <div className="p-4">
                                    <h3 className="font-medium text-lg mb-2">{item.product.name}</h3>

                                    <div className="flex items-center mb-3">
                                        <span className="mr-2 text-gray-600 text-sm">Color:</span>
                                        <div
                                            className="w-6 h-6 rounded-full border border-gray-300"
                                            style={{ backgroundColor: item.selectedColor }}
                                        ></div>
                                    </div>

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

                                    <div className="flex space-x-2 mt-2">
                                        <button
                                            onClick={() => addToCart(item)}
                                            disabled={actionLoading[cartLoadingKey]}
                                            className="flex-1 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center"
                                        >
                                            {actionLoading[cartLoadingKey] ? (
                                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                            ) : (
                                                <>
                                                    <ShoppingCart size={16} className="mr-2 ml-2" />
                                                    Move to Cart
                                                </>
                                            )}
                                        </button>

                                        <Link
                                            to={`/product-detail/${item.product._id}`}
                                            className="flex-1 text-center py-2 border border-black text-black rounded-md hover:bg-black hover:text-white transition-colors flex items-center justify-center"
                                        >
                                            <Info size={16} className="mr-2" />
                                            Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {filteredWishlist.length === 0 && wishlistItems.length > 0 && (
                <div className="text-center py-16">
                    <Info size={64} className="mx-auto text-gray-300 mb-6" />
                    <p className="text-xl text-gray-700 font-medium mb-2">No items match your search</p>
                    <p className="text-gray-500 mb-6">
                        Try adjusting your search or browse our products
                    </p>
                    <Link
                        to="/products-list"
                        className="bg-black text-white px-8 py-3 rounded-lg text-md font-medium hover:bg-gray-800 transition-colors duration-200"
                    >
                        Continue Shopping
                    </Link>
                </div>
            )}
        </div>
    );
}

export default Wishlist;
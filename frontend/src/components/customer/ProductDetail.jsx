

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumbs from "./productlist/BreadCrumbs";
import axios from "axios";
import { toast } from "react-toastify";
import greenArrow from "../../assets/images/greenArrow.webp"

import { setProduct } from "../../store/slices/checkoutSlice";
import { productOffers } from "../../services/productService";
import { addToWishlist, checkProductInWishlist, removeFromWishlist } from "../../services/wishlistService";
import { addToCart, checkUserCart } from "../../services/cartService";
import { useSelector, useDispatch } from "react-redux";
import { setLoginPopup, setActiveForm } from "../../store/slices/authModalSlice.js"

const API_BASE_URL = import.meta.env.VITE_API_URL;

function ProductDetail({ product }) {


    const navigate = useNavigate();
    const dispatch = useDispatch();


    const user = useSelector((state) => state.user.userInfo)


    const [selectedColorIndex, setSelectedColorIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState("");
    const [isHovering, setIsHovering] = useState(false);
    const [isInCart, setIsInCart] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedSize, setSelectedSize] = useState("");
    const [color, setColor] = useState(product.colors[0].color);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    const [availableOffers, setAvailableOffers] = useState([]);
    const [offersLoading, setOffersLoading] = useState(false);

    useEffect(() => {
        if (product.colors && product.colors.length > 0) {
            const firstImage = product.colors[selectedColorIndex].images[0];
            setSelectedImage(firstImage);
        }

        checkIfProductInCart();
        checkIfProductInWishlist();
        fetchAvailableOffers();
    }, [product, selectedColorIndex]);


    const fetchAvailableOffers = async () => {
        setOffersLoading(true);
        try {
            // const response = await axios.get(`${API_BASE_URL}/user/offers/product/${product._id}`, {
            //     withCredentials: true
            // });

            const response = await productOffers(product._id);

            const offers = response.data.offers || [];

            setAvailableOffers(offers);

        } catch (error) {
            console.error("Error fetching offers:", error);
            toast.error("Failed to fetch available offers");
        } finally {
            setOffersLoading(false);
        }
    };


    const checkIfProductInWishlist = async () => {
        try {
            // const response = await axios.get(`${API_BASE_URL}/user/wishlist`, {
            //     withCredentials: true
            // });

            const response = await checkProductInWishlist()

            const wishlist = response.data.wishlist || [];
            const isProductWishlisted = wishlist.some(item =>
                item.product._id === product._id &&
                item.selectedColor === product.colors[selectedColorIndex].color
            );


            setIsWishlisted(isProductWishlisted);

        } catch (error) {

            console.error("Error checking wishlist:", error);
        }
    };


    const toggleWishlist = async () => {

        if (!user) {
            toast.error("login first")
            return
        }
        setWishlistLoading(true);
        try {
            const data = {
                productId: product._id,
                selectedColor: selectedColor.color,
            }
            if (isWishlisted) {
                await removeFromWishlist(data);
                toast.success("Removed from wishlist");
            } else {
                await addToWishlist(data)
                toast.success("Added to wishlist");
            }
            setIsWishlisted(!isWishlisted);

        } catch (error) {
            console.error("Error updating wishlist:", error);
            toast.error("Failed to update wishlist");
        } finally {
            setWishlistLoading(false);
        }
    };

    const handleBuynow = () => {
        if (!user) {
            toast.error("login first")
            return
        }

        if (selectedSize === "") return toast.error("select a size");

        const selectedColorVariant = product.colors.find(c => c.color === color);
        if (!selectedColorVariant) {
            return toast.error("Color not available");
        }

        const getSizeKey = (size) => {
            switch (size.toLowerCase()) {
                case 'small': return 'small';
                case 's': return 'small';
                case 'medium': return 'medium';
                case 'm': return 'medium';
                case 'large': return 'large';
                case 'l': return 'large';
                case 'extra large': return 'extralarge';
                case 'xl': return 'extralarge';
                default: return size.toLowerCase();
            }
        };

        // Get the correct variant based on size
        const sizeKey = getSizeKey(selectedSize);
        const selectedVariant = selectedColorVariant.variants[sizeKey];

        if (!selectedVariant) {
            return toast.error("Size not available");
        }

        // Check if the product is in stock
        if (selectedVariant.stock <= 0) {
            return toast.error("This product is out of stock");
        }

        console.log("selectedSize", selectedSize);

        dispatch(setProduct({
            product: product,
            productColor: color,
            productSize: selectedSize.toLowerCase()
        }));

        navigate("/user/check-out");
    }

    const checkIfProductInCart = async () => {
        try {
            // const response = await axios.get(`${API_BASE_URL}/user/check-cart`, {
            //     withCredentials: true
            // });

            const response = await checkUserCart()

            const cart = response.data.cart || [];

            const isProductInCart = cart.some(item =>
                item.product._id === product._id
                &&
                item.selectedColor === product.colors[selectedColorIndex].color
                &&
                (selectedSize ? item.selectedSize === selectedSize.toLowerCase().replace(/\s+/g, '') : false)
            );

            setIsInCart(isProductInCart);
        } catch (error) {
            console.error("Error checking cart:", error);
        }
    };

    const selectedColor =
        product.colors && product.colors.length > 0
            ? product.colors[selectedColorIndex]
            : null;

    const availableSizes =
        selectedColor && selectedColor.variants
            ? Object.values(selectedColor.variants)
                .filter((variant) => parseInt(variant.stock, 10) > 0)
                .map((variant) => variant.size)
            : [];


    useEffect(() => {
        if (selectedSize) {
            checkIfProductInCart();
        }
    }, [selectedSize]);



    const handleAddtoCart = async () => {

        if (!user) {
            toast.error("login first")
            return
        }

        if (isInCart) {
            navigate("/user/view-cart");
            return;
        }

        if (!selectedSize) {
            toast.error("Please select a size");
            return;
        }

        setIsLoading(true);

        try {
            console.log(selectedSize.toLowerCase().replace(/\s+/g, ''));

            const moveFromWishlist = isWishlisted;

            const data = {
                productId: product._id,
                selectedColor: selectedColor.color,
                selectedSize: selectedSize.toLowerCase().replace(/\s+/g, ''),
                quantity: 1,
                removeFromWishlist: moveFromWishlist
            }
            const response = await addToCart(data)

            console.log(response.data);
            setIsInCart(true);

            // If it was in wishlist, update the wishlist status
            if (moveFromWishlist) {
                setIsWishlisted(false);
                toast.info("Product moved from wishlist to cart");
            }
        } catch (error) {
            console.log("Error adding to cart:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const SimpleImageZoom = ({ src }) => {
        return (
            <div
                className="relative w-full overflow-hidden"
                style={{ height: "500px" }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                <img
                    src={src}
                    alt="Product"
                    className="w-full h-full object-contain transition-transform duration-300"
                    style={{
                        transform: isHovering ? 'scale(1.8)' : 'scale(1)',
                        transformOrigin: 'center center'
                    }}
                />
            </div>
        );
    };



    return (
        <div className="max-w-6xl mx-auto px-4 py-8 mt-[150px]">
            {/* Breadcrumbs */}
            <Breadcrumbs product={product} />

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* LEFT COLUMN: Main image + thumbnails */}
                <div className="flex flex-col items-center">
                    {/* Main Image with Simple Zoom */}
                    <div className="relative w-full">
                        <SimpleImageZoom src={selectedImage} />
                        <button
                            onClick={toggleWishlist}
                            disabled={wishlistLoading}
                            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all"
                        >
                            {wishlistLoading ? (
                                <span className="animate-pulse">...</span>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill={isWishlisted ? "black" : "none"}
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke={isWishlisted ? "black" : "gray"}
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Thumbnails */}
                    <div className="flex space-x-4 mt-4 self-start">
                        {selectedColor &&
                            selectedColor.images.map((image, index) => (
                                <div
                                    key={index}
                                    className={`border ${selectedImage === image ? "border-black" : "border-gray-300"} rounded p-1 cursor-pointer`}
                                    onClick={() => setSelectedImage(image)}
                                >
                                    <img src={image} alt={`Thumb ${index + 1}`} className="w-20 h-auto object-cover" />
                                </div>
                            ))}
                    </div>
                    {/* Action Buttons */}
                    <div className="mt-12 flex space-x-4">
                        <button
                            className={`border border-black text-black  px-8 py-3 text-lg rounded-md transition-colors hover:cursor-pointer ${isInCart ? "bg-gray-200" : "hover:bg-black hover:text-white"
                                }`}
                            onClick={() => {
                                handleAddtoCart()
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? "Processing..." : isInCart ? "View Cart" : "Add to Cart"}
                        </button>
                        <button className="bg-black text-white px-8 py-3 ml-5 text-lg rounded-md hover:bg-gray-800 transition-colors hover:cursor-pointer"
                            onClick={() => {
                                handleBuynow()
                            }}
                        >
                            Buy Now
                        </button>
                    </div>
                </div>

                {/* RIGHT COLUMN: Product Info */}
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{product.name}</h1>
                    <div className="flex items-center space-x-2 mt-2">
                        <div className="text-yellow-500 text-lg">★★★★☆</div>
                        <span className="text-gray-600 text-sm">4.5/5</span>
                    </div>

                    {selectedColor && (
                        <div className="mt-4 flex items-center space-x-2">
                            <span className="text-2xl font-semibold">₹ {selectedColor.discountPrice}</span>
                            <span className="text-gray-500 line-through">₹ {selectedColor.basePrice}</span>
                            <span className="text-red-500 text-sm font-semibold">
                                -{Math.ceil(selectedColor.discountPercentage)}%
                            </span>
                        </div>
                    )}

                    <p className="mt-4 text-gray-700 leading-relaxed">{product.shortDescription}</p>
                    <hr className="border-t border-gray-300 my-4" />

                    {/* Color Selection */}
                    {product.colors && product.colors.length > 0 && (
                        <div className="my-4">
                            <h3 className="font-semibold text-gray-500 mb-4">Choose Color</h3>
                            <div className="flex space-x-3 mt-2">
                                {product.colors.map((col, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setSelectedColorIndex(index);
                                            setSelectedImage(product.colors[index].images[0]);
                                            setSelectedSize("");
                                            setIsInCart(false);
                                            setColor(col.color);
                                            // We need to check wishlist status for the new color
                                            checkIfProductInWishlist();
                                        }}
                                        style={{ backgroundColor: col.color }}
                                        className={`w-12 h-12 border-2  rounded-full hover:cursor-pointer ${index === selectedColorIndex ? "border-black border-5" : "border-gray-300"}`}
                                    ></button>
                                ))}
                            </div>
                        </div>
                    )}

                    <hr className="border-t border-gray-300 my-4" />

                    {/* Size Selection */}
                    <div className="mt-6">
                        <h3 className="font-semibold text-gray-500">Choose Size</h3>
                        <div className="flex space-x-3 mt-2">
                            {availableSizes.length > 0 ? (
                                availableSizes.map((size, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedSize(size)}
                                        className={`px-4 py-2 border border-gray-300 rounded-3xl  hover:cursor-pointer ${selectedSize === size ? 'bg-black text-white' : 'bg-gray-100'}`}
                                    >
                                        {size}
                                    </button>
                                ))
                            ) : (
                                <p className="text-gray-600">Out of stock</p>
                            )}
                        </div>
                    </div>

                    <hr className="border-t border-gray-300 my-4" />

                    {/* Offers Section - Add this after the Delivery Info section */}
                    <div className="mt-6">
                        <h3 className="font-semibold text-gray-500">Available Offers</h3>
                        {offersLoading ? (
                            <p className="text-gray-600">Loading offers...</p>
                        ) : availableOffers.length > 0 ? (
                            <ul className="space-y-2 mt-2">
                                {availableOffers.map((offer, index) => (

                                    <li
                                        key={index}
                                        className="  rounded-md "
                                    >
                                        <div className="flex">
                                            <img src={greenArrow} alt="" className="w-4 h-4 mr-3" />
                                            <span className="font-semibold mr-1">
                                                {offer.name}:
                                            </span>{"  "}
                                            {offer.discount} % off
                                            {" "}
                                            <span className="text-sm text-gray-600 ml-2">
                                                (Valid until {new Date(offer.endDate).toLocaleDateString()})
                                            </span>
                                        </div>

                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-600">No offers available for this product.</p>
                        )}
                    </div>
                    <hr className="border-t border-gray-300 my-4" />


                    {/* Delivery Info */}
                    <div className="mt-6">
                        <h3 className="font-semibold text-gray-500">Delivery to</h3>
                        <div className="flex items-center space-x-2 mt-2">
                            <input
                                type="text"
                                placeholder="Enter pincode here"
                                className="border border-gray-300 rounded px-3 py-2 focus:outline-none"
                            />
                            <button className="px-4 py-2 border border-gray-300 rounded-md bg-gray-200 hover:bg-gray-300 hover:cursor-pointer">
                                Check
                            </button>
                        </div>
                        <p className="text-gray-600 mt-2">Delivery by 22 Feb, Saturday</p>
                        <p className="text-gray-600 mt-1">
                            Seller <span className="font-medium">Adithyan Binu</span>{" "}
                            <span className="text-sm">(3.5)</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
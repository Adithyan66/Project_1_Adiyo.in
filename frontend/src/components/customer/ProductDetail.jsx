

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "./productlist/BreadCrumbs";

function ProductDetail({ product }) {
    const [selectedColorIndex, setSelectedColorIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState("");
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        if (product.colors && product.colors.length > 0) {
            const firstImage = product.colors[selectedColorIndex].images[0];
            setSelectedImage(firstImage);
        }
    }, [product, selectedColorIndex]);

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

    // Simple Image Zoom Component
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
                    <SimpleImageZoom src={selectedImage} />

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
                                        }}
                                        style={{ backgroundColor: col.color }}
                                        className={`w-12 h-12 border-2 rounded-full ${index === selectedColorIndex ? "border-black" : "border-gray-300"}`}
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
                                        className="px-4 py-2 border border-gray-300 rounded-3xl bg-gray-100 hover:bg-gray-200"
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

                    {/* Delivery Info */}
                    <div className="mt-6">
                        <h3 className="font-semibold text-gray-500">Delivery to</h3>
                        <div className="flex items-center space-x-2 mt-2">
                            <input
                                type="text"
                                placeholder="Enter pincode here"
                                className="border border-gray-300 rounded px-3 py-2 focus:outline-none"
                            />
                            <button className="px-4 py-2 border border-gray-300 rounded-md bg-gray-200 hover:bg-gray-300">
                                Check
                            </button>
                        </div>
                        <p className="text-gray-600 mt-2">Delivery by 22 Feb, Saturday</p>
                        <p className="text-gray-600 mt-1">
                            Seller <span className="font-medium">Adithyan Binu</span>{" "}
                            <span className="text-sm">(3.5)</span>
                        </p>
                    </div>

                    <hr className="border-t border-gray-300 my-4" />

                    {/* Action Buttons */}
                    <div className="mt-6 flex space-x-4">
                        <button className="border border-black text-black px-8 py-3 text-lg rounded-md hover:bg-black hover:text-white transition-colors">
                            Add to Cart
                        </button>
                        <button className="bg-black text-white px-8 py-3 text-lg rounded-md hover:bg-gray-800 transition-colors">
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
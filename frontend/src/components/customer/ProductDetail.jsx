import React, { useState } from "react";

function ProductDetail() {
    // Default main image URL
    const defaultImage =
        "https://res.cloudinary.com/dry8cpqvg/image/upload/v1740948329/Adiyo/productsImages/k6isqzmhi50otd3txopa.avif"
    // Array of image URLs for thumbnails (using different URLs for demonstration)
    const images = [
        defaultImage,
        "https://res.cloudinary.com/dry8cpqvg/image/upload/v1740948329/Adiyo/productsImages/wyndtj959emxshw7v7f7.avif",
        "https://res.cloudinary.com/dry8cpqvg/image/upload/v1740948329/Adiyo/productsImages/zcm0mapzcbbh5pn0kg0j.avif",
        "https://res.cloudinary.com/dry8cpqvg/image/upload/v1740948329/Adiyo/productsImages/ia47nr7wyrsfaafx4vya.avif",
        "https://res.cloudinary.com/dry8cpqvg/image/upload/v1740948329/Adiyo/productsImages/zupfkd9wwjcfz7vp8wxn.avif",
    ];

    // State for the currently selected (big) image
    const [selectedImage, setSelectedImage] = useState(defaultImage);

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 mt-[150px]">
            {/* Main container: 2 columns on medium+ screens */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                {/* LEFT COLUMN: One main image on top + thumbnails */}
                <div className="flex flex-col items-center">
                    {/* Main Image Container with fixed height */}
                    <div className="relative w-full h-135 bg-gray-100 rounded shadow-sm overflow-hidden flex items-center justify-center">
                        <img
                            src={selectedImage}
                            alt="Main Product"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Thumbnails */}
                    <div className="flex space-x-4 mt-4">
                        {images.map((image, index) => (
                            <div
                                key={index}
                                className={`border ${selectedImage === image ? "border-black" : "border-gray-300"
                                    } rounded p-1 cursor-pointer`}
                                onMouseEnter={() => setSelectedImage(image)}
                            >
                                <img
                                    src={image}
                                    alt={`Thumb${index + 1}`}
                                    className="w-20 h-auto"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT COLUMN: Product Info */}
                <div>
                    {/* Title & Rating */}
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        One Life Graphic T-shirt
                    </h1>
                    <div className="flex items-center space-x-2 mt-2">
                        <div className="text-yellow-500 text-lg">★★★★☆</div>
                        <span className="text-gray-600 text-sm">4.5/5</span>
                    </div>

                    {/* Price & Discount */}
                    <div className="mt-4 flex items-center space-x-2">
                        <span className="text-2xl font-semibold">$260</span>
                        <span className="text-gray-500 line-through">$300</span>
                        <span className="text-red-500 text-sm font-semibold">-40%</span>
                    </div>

                    {/* Description */}
                    <p className="mt-4 text-gray-700 leading-relaxed">
                        This graphic t-shirt is perfect for any occasion. Crafted from a soft
                        and breathable fabric, it offers superior comfort and style.
                    </p>

                    <hr className="border-t border-gray-300 my-4" />

                    {/* Select Colors */}
                    <div className="mt-6">
                        <h3 className="font-semibold text-gray-800">Select Colors</h3>
                        <div className="flex space-x-2 mt-2">
                            <div className="w-6 h-6 rounded-full bg-green-500 border border-gray-300 cursor-pointer" />
                            <div className="w-6 h-6 rounded-full bg-blue-500 border border-gray-300 cursor-pointer" />
                            <div className="w-6 h-6 rounded-full bg-red-500 border border-gray-300 cursor-pointer" />
                        </div>
                    </div>

                    <hr className="border-t border-gray-300 my-4" />

                    {/* Choose Size */}
                    <div className="mt-6">
                        <h3 className="font-semibold text-gray-800">Choose Size</h3>
                        <div className="flex space-x-3 mt-2">
                            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
                                Small
                            </button>
                            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
                                Medium
                            </button>
                            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
                                Large
                            </button>
                            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
                                X-Large
                            </button>
                        </div>
                    </div>

                    <hr className="border-t border-gray-300 my-4" />

                    {/* Delivery Info */}
                    <div className="mt-6">
                        <h3 className="font-semibold text-gray-800">Delivery to</h3>
                        <div className="flex items-center space-x-2 mt-2">
                            <input
                                type="text"
                                placeholder="Enter pincode here"
                                className="border border-gray-300 rounded px-3 py-2 focus:outline-none"
                            />
                            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
                                Check
                            </button>
                        </div>
                        <p className="text-gray-600 mt-2">Delivery by 22 Feb, Saturday</p>
                        <p className="text-gray-600 mt-1">
                            Seller <span className="font-medium">Adithyan Binu</span>{" "}
                            <span className="text-sm">(3.5)</span>
                        </p>
                    </div>

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

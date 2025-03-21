import React from "react";
import { useNavigate } from "react-router-dom";

function LandingProductCard({ image, title, price, oldPrice, rating, id }) {


    const navigate = useNavigate();

    // Calculate discount percentage if both prices are provided
    const discountPercentage = oldPrice && price ?
        Math.ceil(((oldPrice - price) / oldPrice) * 100) : 0;

    // Default rating if not provided
    const productRating = rating || 3.5;

    // Handle navigation to product detail page
    const handleProductClick = (id) => {
        console.log(id);


        navigate(`/product-detail/${id}`);
    };

    return (
        <div
            className="rounded-md p-4 flex flex-col bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleProductClick(id)}
        >
            <img
                src={image}
                alt={title}
                className="w-full h-90 object-cover mb-2 mx-auto rounded-2xl"
            />
            <h3 className="text-base font-semibold text-gray-800 line-clamp-1">{title}</h3>

            {/* Rating */}
            <div className="flex items-center mt-1">
                <div className="text-yellow-500 mr-2">
                    {"★".repeat(Math.floor(productRating))}
                    {productRating % 1 >= 0.5 ? "★" : ""}
                    {"☆".repeat(5 - Math.ceil(productRating))}
                </div>
                <span className="text-sm text-gray-500">{productRating} / 5</span>
            </div>

            {/* Discount Tag */}
            {discountPercentage > 0 && (
                <span className="bg-gray-400 w-1/4 text-center py-2 text-white text-xs ml-2 px-1 rounded">
                    {discountPercentage}% off
                </span>
            )}

            {/* Price Section */}
            <div className="mt-2 text-gray-800">
                <span className="font-bold text-3xl">₹{price}</span>
                {oldPrice && oldPrice > price && (
                    <span className="text-xl text-gray-500 ml-2 line-through">
                        ₹{oldPrice}
                    </span>
                )}
            </div>
        </div>
    );
}

export default LandingProductCard;
import React from "react";

function ProductCard({ image, title, price, rating, oldPrice }) {
  // Calculate discount percentage if oldPrice is provided
  const discountPercentage =
    oldPrice && Math.round(((oldPrice - price) / oldPrice) * 100);

  return (
    <div className="rounded-md p-4 flex flex-col bg-white shadow-sm hover:shadow-md transition-shadow">
      <img
        src={image}
        alt={title}
        className="w-full h-60 object-cover mb-2 mx-auto rounded-2xl"
      />
      <h3 className="text-base font-semibold text-gray-800">{title}</h3>
      {/* Rating */}
      <div className="flex items-center mt-1">
        <div className="text-yellow-500 mr-2">
          {"★".repeat(rating)}
          {"☆".repeat(5 - rating)}
        </div>
        <span className="text-sm text-gray-500">{rating}.0 / 5</span>
      </div>
      {/* Price Section */}
      <div className="mt-2 text-gray-800">
        <span className="font-bold text-3xl">₹{price}</span>
        {oldPrice && (
          <>
            <span className="text-xl text-gray-500 ml-2 line-through">
              ₹{oldPrice}
            </span>
            <span className="bg-red-500 text-white text-xs ml-2 px-1 py-0.5 rounded">
              {discountPercentage}% off
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export default ProductCard;

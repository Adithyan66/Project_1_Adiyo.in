import React from "react";
import { useNavigate } from "react-router-dom";




function ProductCard({ product }) {



  const navigate = useNavigate()


  const rating = 3.5;

  return (
    <div className="rounded-md p-4 flex flex-col bg-white shadow-sm hover:shadow-md transition-shadow"
      onClick={() => {
        navigate(`/product-detail/${product._id}`)
      }}
    >
      <img
        src={product?.colors[0].images[0]}
        //alt={title}
        className="w-full h-90 object-cover mb-2 mx-auto rounded-2xl"
      />
      <h3 className="text-base font-semibold text-gray-800 line-clamp-1">{product?.name}</h3>
      {/* Rating */}
      <div className="flex items-center mt-1">
        <div className="text-yellow-500 mr-2">
          {"★".repeat(rating)}
          {"☆".repeat(5 - rating)}
        </div>
        <span className="text-sm text-gray-500">{rating} / 5</span>
      </div>
      {/* Price Section */}
      <span className="bg-gray-400 w-1/4 text-center py-2 text-white text-xs ml-2 px-1 rounded">
        {Math.ceil(product?.colors[0].discountPercentage)}% off
      </span>
      <div className="mt-2 text-gray-800">
        <span className="font-bold text-3xl">₹{product?.minDiscountPrice}</span>
        {product?.colors[0].basePrice && (
          <>
            <span className="text-xl text-gray-500 ml-2 line-through">
              ₹{product?.colors[0].basePrice}
            </span>

          </>
        )}
      </div>
    </div>
  );
}

export default ProductCard;

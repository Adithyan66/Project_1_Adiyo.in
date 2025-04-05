// import React from "react";
// import { useNavigate } from "react-router-dom";




// function ProductCard({ product }) {

//   console.log("ProductCard", product);


//   const navigate = useNavigate()


//   const rating = 3.5;

//   return (
//     <div className="rounded-md p-4 flex flex-col bg-white shadow-sm hover:shadow-md transition-shadow"
//       onClick={() => {
//         navigate(`/product-detail/${product._id}`)
//       }}
//     >
//       <img
//         src={product?.colors[0].images[0]}
//         //alt={title}
//         className="w-full h-90 object-cover mb-2 mx-auto rounded-2xl"
//       />
//       <h3 className="text-base font-semibold text-gray-800 line-clamp-1">{product?.name}</h3>
//       {/* Rating */}
//       <div className="flex items-center mt-1">
//         <div className="text-yellow-500 mr-2">
//           {"★".repeat(rating)}
//           {"☆".repeat(5 - rating)}
//         </div>
//         <span className="text-sm text-gray-500">{rating} / 5</span>
//       </div>
//       {/* Price Section */}
//       <span className="bg-gray-400 w-1/4 text-center py-2 text-white text-xs ml-2 px-1 rounded">
//         {Math.ceil(product?.colors[0].discountPercentage)}% off
//       </span>
//       <div className="mt-2 text-gray-800">
//         <span className="font-bold text-3xl">₹{product?.minDiscountPrice}</span>
//         {product?.colors[0].basePrice && (
//           <>
//             <span className="text-xl text-gray-500 ml-2 line-through">
//               ₹{product?.colors[0].basePrice}
//             </span>

//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ProductCard;



import React from "react";
import { useNavigate } from "react-router-dom";
import soldOut from "../../assets/images/soldout.png"

function ProductCard({ product }) {
  const navigate = useNavigate();
  const rating = 3.5;

  // Check if product is out of stock
  const isOutOfStock = product?.colors[0].totalStock === 0

  console.log(isOutOfStock, "isOutOfStock");


  return (
    <div
      className="rounded-lg p-4 flex flex-col bg-white shadow-sm hover:shadow-lg transition-all duration-300 relative cursor-pointer"
      onClick={() => {
        navigate(`/product-detail/${product._id}`);
      }}
    >
      <div className="relative">
        <img
          src={product?.colors[0].images[0]}
          alt={product?.name}
          className="w-full h-94 object-cover mb-3 mx-auto rounded-lg"
        />
      </div>

      {/* Product details */}
      <div className="flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{product?.name}</h3>

        {/* Rating */}
        <div className="flex items-center mt-1">
          <div className="text-yellow-400 mr-2">
            {Array(5).fill().map((_, i) => (
              <span key={i}>
                {i < Math.floor(rating) ? "★" : i < rating ? "★" : "☆"}
              </span>
            ))}
          </div>
          <span className="text-sm text-gray-500">{rating} / 5</span>
        </div>

        {/* Price Section - Improved layout */}
        <div className="mt-3 flex items-center">
          <div className="flex-grow">
            <span className="font-bold text-2xl text-gray-900">₹{product?.minDiscountPrice}</span>
            {product?.colors[0].basePrice && (
              <span className="text-sm text-gray-500 ml-2 line-through">
                ₹{product?.colors[0].basePrice}
              </span>
            )}
          </div>
          {/* Out of stock overlay - positioned at bottom right */}
          {isOutOfStock && (
            <div className="absolute bottom-2 right-2">
              <div className=" text-white px-3 py-1 rounded-full font-medium text-sm flex items-center">
                <img
                  src={soldOut}
                  alt=""
                  className="w-14 h-8 mb-15 "
                />
              </div>
            </div>
          )}

          {product?.colors[0].discountPercentage > 0 && (
            <span className=" text-green-800 text-xl py-1 px-2 rounded-full font-medium ">
              {Math.ceil(product?.colors[0].discountPercentage)}% off
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
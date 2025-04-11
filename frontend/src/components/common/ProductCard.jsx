

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import soldOut from "../../assets/images/soldout.png";
import { getCategoryList } from "../../services/categoryService";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const rating = 3.5;
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const isOutOfStock = product?.colors[0].totalStock === 0;

  useEffect(() => {
    let isMounted = true;

    const getCategory = async () => {
      try {
        setIsLoading(true);
        const response = await getCategoryList();

        if (isMounted) {
          console.log("Categories fetched:", response.data.categories);
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    getCategory();


    return () => {
      isMounted = false;
    };
  }, []);

  const getCategoryName = (categoryId, subCategoryId) => {
    try {
      if (!categories || categories.length === 0) return "Loading...";

      const category = categories.find((cat) => cat._id === categoryId);
      if (!category) return "Category not found";

      if (!subCategoryId) return category.name;

      const subCategoriesArray = category.subcategories || category.subCategories;
      if (!subCategoriesArray || !Array.isArray(subCategoriesArray)) {
        return category.name;
      }

      const subCategory = subCategoriesArray.find((sub) => sub._id === subCategoryId);
      if (!subCategory) return category.name;

      return `${category.name}, ${subCategory.name}`;
    } catch (error) {
      console.error("Error getting category name:", error);
      return "Error displaying category";
    }
  };

  if (isLoading) {
    return <ProductCardShimmer />;
  }

  if (!product) {
    return null;
  }

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
        <h6 className="text-sm font-semibold text-gray-400 line-clamp-1">
          {getCategoryName(product.category, product.subCategory)}
        </h6>

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

        {/* Price Section */}
        <div className="mt-3 flex items-center">
          <div className="flex-grow">
            <span className="font-bold text-2xl text-gray-900">₹{product?.minDiscountPrice}</span>
            {product?.colors[0].basePrice && (
              <span className="text-sm text-gray-500 ml-2 line-through">
                ₹{product?.colors[0].basePrice}
              </span>
            )}
          </div>
          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute bottom-2 right-2">
              <div className="text-white px-3 py-1 rounded-full font-medium text-sm flex items-center">
                <img
                  src={soldOut}
                  alt="Sold Out"
                  className="w-20 h-12 mb-22"
                />
              </div>
            </div>
          )}

          {product?.colors[0].discountPercentage > 0 && (
            <span className="text-green-800 text-xl py-1 px-2 rounded-full font-medium">
              {Math.ceil(product?.colors[0].discountPercentage)}% off
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;




function ProductCardShimmer() {
  return (
    <div className="rounded-lg p-4 flex flex-col bg-white shadow-sm relative overflow-hidden">
      {/* Shimmer overlay */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Image placeholder */}
      <div className="relative">
        <div className="w-full h-95 bg-gray-200 rounded-lg mb-3 mx-auto" />
      </div>

      {/* Product details placeholders */}
      <div className="flex flex-col flex-grow">
        {/* Title placeholder */}
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>

        {/* Category placeholder */}
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>

        {/* Rating placeholder */}
        <div className="flex items-center mt-1">
          <div className="h-4 bg-gray-200 rounded w-24 mr-2"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>

        {/* Price Section placeholder */}
        <div className="mt-3 flex items-center">
          <div className="flex-grow">
            <div className="h-7 bg-gray-200 rounded w-20"></div>
          </div>

          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        </div>
      </div>
    </div>
  );
}


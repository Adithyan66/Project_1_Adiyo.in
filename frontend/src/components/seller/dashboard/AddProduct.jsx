// import axios from "axios";


// import React, { useState } from "react";

// const AddProduct = () => {
//     // Form state
//     const [productName, setProductName] = useState("");
//     const [shortDescription, setShortDescription] = useState("");
//     const [productDescription, setProductDescription] = useState("");
//     const [brand, setBrand] = useState("");
//     const [category, setCategory] = useState("");
//     const [subCategory, setSubCategory] = useState("");
//     const [sku, setSku] = useState("");
//     const [material, setMaterial] = useState("");
//     const [careInstructions, setCareInstructions] = useState([]);

//     // Variants: sizes & stock for men's clothing
//     const [variants, setVariants] = useState({
//         small: { size: "Small", stock: "" },
//         medium: { size: "Medium", stock: "" },
//         large: { size: "Large", stock: "" },
//         extraLarge: { size: "Extra Large", stock: "" },
//     });

//     // Pricing
//     const [basePrice, setBasePrice] = useState("");
//     const [discountPrice, setDiscountPrice] = useState("");
//     const [discountPercentage, setDiscountPercentage] = useState("");

//     // Images (5 placeholders)
//     const [images, setImages] = useState([null, null, null, null, null]);

//     // Handle variant (size & stock) change
//     const handleVariantChange = (variantKey, value) => {
//         setVariants((prev) => ({
//             ...prev,
//             [variantKey]: { ...prev[variantKey], stock: value },
//         }));
//     };

//     // Calculate total stock from all variants
//     const totalStock = Object.values(variants).reduce((acc, curr) => {
//         const stockNum = parseInt(curr.stock, 10);
//         return acc + (isNaN(stockNum) ? 0 : stockNum);
//     }, 0);

//     // Handle image changes
//     const handleImageChange = (index, file) => {
//         setImages((prev) => {
//             const newImages = [...prev];
//             newImages[index] = file;
//             return newImages;
//         });
//     };

//     // --------------------------
//     // DISCOUNT LOGIC
//     // --------------------------

//     // Base Price change handler
//     const handleBasePriceChange = (e) => {
//         setBasePrice(e.target.value);
//     };

//     // When user updates the Discount Price (final price after discount),
//     // recalc discount percentage as: ((basePrice - discountPrice) / basePrice) * 100
//     const handleDiscountPriceChange = (e) => {
//         const finalPriceInput = e.target.value;
//         setDiscountPrice(finalPriceInput);
//         const finalPrice = parseFloat(finalPriceInput);
//         const base = parseFloat(basePrice);
//         if (!isNaN(finalPrice) && !isNaN(base) && base > 0) {
//             const discountPerc = ((base - finalPrice) / base) * 100;
//             setDiscountPercentage(discountPerc.toFixed(2));
//         } else {
//             setDiscountPercentage("");
//         }
//     };

//     // When user updates the Discount Percentage,
//     // recalc discount price as: basePrice * (1 - discountPercentage / 100)
//     const handleDiscountPercentageChange = (e) => {
//         const percInput = e.target.value;
//         setDiscountPercentage(percInput);
//         const perc = parseFloat(percInput);
//         const base = parseFloat(basePrice);
//         if (!isNaN(perc) && !isNaN(base) && base > 0) {
//             const finalPrice = base * (1 - perc / 100);
//             setDiscountPrice(finalPrice.toFixed(2));
//         } else {
//             setDiscountPrice("");
//         }
//     };


//     const handleSubmit = async (e) => {
//         e.preventDefault();



//         const formData = new FormData();

//         formData.append("name", productName);
//         formData.append("shortDescription", shortDescription);
//         formData.append("description", productDescription);
//         formData.append("brand", brand);
//         formData.append("category", category);
//         formData.append("subCategory", subCategory);
//         formData.append("sku", sku);
//         formData.append("price", basePrice);
//         formData.append("discountPrice", discountPrice);
//         formData.append("discountPercentage", discountPercentage);
//         formData.append("material", material);
//         formData.append("totalStock", totalStock);
//         formData.append("gender", "male");
//         formData.append("totalStock", totalStock);

//         formData.append("careInstructions", JSON.stringify(careInstructions));
//         formData.append("variants", JSON.stringify(variants));

//         images.forEach((image, index) => {
//             if (image) {
//                 formData.append("images", image)
//             }
//         })



//         const response = await axios.post("http://localhost:3333/seller/add-products", formData, {
//             headers: {
//                 "Content-Type": "multipart/form-data",
//             }
//         })

//         console.log(response.data);

//     };

//     return (
//         <div className="mx-auto p-6 bg-white rounded shadow max-w-6xl ">
//             <h1 className="text-2xl font-bold mb-4">Add Product</h1>
//             <form onSubmit={handleSubmit} className="space-y-6 ">
//                 {/* Product Name */}
//                 <div className="flex space-x-4">
//                     <div className="w-1/2 ">
//                         <label htmlFor="productName" className="block font-medium mb-1">
//                             Product Name
//                         </label>
//                         <input
//                             id="productName"
//                             type="text"
//                             value={productName}
//                             onChange={(e) => setProductName(e.target.value)}
//                             required
//                             className="w-full border border-gray-300 rounded px-3 py-2"
//                             placeholder="Enter product name"
//                         />
//                     </div>
//                     {/* Short Description */}
//                     <div className="w-1/2  ">
//                         <label htmlFor="shortDescription" className="block font-medium mb-1">
//                             Short Description
//                         </label>
//                         <input
//                             id="shortDescription"
//                             type="text"
//                             value={shortDescription}
//                             onChange={(e) => setShortDescription(e.target.value)}
//                             className="w-full border border-gray-300 rounded px-3 py-2"
//                             placeholder="Enter short description"
//                         />
//                     </div>
//                 </div>
//                 {/* Product Description */}
//                 <div>
//                     <label htmlFor="productDescription" className="block font-medium mb-1">
//                         Product Description
//                     </label>
//                     <textarea
//                         id="productDescription"
//                         value={productDescription}
//                         onChange={(e) => setProductDescription(e.target.value)}
//                         className="w-full border border-gray-300 rounded px-3 py-2 h-24"
//                         placeholder="Enter detailed description"
//                     />
//                 </div>
//                 {/* Brand */}
//                 <div className="flex space-x-4">
//                     <div className="w-1/2">
//                         <label htmlFor="brand" className="block font-medium mb-1">
//                             Brand
//                         </label>
//                         <input
//                             id="brand"
//                             type="text"
//                             value={brand}
//                             onChange={(e) => setBrand(e.target.value)}
//                             className="w-full border border-gray-300 rounded px-3 py-2"
//                             placeholder="Enter brand"
//                         />
//                     </div>
//                     {/* Sub Category */}
//                     <div className="w-1/2">
//                         <label htmlFor="subCategory" className="block font-medium mb-1">
//                             Sub Category
//                         </label>
//                         <input
//                             id="subCategory"
//                             type="text"
//                             value={subCategory}
//                             onChange={(e) => setSubCategory(e.target.value)}
//                             className="w-full border border-gray-300 rounded px-3 py-2"
//                             placeholder="Enter sub category"
//                         />
//                     </div>
//                 </div>
//                 {/* SKU */}
//                 <div className="flex space-x-4">
//                     <div className="w-1/2">
//                         <label htmlFor="sku" className="block font-medium mb-1">
//                             SKU
//                         </label>
//                         <input
//                             id="sku"
//                             type="text"
//                             value={sku}
//                             onChange={(e) => setSku(e.target.value)}
//                             className="w-full border border-gray-300 rounded px-3 py-2"
//                             placeholder="Enter SKU"
//                         />
//                     </div>
//                     {/* Material */}
//                     <div className="w-1/2">
//                         <label htmlFor="material" className="block font-medium mb-1">
//                             Material
//                         </label>
//                         <input
//                             id="material"
//                             type="text"
//                             value={material}
//                             onChange={(e) => setMaterial(e.target.value)}
//                             className="w-full border border-gray-300 rounded px-3 py-2"
//                             placeholder="Enter material"
//                         />
//                     </div>
//                 </div>




//                 {/* Care Instructions using Checkboxes */}
//                 <div>
//                     <label className="block font-medium mb-2">
//                         Care Instructions
//                     </label>
//                     <div className="flex flex-wrap gap-4">
//                         {[
//                             "Machine Wash",
//                             "Hand Wash",
//                             "Do Not Bleach",
//                             "Tumble Dry Low",
//                             "Iron Low",
//                             "Dry Clean Only"
//                         ].map((option) => (
//                             <div key={option} className="flex items-center">
//                                 <input
//                                     type="checkbox"
//                                     id={option}
//                                     value={option}
//                                     checked={careInstructions.includes(option)}
//                                     onChange={(e) => {
//                                         if (e.target.checked) {
//                                             setCareInstructions((prev) => [...prev, option]);
//                                         } else {
//                                             setCareInstructions((prev) =>
//                                                 prev.filter((item) => item !== option)
//                                             );
//                                         }
//                                     }}
//                                     className="mr-2"
//                                 />
//                                 <label htmlFor={option} className="text-sm">
//                                     {option}
//                                 </label>
//                             </div>
//                         ))}
//                     </div>

//                 </div>




//                 {/* Category */}
//                 <div className="w-1/2">
//                     <label htmlFor="category" className="block font-medium mb-1">
//                         Category
//                     </label>
//                     <select
//                         id="category"
//                         value={category}
//                         onChange={(e) => setCategory(e.target.value)}
//                         className="w-full border border-gray-300 rounded px-3 py-2"
//                     >
//                         <option value="">Select a category</option>
//                         <option value="Shirts">Shirts</option>
//                         <option value="T-Shirts">T-Shirts</option>
//                         <option value="Jeans">Jeans</option>
//                         <option value="Jackets">Jackets</option>
//                         <option value="Accessories">Accessories</option>
//                     </select>
//                 </div>
//                 {/* Variants (Size & Stock) */}
//                 <div>
//                     <label className="block font-medium mb-1">Variants (Size & Stock)</label>
//                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
//                         {Object.entries(variants).map(([key, variant]) => (
//                             <div key={key}>
//                                 <p className="text-sm mb-1">{variant.size}</p>
//                                 <input
//                                     type="number"
//                                     value={variant.stock}
//                                     onChange={(e) => handleVariantChange(key, e.target.value)}
//                                     placeholder="Stock"
//                                     min="0"
//                                     className="w-full border border-gray-300 rounded px-2 py-1"
//                                 />
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//                 {/* Add Images */}
//                 <div>
//                     <label className="block font-medium mb-2">Add Images</label>
//                     <div className="flex flex-wrap gap-4">
//                         {images.map((imgFile, idx) => (
//                             <div
//                                 key={idx}
//                                 className="relative flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded cursor-pointer"
//                             >
//                                 {imgFile ? (
//                                     <img
//                                         src={URL.createObjectURL(imgFile)}
//                                         alt="Preview"
//                                         className="object-cover w-full h-full rounded"
//                                     />
//                                 ) : (
//                                     <span className="text-gray-400 text-sm">Add Image</span>
//                                 )}
//                                 <input
//                                     type="file"
//                                     className="opacity-0 absolute w-24 h-24"
//                                     accept="image/*"
//                                     onChange={(e) => {
//                                         if (e.target.files[0]) {
//                                             handleImageChange(idx, e.target.files[0]);
//                                         }
//                                     }}
//                                 />
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//                 {/* Pricing & Stock */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {/* Base Price */}
//                     <div>
//                         <label htmlFor="basePrice" className="block font-medium mb-1">
//                             Base Price
//                         </label>
//                         <input
//                             id="basePrice"
//                             type="number"
//                             value={basePrice}
//                             onChange={handleBasePriceChange}
//                             placeholder="e.g., 1299"
//                             className="w-full border border-gray-300 rounded px-3 py-2"
//                         />
//                     </div>
//                     {/* Discount Price */}
//                     <div>
//                         <label htmlFor="discountPrice" className="block font-medium mb-1">
//                             Discount Price
//                         </label>
//                         <input
//                             id="discountPrice"
//                             type="number"
//                             value={discountPrice}
//                             onChange={handleDiscountPriceChange}
//                             placeholder="Enter final price after discount"
//                             className="w-full border border-gray-300 rounded px-3 py-2"
//                         />
//                     </div>
//                     {/* Discount Percentage */}
//                     <div>
//                         <label htmlFor="discountPercentage" className="block font-medium mb-1">
//                             Discount Percentage
//                         </label>
//                         <input
//                             id="discountPercentage"
//                             type="number"
//                             value={discountPercentage}
//                             onChange={handleDiscountPercentageChange}
//                             placeholder="Enter discount %"
//                             className="w-full border border-gray-300 rounded px-3 py-2"
//                         />
//                     </div>
//                     {/* Total Stock (Read-only) */}
//                     <div>
//                         <label className="block font-medium mb-1">Total Stock</label>
//                         <input
//                             type="number"
//                             value={totalStock}
//                             readOnly
//                             className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
//                         />
//                     </div>
//                 </div>
//                 {/* Buttons */}
//                 <div className="flex justify-end space-x-4">
//                     <button
//                         type="button"
//                         onClick={() => console.log("Cancel clicked")}
//                         className="border border-gray-400 px-4 py-2 rounded hover:bg-gray-100"
//                     >
//                         Cancel
//                     </button>
//                     <button type="submit" className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
//                         Save
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default AddProduct;



import axios from "axios";
import React, { useState } from "react";

const AddProduct = () => {
    // Form state
    const [productName, setProductName] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [brand, setBrand] = useState("");

    // Category & Sub Category: using dropdowns with fixed options
    const [category, setCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");

    const [sku, setSku] = useState("");
    const [material, setMaterial] = useState("");
    const [careInstructions, setCareInstructions] = useState([]);

    // Additional fields based on DB schema:
    // Color: using a select dropdown with 15 popular colors
    const [color, setColor] = useState("");

    // Variants: sizes & stock (if stock > 0, then that size is available)
    const [variants, setVariants] = useState({
        small: { size: "Small", stock: "" },
        medium: { size: "Medium", stock: "" },
        large: { size: "Large", stock: "" },
        extraLarge: { size: "Extra Large", stock: "" },
    });

    // Pricing
    const [basePrice, setBasePrice] = useState("");
    const [discountPrice, setDiscountPrice] = useState("");
    const [discountPercentage, setDiscountPercentage] = useState("");

    // Images (5 placeholders)
    const [images, setImages] = useState([null, null, null, null, null]);

    // Handle variant (size & stock) change
    const handleVariantChange = (variantKey, value) => {
        setVariants((prev) => ({
            ...prev,
            [variantKey]: { ...prev[variantKey], stock: value },
        }));
    };

    // Calculate total stock from all variants
    const totalStock = Object.values(variants).reduce((acc, curr) => {
        const stockNum = parseInt(curr.stock, 10);
        return acc + (isNaN(stockNum) ? 0 : stockNum);
    }, 0);

    // Compute available sizes from variants (if stock > 0)
    const availableSizes = Object.values(variants)
        .filter((variant) => parseInt(variant.stock, 10) > 0)
        .map((variant) => variant.size);

    // Handle image changes
    const handleImageChange = (index, file) => {
        setImages((prev) => {
            const newImages = [...prev];
            newImages[index] = file;
            return newImages;
        });
    };

    // --------------------------
    // DISCOUNT LOGIC
    // --------------------------
    const handleBasePriceChange = (e) => {
        setBasePrice(e.target.value);
    };

    const handleDiscountPriceChange = (e) => {
        const finalPriceInput = e.target.value;
        setDiscountPrice(finalPriceInput);
        const finalPrice = parseFloat(finalPriceInput);
        const base = parseFloat(basePrice);
        if (!isNaN(finalPrice) && !isNaN(base) && base > 0) {
            const discountPerc = ((base - finalPrice) / base) * 100;
            setDiscountPercentage(discountPerc.toFixed(2));
        } else {
            setDiscountPercentage("");
        }
    };

    const handleDiscountPercentageChange = (e) => {
        const percInput = e.target.value;
        setDiscountPercentage(percInput);
        const perc = parseFloat(percInput);
        const base = parseFloat(basePrice);
        if (!isNaN(perc) && !isNaN(base) && base > 0) {
            const finalPrice = base * (1 - perc / 100);
            setDiscountPrice(finalPrice.toFixed(2));
        } else {
            setDiscountPrice("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("name", productName);
        formData.append("shortDescription", shortDescription);
        formData.append("description", productDescription);
        formData.append("brand", brand);
        formData.append("category", category);
        formData.append("subCategory", subCategory);
        formData.append("sku", sku);
        formData.append("price", basePrice);
        formData.append("discountPrice", discountPrice);
        formData.append("discountPercentage", discountPercentage);
        formData.append("material", material);
        formData.append("totalStock", totalStock);
        formData.append("gender", "male");

        // Append additional fields
        formData.append("color", color);
        // Instead of a separate sizes field, we pass available sizes computed from variants.
        formData.append("size", JSON.stringify(availableSizes));
        // formData.append("subCategory", subCategory); // Adjust if you need a separate dressStyle field

        formData.append("careInstructions", JSON.stringify(careInstructions));
        formData.append("variants", JSON.stringify(variants));

        images.forEach((image) => {
            if (image) {
                formData.append("images", image);
            }
        });

        try {
            const response = await axios.post(
                "http://localhost:3333/seller/add-products",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            console.log(response.data);
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    return (
        <div className="mx-auto p-6 bg-white rounded shadow max-w-6xl">
            <h1 className="text-2xl font-bold mb-4">Add Product</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Product Name and Short Description */}
                <div className="flex space-x-4">
                    <div className="w-1/2">
                        <label htmlFor="productName" className="block font-medium mb-1">
                            Product Name
                        </label>
                        <input
                            id="productName"
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="Enter product name"
                        />
                    </div>
                    <div className="w-1/2">
                        <label htmlFor="shortDescription" className="block font-medium mb-1">
                            Short Description
                        </label>
                        <input
                            id="shortDescription"
                            type="text"
                            value={shortDescription}
                            onChange={(e) => setShortDescription(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="Enter short description"
                        />
                    </div>
                </div>

                {/* Product Description */}
                <div>
                    <label htmlFor="productDescription" className="block font-medium mb-1">
                        Product Description
                    </label>
                    <textarea
                        id="productDescription"
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 h-24"
                        placeholder="Enter detailed description"
                    />
                </div>

                {/* Brand, Category, SKU, Material */}
                <div className="flex space-x-4">
                    <div className="w-1/2">
                        <label htmlFor="brand" className="block font-medium mb-1">
                            Brand
                        </label>
                        <input
                            id="brand"
                            type="text"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="Enter brand"
                        />
                    </div>
                    <div className="w-1/2">
                        <label htmlFor="category" className="block font-medium mb-1">
                            Category
                        </label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        >
                            <option value="">Select a category</option>
                            <option value="Mens Wear">Mens Wear</option>
                            <option value="Boys">Boys</option>
                        </select>
                    </div>
                </div>
                <div className="flex space-x-4">
                    <div className="w-1/2">
                        <label htmlFor="sku" className="block font-medium mb-1">
                            SKU
                        </label>
                        <input
                            id="sku"
                            type="text"
                            value={sku}
                            onChange={(e) => setSku(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="Enter SKU"
                        />
                    </div>
                    <div className="w-1/2">
                        <label htmlFor="material" className="block font-medium mb-1">
                            Material
                        </label>
                        <input
                            id="material"
                            type="text"
                            value={material}
                            onChange={(e) => setMaterial(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="Enter material"
                        />
                    </div>
                </div>

                {/* Additional Fields: Color, Sub Category */}
                <div className="flex space-x-4">
                    <div className="w-1/3">
                        <label htmlFor="color" className="block font-medium mb-1">
                            Color
                        </label>
                        <select
                            id="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        >
                            <option value="">Select a color</option>
                            {[
                                "Red",
                                "Blue",
                                "Green",
                                "Yellow",
                                "Black",
                                "White",
                                "Purple",
                                "Pink",
                                "Orange",
                                "Gray",
                                "Brown",
                                "Maroon",
                                "Navy",
                                "Olive",
                                "Teal"
                            ].map((col) => (
                                <option key={col} value={col}>
                                    {col}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="w-1/3">
                        <label htmlFor="subCategory" className="block font-medium mb-1">
                            Sub Category
                        </label>
                        <select
                            id="subCategory"
                            value={subCategory}
                            onChange={(e) => setSubCategory(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        >
                            <option value="">Select a sub category</option>
                            <option value="Shirts">Shirts</option>
                            <option value="T-Shirts">T-Shirts</option>
                            <option value="Pants">Pants</option>
                            <option value="Jeans">Jeans</option>
                            <option value="Jackets">Jackets</option>
                            <option value="Accessories">Accessories</option>
                        </select>
                    </div>
                    {/* Note: Dress style field is merged with sub category in this example;
              you can add another input if needed */}
                </div>

                {/* Care Instructions */}
                <div>
                    <label className="block font-medium mb-2">Care Instructions</label>
                    <div className="flex flex-wrap gap-4">
                        {[
                            "Machine Wash",
                            "Hand Wash",
                            "Do Not Bleach",
                            "Tumble Dry Low",
                            "Iron Low",
                            "Dry Clean Only"
                        ].map((option) => (
                            <div key={option} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={option}
                                    value={option}
                                    checked={careInstructions.includes(option)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setCareInstructions((prev) => [...prev, option]);
                                        } else {
                                            setCareInstructions((prev) =>
                                                prev.filter((item) => item !== option)
                                            );
                                        }
                                    }}
                                    className="mr-2"
                                />
                                <label htmlFor={option} className="text-sm">
                                    {option}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Variants (Size & Stock) */}
                <div>
                    <label className="block font-medium mb-1">Variants (Size & Stock)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {Object.entries(variants).map(([key, variant]) => (
                            <div key={key}>
                                <p className="text-sm mb-1">{variant.size}</p>
                                <input
                                    type="number"
                                    value={variant.stock}
                                    onChange={(e) => handleVariantChange(key, e.target.value)}
                                    placeholder="Stock"
                                    min="0"
                                    className="w-full border border-gray-300 rounded px-2 py-1"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Add Images */}
                <div>
                    <label className="block font-medium mb-2">Add Images</label>
                    <div className="flex flex-wrap gap-4">
                        {images.map((imgFile, idx) => (
                            <div
                                key={idx}
                                className="relative flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded cursor-pointer"
                            >
                                {imgFile ? (
                                    <img
                                        src={URL.createObjectURL(imgFile)}
                                        alt="Preview"
                                        className="object-cover w-full h-full rounded"
                                    />
                                ) : (
                                    <span className="text-gray-400 text-sm">Add Image</span>
                                )}
                                <input
                                    type="file"
                                    className="opacity-0 absolute w-24 h-24"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files[0]) {
                                            handleImageChange(idx, e.target.files[0]);
                                        }
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pricing & Stock */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="basePrice" className="block font-medium mb-1">
                            Base Price
                        </label>
                        <input
                            id="basePrice"
                            type="number"
                            value={basePrice}
                            onChange={handleBasePriceChange}
                            placeholder="e.g., 1299"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="discountPrice" className="block font-medium mb-1">
                            Discount Price
                        </label>
                        <input
                            id="discountPrice"
                            type="number"
                            value={discountPrice}
                            onChange={handleDiscountPriceChange}
                            placeholder="Enter final price after discount"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="discountPercentage" className="block font-medium mb-1">
                            Discount Percentage
                        </label>
                        <input
                            id="discountPercentage"
                            type="number"
                            value={discountPercentage}
                            onChange={handleDiscountPercentageChange}
                            placeholder="Enter discount %"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Total Stock</label>
                        <input
                            type="number"
                            value={totalStock}
                            readOnly
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                        />
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => console.log("Cancel clicked")}
                        className="border border-gray-400 px-4 py-2 rounded hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button type="submit" className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;





// // // import axios from "axios";
// // // import React, { useState } from "react";

// // // const AddProduct = () => {
// // //     // Form state
// // //     const [productName, setProductName] = useState("");
// // //     const [shortDescription, setShortDescription] = useState("");
// // //     const [productDescription, setProductDescription] = useState("");
// // //     const [brand, setBrand] = useState("");

// // //     // Category & Sub Category: using dropdowns with fixed options
// // //     const [category, setCategory] = useState("");
// // //     const [subCategory, setSubCategory] = useState("");

// // //     const [sku, setSku] = useState("");
// // //     const [material, setMaterial] = useState("");
// // //     const [careInstructions, setCareInstructions] = useState([]);

// // //     // Additional fields based on DB schema:
// // //     // Color: using a select dropdown with 15 popular colors
// // //     const [color, setColor] = useState("");

// // //     // Variants: sizes & stock (if stock > 0, then that size is available)
// // //     const [variants, setVariants] = useState({
// // //         small: { size: "Small", stock: "" },
// // //         medium: { size: "Medium", stock: "" },
// // //         large: { size: "Large", stock: "" },
// // //         extraLarge: { size: "Extra Large", stock: "" },
// // //     });

// // //     // Pricing
// // //     const [basePrice, setBasePrice] = useState("");
// // //     const [discountPrice, setDiscountPrice] = useState("");
// // //     const [discountPercentage, setDiscountPercentage] = useState("");

// // //     // Images (5 placeholders)
// // //     const [images, setImages] = useState([null, null, null, null, null]);

// // //     // Handle variant (size & stock) change
// // //     const handleVariantChange = (variantKey, value) => {
// // //         setVariants((prev) => ({
// // //             ...prev,
// // //             [variantKey]: { ...prev[variantKey], stock: value },
// // //         }));
// // //     };

// // //     // Calculate total stock from all variants
// // //     const totalStock = Object.values(variants).reduce((acc, curr) => {
// // //         const stockNum = parseInt(curr.stock, 10);
// // //         return acc + (isNaN(stockNum) ? 0 : stockNum);
// // //     }, 0);

// // //     // Compute available sizes from variants (if stock > 0)
// // //     const availableSizes = Object.values(variants)
// // //         .filter((variant) => parseInt(variant.stock, 10) > 0)
// // //         .map((variant) => variant.size);

// // //     // Handle image changes
// // //     const handleImageChange = (index, file) => {
// // //         setImages((prev) => {
// // //             const newImages = [...prev];
// // //             newImages[index] = file;
// // //             return newImages;
// // //         });
// // //     };

// // //     // --------------------------
// // //     // DISCOUNT LOGIC
// // //     // --------------------------
// // //     const handleBasePriceChange = (e) => {
// // //         setBasePrice(e.target.value);
// // //     };

// // //     const handleDiscountPriceChange = (e) => {
// // //         const finalPriceInput = e.target.value;
// // //         setDiscountPrice(finalPriceInput);
// // //         const finalPrice = parseFloat(finalPriceInput);
// // //         const base = parseFloat(basePrice);
// // //         if (!isNaN(finalPrice) && !isNaN(base) && base > 0) {
// // //             const discountPerc = ((base - finalPrice) / base) * 100;
// // //             setDiscountPercentage(discountPerc.toFixed(2));
// // //         } else {
// // //             setDiscountPercentage("");
// // //         }
// // //     };

// // //     const handleDiscountPercentageChange = (e) => {
// // //         const percInput = e.target.value;
// // //         setDiscountPercentage(percInput);
// // //         const perc = parseFloat(percInput);
// // //         const base = parseFloat(basePrice);
// // //         if (!isNaN(perc) && !isNaN(base) && base > 0) {
// // //             const finalPrice = base * (1 - perc / 100);
// // //             setDiscountPrice(finalPrice.toFixed(2));
// // //         } else {
// // //             setDiscountPrice("");
// // //         }
// // //     };

// // //     const handleSubmit = async (e) => {
// // //         e.preventDefault();

// // //         const formData = new FormData();

// // //         formData.append("name", productName);
// // //         formData.append("shortDescription", shortDescription);
// // //         formData.append("description", productDescription);
// // //         formData.append("brand", brand);
// // //         formData.append("category", category);
// // //         formData.append("subCategory", subCategory);
// // //         formData.append("sku", sku);
// // //         formData.append("price", basePrice);
// // //         formData.append("discountPrice", discountPrice);
// // //         formData.append("discountPercentage", discountPercentage);
// // //         formData.append("material", material);
// // //         formData.append("totalStock", totalStock);
// // //         formData.append("gender", "male");

// // //         // Append additional fields
// // //         formData.append("color", color);
// // //         // Instead of a separate sizes field, we pass available sizes computed from variants.
// // //         formData.append("size", JSON.stringify(availableSizes));
// // //         // formData.append("subCategory", subCategory); // Adjust if you need a separate dressStyle field

// // //         formData.append("careInstructions", JSON.stringify(careInstructions));
// // //         formData.append("variants", JSON.stringify(variants));

// // //         images.forEach((image) => {
// // //             if (image) {
// // //                 formData.append("images", image);
// // //             }
// // //         });

// // //         try {
// // //             const response = await axios.post(
// // //                 "http://localhost:3333/seller/add-products",
// // //                 formData,
// // //                 {
// // //                     headers: {
// // //                         "Content-Type": "multipart/form-data",
// // //                     },
// // //                 }
// // //             );
// // //             console.log(response.data);
// // //         } catch (error) {
// // //             console.error("Error adding product:", error);
// // //         }
// // //     };

// // //     return (
// // //         <div className="mx-auto p-6 bg-white rounded shadow max-w-6xl">
// // //             <h1 className="text-2xl font-bold mb-4">Add Product</h1>
// // //             <form onSubmit={handleSubmit} className="space-y-6">
// // //                 {/* Product Name and Short Description */}
// // //                 <div className="flex space-x-4">
// // //                     <div className="w-1/2">
// // //                         <label htmlFor="productName" className="block font-medium mb-1">
// // //                             Product Name
// // //                         </label>
// // //                         <input
// // //                             id="productName"
// // //                             type="text"
// // //                             value={productName}
// // //                             onChange={(e) => setProductName(e.target.value)}
// // //                             required
// // //                             className="w-full border border-gray-300 rounded px-3 py-2"
// // //                             placeholder="Enter product name"
// // //                         />
// // //                     </div>
// // //                     <div className="w-1/2">
// // //                         <label htmlFor="shortDescription" className="block font-medium mb-1">
// // //                             Short Description
// // //                         </label>
// // //                         <input
// // //                             id="shortDescription"
// // //                             type="text"
// // //                             value={shortDescription}
// // //                             onChange={(e) => setShortDescription(e.target.value)}
// // //                             className="w-full border border-gray-300 rounded px-3 py-2"
// // //                             placeholder="Enter short description"
// // //                         />
// // //                     </div>
// // //                 </div>

// // //                 {/* Product Description */}
// // //                 <div>
// // //                     <label htmlFor="productDescription" className="block font-medium mb-1">
// // //                         Product Description
// // //                     </label>
// // //                     <textarea
// // //                         id="productDescription"
// // //                         value={productDescription}
// // //                         onChange={(e) => setProductDescription(e.target.value)}
// // //                         className="w-full border border-gray-300 rounded px-3 py-2 h-24"
// // //                         placeholder="Enter detailed description"
// // //                     />
// // //                 </div>

// // //                 {/* Brand, Category, SKU, Material */}
// // //                 <div className="flex space-x-4">
// // //                     <div className="w-1/2">
// // //                         <label htmlFor="brand" className="block font-medium mb-1">
// // //                             Brand
// // //                         </label>
// // //                         <input
// // //                             id="brand"
// // //                             type="text"
// // //                             value={brand}
// // //                             onChange={(e) => setBrand(e.target.value)}
// // //                             className="w-full border border-gray-300 rounded px-3 py-2"
// // //                             placeholder="Enter brand"
// // //                         />
// // //                     </div>
// // //                     <div className="w-1/2">
// // //                         <label htmlFor="category" className="block font-medium mb-1">
// // //                             Category
// // //                         </label>
// // //                         <select
// // //                             id="category"
// // //                             value={category}
// // //                             onChange={(e) => setCategory(e.target.value)}
// // //                             className="w-full border border-gray-300 rounded px-3 py-2"
// // //                         >
// // //                             <option value="">Select a category</option>
// // //                             <option value="Mens Wear">Mens Wear</option>
// // //                             <option value="Boys">Boys</option>
// // //                         </select>
// // //                     </div>
// // //                 </div>
// // //                 <div className="flex space-x-4">
// // //                     <div className="w-1/2">
// // //                         <label htmlFor="sku" className="block font-medium mb-1">
// // //                             SKU
// // //                         </label>
// // //                         <input
// // //                             id="sku"
// // //                             type="text"
// // //                             value={sku}
// // //                             onChange={(e) => setSku(e.target.value)}
// // //                             className="w-full border border-gray-300 rounded px-3 py-2"
// // //                             placeholder="Enter SKU"
// // //                         />
// // //                     </div>
// // //                     <div className="w-1/2">
// // //                         <label htmlFor="material" className="block font-medium mb-1">
// // //                             Material
// // //                         </label>
// // //                         <input
// // //                             id="material"
// // //                             type="text"
// // //                             value={material}
// // //                             onChange={(e) => setMaterial(e.target.value)}
// // //                             className="w-full border border-gray-300 rounded px-3 py-2"
// // //                             placeholder="Enter material"
// // //                         />
// // //                     </div>
// // //                 </div>

// // //                 {/* Additional Fields: Color, Sub Category */}
// // //                 <div className="flex space-x-4">
// // //                     <div className="w-1/3">
// // //                         <label htmlFor="color" className="block font-medium mb-1">
// // //                             Color
// // //                         </label>
// // //                         <select
// // //                             id="color"
// // //                             value={color}
// // //                             onChange={(e) => setColor(e.target.value)}
// // //                             className="w-full border border-gray-300 rounded px-3 py-2"
// // //                         >
// // //                             <option value="">Select a color</option>
// // //                             {[
// // //                                 "Red",
// // //                                 "Blue",
// // //                                 "Green",
// // //                                 "Yellow",
// // //                                 "Black",
// // //                                 "White",
// // //                                 "Purple",
// // //                                 "Pink",
// // //                                 "Orange",
// // //                                 "Gray",
// // //                                 "Brown",
// // //                                 "Maroon",
// // //                                 "Navy",
// // //                                 "Olive",
// // //                                 "Teal"
// // //                             ].map((col) => (
// // //                                 <option key={col} value={col}>
// // //                                     {col}
// // //                                 </option>
// // //                             ))}
// // //                         </select>
// // //                     </div>
// // //                     <div className="w-1/3">
// // //                         <label htmlFor="subCategory" className="block font-medium mb-1">
// // //                             Sub Category
// // //                         </label>
// // //                         <select
// // //                             id="subCategory"
// // //                             value={subCategory}
// // //                             onChange={(e) => setSubCategory(e.target.value)}
// // //                             className="w-full border border-gray-300 rounded px-3 py-2"
// // //                         >
// // //                             <option value="">Select a sub category</option>
// // //                             <option value="Shirts">Shirts</option>
// // //                             <option value="T-Shirts">T-Shirts</option>
// // //                             <option value="Pants">Pants</option>
// // //                             <option value="Jeans">Jeans</option>
// // //                             <option value="Jackets">Jackets</option>
// // //                             <option value="Accessories">Accessories</option>
// // //                         </select>
// // //                     </div>
// // //                     {/* Note: Dress style field is merged with sub category in this example;
// // //               you can add another input if needed */}
// // //                 </div>

// // //                 {/* Care Instructions */}
// // //                 <div>
// // //                     <label className="block font-medium mb-2">Care Instructions</label>
// // //                     <div className="flex flex-wrap gap-4">
// // //                         {[
// // //                             "Machine Wash",
// // //                             "Hand Wash",
// // //                             "Do Not Bleach",
// // //                             "Tumble Dry Low",
// // //                             "Iron Low",
// // //                             "Dry Clean Only"
// // //                         ].map((option) => (
// // //                             <div key={option} className="flex items-center">
// // //                                 <input
// // //                                     type="checkbox"
// // //                                     id={option}
// // //                                     value={option}
// // //                                     checked={careInstructions.includes(option)}
// // //                                     onChange={(e) => {
// // //                                         if (e.target.checked) {
// // //                                             setCareInstructions((prev) => [...prev, option]);
// // //                                         } else {
// // //                                             setCareInstructions((prev) =>
// // //                                                 prev.filter((item) => item !== option)
// // //                                             );
// // //                                         }
// // //                                     }}
// // //                                     className="mr-2"
// // //                                 />
// // //                                 <label htmlFor={option} className="text-sm">
// // //                                     {option}
// // //                                 </label>
// // //                             </div>
// // //                         ))}
// // //                     </div>
// // //                 </div>

// // //                 {/* Variants (Size & Stock) */}
// // //                 <div>
// // //                     <label className="block font-medium mb-1">Variants (Size & Stock)</label>
// // //                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
// // //                         {Object.entries(variants).map(([key, variant]) => (
// // //                             <div key={key}>
// // //                                 <p className="text-sm mb-1">{variant.size}</p>
// // //                                 <input
// // //                                     type="number"
// // //                                     value={variant.stock}
// // //                                     onChange={(e) => handleVariantChange(key, e.target.value)}
// // //                                     placeholder="Stock"
// // //                                     min="0"
// // //                                     className="w-full border border-gray-300 rounded px-2 py-1"
// // //                                 />
// // //                             </div>
// // //                         ))}
// // //                     </div>
// // //                 </div>

// // //                 {/* Add Images */}
// // //                 <div>
// // //                     <label className="block font-medium mb-2">Add Images</label>
// // //                     <div className="flex flex-wrap gap-4">
// // //                         {images.map((imgFile, idx) => (
// // //                             <div
// // //                                 key={idx}
// // //                                 className="relative flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded cursor-pointer"
// // //                             >
// // //                                 {imgFile ? (
// // //                                     <img
// // //                                         src={URL.createObjectURL(imgFile)}
// // //                                         alt="Preview"
// // //                                         className="object-cover w-full h-full rounded"
// // //                                     />
// // //                                 ) : (
// // //                                     <span className="text-gray-400 text-sm">Add Image</span>
// // //                                 )}
// // //                                 <input
// // //                                     type="file"
// // //                                     className="opacity-0 absolute w-24 h-24"
// // //                                     accept="image/*"
// // //                                     onChange={(e) => {
// // //                                         if (e.target.files[0]) {
// // //                                             handleImageChange(idx, e.target.files[0]);
// // //                                         }
// // //                                     }}
// // //                                 />
// // //                             </div>
// // //                         ))}
// // //                     </div>
// // //                 </div>

// // //                 {/* Pricing & Stock */}
// // //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //                     <div>
// // //                         <label htmlFor="basePrice" className="block font-medium mb-1">
// // //                             Base Price
// // //                         </label>
// // //                         <input
// // //                             id="basePrice"
// // //                             type="number"
// // //                             value={basePrice}
// // //                             onChange={handleBasePriceChange}
// // //                             placeholder="e.g., 1299"
// // //                             className="w-full border border-gray-300 rounded px-3 py-2"
// // //                         />
// // //                     </div>
// // //                     <div>
// // //                         <label htmlFor="discountPrice" className="block font-medium mb-1">
// // //                             Discount Price
// // //                         </label>
// // //                         <input
// // //                             id="discountPrice"
// // //                             type="number"
// // //                             value={discountPrice}
// // //                             onChange={handleDiscountPriceChange}
// // //                             placeholder="Enter final price after discount"
// // //                             className="w-full border border-gray-300 rounded px-3 py-2"
// // //                         />
// // //                     </div>
// // //                     <div>
// // //                         <label htmlFor="discountPercentage" className="block font-medium mb-1">
// // //                             Discount Percentage
// // //                         </label>
// // //                         <input
// // //                             id="discountPercentage"
// // //                             type="number"
// // //                             value={discountPercentage}
// // //                             onChange={handleDiscountPercentageChange}
// // //                             placeholder="Enter discount %"
// // //                             className="w-full border border-gray-300 rounded px-3 py-2"
// // //                         />
// // //                     </div>
// // //                     <div>
// // //                         <label className="block font-medium mb-1">Total Stock</label>
// // //                         <input
// // //                             type="number"
// // //                             value={totalStock}
// // //                             readOnly
// // //                             className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
// // //                         />
// // //                     </div>
// // //                 </div>

// // //                 {/* Buttons */}
// // //                 <div className="flex justify-end space-x-4">
// // //                     <button
// // //                         type="button"
// // //                         onClick={() => console.log("Cancel clicked")}
// // //                         className="border border-gray-400 px-4 py-2 rounded hover:bg-gray-100"
// // //                     >
// // //                         Cancel
// // //                     </button>
// // //                     <button type="submit" className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
// // //                         Save
// // //                     </button>
// // //                 </div>
// // //             </form>
// // //         </div>
// // //     );
// // // };

// // // export default AddProduct;









// // import axios from "axios";
// // import React, { useState } from "react";

// // const AddProduct = () => {
// //     // Basic product state (common across colors)
// //     const [productName, setProductName] = useState("");
// //     const [shortDescription, setShortDescription] = useState("");
// //     const [productDescription, setProductDescription] = useState("");
// //     const [brand, setBrand] = useState("");
// //     const [category, setCategory] = useState("");
// //     const [subCategory, setSubCategory] = useState("");
// //     const [sku, setSku] = useState("");
// //     const [material, setMaterial] = useState("");
// //     const [careInstructions, setCareInstructions] = useState([]);

// //     // For multiple colors, we use an array.
// //     const [colors, setColors] = useState([
// //         {
// //             color: "",
// //             images: [null, null, null], // Example: 3 image slots per color
// //             basePrice: "",
// //             discountPrice: "",
// //             discountPercentage: "",
// //             // Variants per color: can be extended if needed.
// //             variants: {
// //                 small: { size: "Small", stock: "" },
// //                 medium: { size: "Medium", stock: "" },
// //                 large: { size: "Large", stock: "" },
// //             },
// //         },
// //     ]);

// //     // Handle dynamic change for each color variation
// //     const handleColorChange = (index, field, value) => {
// //         setColors((prevColors) => {
// //             const newColors = [...prevColors];
// //             newColors[index] = { ...newColors[index], [field]: value };
// //             return newColors;
// //         });
// //     };

// //     // Handle image change for a specific color and image slot
// //     const handleColorImageChange = (colorIndex, imageIndex, file) => {
// //         setColors((prevColors) => {
// //             const newColors = [...prevColors];
// //             const images = [...newColors[colorIndex].images];
// //             images[imageIndex] = file;
// //             newColors[colorIndex].images = images;
// //             return newColors;
// //         });
// //     };

// //     // Handle variant stock change per color
// //     const handleVariantChange = (colorIndex, variantKey, value) => {
// //         setColors((prevColors) => {
// //             const newColors = [...prevColors];
// //             newColors[colorIndex].variants[variantKey].stock = value;
// //             return newColors;
// //         });
// //     };

// //     // Discount logic for each color variation
// //     const handleBasePriceChange = (index, value) => {
// //         setColors((prevColors) => {
// //             const newColors = [...prevColors];
// //             newColors[index].basePrice = value;
// //             // Recalculate discount if discountPrice is already set
// //             const base = parseFloat(value);
// //             const discountPrice = parseFloat(newColors[index].discountPrice);
// //             if (!isNaN(base) && !isNaN(discountPrice) && base > 0) {
// //                 newColors[index].discountPercentage = (
// //                     ((base - discountPrice) / base) *
// //                     100
// //                 ).toFixed(2);
// //             }
// //             return newColors;
// //         });
// //     };

// //     const handleDiscountPriceChange = (index, value) => {
// //         setColors((prevColors) => {
// //             const newColors = [...prevColors];
// //             newColors[index].discountPrice = value;
// //             const base = parseFloat(newColors[index].basePrice);
// //             const discountPrice = parseFloat(value);
// //             if (!isNaN(base) && !isNaN(discountPrice) && base > 0) {
// //                 newColors[index].discountPercentage = (
// //                     ((base - discountPrice) / base) *
// //                     100
// //                 ).toFixed(2);
// //             }
// //             return newColors;
// //         });
// //     };

// //     // Add a new color variation section
// //     const addNewColor = () => {
// //         setColors((prevColors) => [
// //             ...prevColors,
// //             {
// //                 color: "",
// //                 images: [null, null, null],
// //                 basePrice: "",
// //                 discountPrice: "",
// //                 discountPercentage: "",
// //                 variants: {
// //                     small: { size: "Small", stock: "" },
// //                     medium: { size: "Medium", stock: "" },
// //                     large: { size: "Large", stock: "" },
// //                 },
// //             },
// //         ]);
// //     };

// //     const handleSubmit = async (e) => {
// //         e.preventDefault();

// //         // Create FormData
// //         const formData = new FormData();

// //         // Append common product fields
// //         formData.append("name", productName);
// //         formData.append("shortDescription", shortDescription);
// //         formData.append("description", productDescription);
// //         formData.append("brand", brand);
// //         formData.append("category", category);
// //         formData.append("subCategory", subCategory);
// //         formData.append("sku", sku);
// //         formData.append("material", material);
// //         formData.append("careInstructions", JSON.stringify(careInstructions));

// //         // Append colors array as JSON
// //         // Note: For each color, you'll need to handle image uploads separately on the backend.
// //         // Here, we include metadata for each color variation.
// //         const colorsData = colors.map((col, index) => {
// //             // Calculate total stock for this color from variants
// //             const totalStock = Object.values(col.variants).reduce((acc, variant) => {
// //                 const stockNum = parseInt(variant.stock, 10);
// //                 return acc + (isNaN(stockNum) ? 0 : stockNum);
// //             }, 0);
// //             return { ...col, totalStock };
// //         });
// //         formData.append("colors", JSON.stringify(colorsData));

// //         // Append each image file for each color
// //         colors.forEach((col, colorIndex) => {
// //             col.images.forEach((img, imgIndex) => {
// //                 if (img) {
// //                     // Use a unique key for each image: e.g., color0_image1
// //                     formData.append(`color${colorIndex}_image`, img);
// //                 }
// //             });
// //         });

// //         try {
// //             const response = await axios.post(
// //                 "http://localhost:3333/seller/add-products",
// //                 formData,
// //                 {
// //                     headers: {
// //                         "Content-Type": "multipart/form-data",
// //                     },
// //                 }
// //             );
// //             console.log(response.data);
// //         } catch (error) {
// //             console.error("Error adding product:", error);
// //         }
// //     };

// //     return (
// //         <div className="mx-auto p-6 bg-white rounded shadow max-w-6xl">
// //             <h1 className="text-2xl font-bold mb-4">Add Product</h1>
// //             <form onSubmit={handleSubmit} className="space-y-6">
// //                 {/* Common Product Fields */}
// //                 <div className="flex space-x-4">
// //                     <div className="w-1/2">
// //                         <label className="block font-medium mb-1">Product Name</label>
// //                         <input
// //                             type="text"
// //                             value={productName}
// //                             onChange={(e) => setProductName(e.target.value)}
// //                             required
// //                             className="w-full border border-gray-300 rounded px-3 py-2"
// //                             placeholder="Enter product name"
// //                         />
// //                     </div>
// //                     <div className="w-1/2">
// //                         <label className="block font-medium mb-1">Short Description</label>
// //                         <input
// //                             type="text"
// //                             value={shortDescription}
// //                             onChange={(e) => setShortDescription(e.target.value)}
// //                             className="w-full border border-gray-300 rounded px-3 py-2"
// //                             placeholder="Enter short description"
// //                         />
// //                     </div>
// //                 </div>

// //                 <div>
// //                     <label className="block font-medium mb-1">Product Description</label>
// //                     <textarea
// //                         value={productDescription}
// //                         onChange={(e) => setProductDescription(e.target.value)}
// //                         className="w-full border border-gray-300 rounded px-3 py-2 h-24"
// //                         placeholder="Enter detailed description"
// //                     />
// //                 </div>

// //                 <div className="flex space-x-4">
// //                     <div className="w-1/2">
// //                         <label className="block font-medium mb-1">Brand</label>
// //                         <input
// //                             type="text"
// //                             value={brand}
// //                             onChange={(e) => setBrand(e.target.value)}
// //                             className="w-full border border-gray-300 rounded px-3 py-2"
// //                             placeholder="Enter brand"
// //                         />
// //                     </div>
// //                     <div className="w-1/2">
// //                         <label className="block font-medium mb-1">Category</label>
// //                         <select
// //                             value={category}
// //                             onChange={(e) => setCategory(e.target.value)}
// //                             className="w-full border border-gray-300 rounded px-3 py-2"
// //                         >
// //                             <option value="">Select a category</option>
// //                             <option value="Mens Wear">Mens Wear</option>
// //                             <option value="Boys">Boys</option>
// //                         </select>
// //                     </div>
// //                 </div>

// //                 <div className="flex space-x-4">
// //                     <div className="w-1/2">
// //                         <label className="block font-medium mb-1">SKU</label>
// //                         <input
// //                             type="text"
// //                             value={sku}
// //                             onChange={(e) => setSku(e.target.value)}
// //                             className="w-full border border-gray-300 rounded px-3 py-2"
// //                             placeholder="Enter SKU"
// //                         />
// //                     </div>
// //                     <div className="w-1/2">
// //                         <label className="block font-medium mb-1">Material</label>
// //                         <input
// //                             type="text"
// //                             value={material}
// //                             onChange={(e) => setMaterial(e.target.value)}
// //                             className="w-full border border-gray-300 rounded px-3 py-2"
// //                             placeholder="Enter material"
// //                         />
// //                     </div>
// //                 </div>

// //                 <div>
// //                     <label className="block font-medium mb-2">Care Instructions</label>
// //                     <div className="flex flex-wrap gap-4">
// //                         {[
// //                             "Machine Wash",
// //                             "Hand Wash",
// //                             "Do Not Bleach",
// //                             "Tumble Dry Low",
// //                             "Iron Low",
// //                             "Dry Clean Only",
// //                         ].map((option) => (
// //                             <div key={option} className="flex items-center">
// //                                 <input
// //                                     type="checkbox"
// //                                     id={option}
// //                                     value={option}
// //                                     checked={careInstructions.includes(option)}
// //                                     onChange={(e) => {
// //                                         if (e.target.checked) {
// //                                             setCareInstructions((prev) => [...prev, option]);
// //                                         } else {
// //                                             setCareInstructions((prev) =>
// //                                                 prev.filter((item) => item !== option)
// //                                             );
// //                                         }
// //                                     }}
// //                                     className="mr-2"
// //                                 />
// //                                 <label htmlFor={option} className="text-sm">
// //                                     {option}
// //                                 </label>
// //                             </div>
// //                         ))}
// //                     </div>
// //                 </div>

// //                 {/* Color Variations Section */}
// //                 <div className="border-t pt-4">
// //                     <h2 className="text-xl font-bold mb-2">Color Variations</h2>
// //                     {colors.map((col, colIndex) => (
// //                         <div key={colIndex} className="mb-6 p-4 border rounded">
// //                             <h3 className="font-semibold mb-2">Variation #{colIndex + 1}</h3>

// //                             {/* Color Selection */}
// //                             <div className="mb-4">
// //                                 <label className="block font-medium mb-1">Color</label>
// //                                 <select
// //                                     value={col.color}
// //                                     onChange={(e) =>
// //                                         handleColorChange(colIndex, "color", e.target.value)
// //                                     }
// //                                     className="w-full border border-gray-300 rounded px-3 py-2"
// //                                 >
// //                                     <option value="">Select a color</option>
// //                                     {[
// //                                         "Red",
// //                                         "Blue",
// //                                         "Green",
// //                                         "Yellow",
// //                                         "Black",
// //                                         "White",
// //                                         "Purple",
// //                                         "Pink",
// //                                         "Orange",
// //                                         "Gray",
// //                                     ].map((clr) => (
// //                                         <option key={clr} value={clr}>
// //                                             {clr}
// //                                         </option>
// //                                     ))}
// //                                 </select>
// //                             </div>

// //                             {/* Images Upload for this color */}
// //                             <div className="mb-4">
// //                                 <label className="block font-medium mb-2">Upload Images</label>
// //                                 <div className="flex flex-wrap gap-4">
// //                                     {col.images.map((imgFile, imgIndex) => (
// //                                         <div
// //                                             key={imgIndex}
// //                                             className="relative flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded cursor-pointer"
// //                                         >
// //                                             {imgFile ? (
// //                                                 <img
// //                                                     src={URL.createObjectURL(imgFile)}
// //                                                     alt="Preview"
// //                                                     className="object-cover w-full h-full rounded"
// //                                                 />
// //                                             ) : (
// //                                                 <span className="text-gray-400 text-sm">Add Image</span>
// //                                             )}
// //                                             <input
// //                                                 type="file"
// //                                                 className="opacity-0 absolute w-24 h-24"
// //                                                 accept="image/*"
// //                                                 onChange={(e) => {
// //                                                     if (e.target.files[0]) {
// //                                                         handleColorImageChange(colIndex, imgIndex, e.target.files[0]);
// //                                                     }
// //                                                 }}
// //                                             />
// //                                         </div>
// //                                     ))}
// //                                 </div>
// //                             </div>

// //                             {/* Pricing for this color */}
// //                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
// //                                 <div>
// //                                     <label className="block font-medium mb-1">Base Price</label>
// //                                     <input
// //                                         type="number"
// //                                         value={col.basePrice}
// //                                         onChange={(e) => handleBasePriceChange(colIndex, e.target.value)}
// //                                         className="w-full border border-gray-300 rounded px-3 py-2"
// //                                         placeholder="e.g., 1299"
// //                                     />
// //                                 </div>
// //                                 <div>
// //                                     <label className="block font-medium mb-1">Discount Price</label>
// //                                     <input
// //                                         type="number"
// //                                         value={col.discountPrice}
// //                                         onChange={(e) => handleDiscountPriceChange(colIndex, e.target.value)}
// //                                         className="w-full border border-gray-300 rounded px-3 py-2"
// //                                         placeholder="Final price after discount"
// //                                     />
// //                                 </div>
// //                                 <div>
// //                                     <label className="block font-medium mb-1">Discount Percentage</label>
// //                                     <input
// //                                         type="number"
// //                                         value={col.discountPercentage}
// //                                         readOnly
// //                                         className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
// //                                     />
// //                                 </div>
// //                             </div>

// //                             {/* Variants for this color */}
// //                             <div>
// //                                 <label className="block font-medium mb-1">Variants (Size & Stock)</label>
// //                                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
// //                                     {Object.entries(col.variants).map(([key, variant]) => (
// //                                         <div key={key}>
// //                                             <p className="text-sm mb-1">{variant.size}</p>
// //                                             <input
// //                                                 type="number"
// //                                                 value={variant.stock}
// //                                                 onChange={(e) => handleVariantChange(colIndex, key, e.target.value)}
// //                                                 placeholder="Stock"
// //                                                 min="0"
// //                                                 className="w-full border border-gray-300 rounded px-2 py-1"
// //                                             />
// //                                         </div>
// //                                     ))}
// //                                 </div>
// //                             </div>
// //                         </div>
// //                     ))}
// //                     <button
// //                         type="button"
// //                         onClick={addNewColor}
// //                         className="bg-blue-500 text-white px-4 py-2 rounded"
// //                     >
// //                         Add Another Color
// //                     </button>
// //                 </div>

// //                 {/* Submit Button */}
// //                 <div className="flex justify-end space-x-4">
// //                     <button
// //                         type="button"
// //                         onClick={() => console.log("Cancel clicked")}
// //                         className="border border-gray-400 px-4 py-2 rounded hover:bg-gray-100"
// //                     >
// //                         Cancel
// //                     </button>
// //                     <button type="submit" className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
// //                         Save Product
// //                     </button>
// //                 </div>
// //             </form>
// //         </div>
// //     );
// // };

// // export default AddProduct;







// import axios from "axios";
// import React, { useState } from "react";

// const AddProduct = () => {
//     // Common Product Fields
//     const [productName, setProductName] = useState("");
//     const [shortDescription, setShortDescription] = useState("");
//     const [productDescription, setProductDescription] = useState("");
//     const [brand, setBrand] = useState("");
//     const [category, setCategory] = useState(""); // e.g., Mens Wear, etc.
//     const [subCategory, setSubCategory] = useState(""); // Fixed options: Shirt, Pant, etc.
//     const [material, setMaterial] = useState("");
//     const [careInstructions, setCareInstructions] = useState([]);

//     // We'll auto-generate SKU in the submit handler.
//     const [sku, setSku] = useState("");

//     // Colors: Array of variations. Each variation has its own data.
//     const [colors, setColors] = useState([
//         {
//             color: "",
//             // 5 image slots per color variation.
//             images: [null, null, null, null, null],
//             basePrice: "",
//             discountPrice: "",
//             discountPercentage: "",
//             // Variants: added "Extra Large" along with others.
//             variants: {
//                 small: { size: "Small", stock: "" },
//                 medium: { size: "Medium", stock: "" },
//                 large: { size: "Large", stock: "" },
//                 extraLarge: { size: "Extra Large", stock: "" },
//             },
//         },
//     ]);

//     // Handle dynamic changes for each color variation.
//     const handleColorChange = (index, field, value) => {
//         setColors((prevColors) => {
//             const newColors = [...prevColors];
//             newColors[index] = { ...newColors[index], [field]: value };
//             return newColors;
//         });
//     };

//     // Handle image change for a specific color and image slot.
//     const handleColorImageChange = (colorIndex, imageIndex, file) => {
//         setColors((prevColors) => {
//             const newColors = [...prevColors];
//             const images = [...newColors[colorIndex].images];
//             images[imageIndex] = file;
//             newColors[colorIndex].images = images;
//             return newColors;
//         });
//     };

//     // Handle variant (size & stock) changes per color.
//     const handleVariantChange = (colorIndex, variantKey, value) => {
//         setColors((prevColors) => {
//             const newColors = [...prevColors];
//             newColors[colorIndex].variants[variantKey].stock = value;
//             return newColors;
//         });
//     };

//     // Discount logic for each color variation.
//     const handleBasePriceChange = (index, value) => {
//         setColors((prevColors) => {
//             const newColors = [...prevColors];
//             newColors[index].basePrice = value;
//             // Recalculate discount if discountPrice is set.
//             const base = parseFloat(value);
//             const discountPrice = parseFloat(newColors[index].discountPrice);
//             if (!isNaN(base) && !isNaN(discountPrice) && base > 0) {
//                 newColors[index].discountPercentage = (
//                     ((base - discountPrice) / base) *
//                     100
//                 ).toFixed(2);
//             }
//             return newColors;
//         });
//     };

//     const handleDiscountPriceChange = (index, value) => {
//         // Enforce discountPrice <= 999.
//         if (parseFloat(value) > 999) return;
//         setColors((prevColors) => {
//             const newColors = [...prevColors];
//             newColors[index].discountPrice = value;
//             const base = parseFloat(newColors[index].basePrice);
//             const discountPrice = parseFloat(value);
//             if (!isNaN(base) && !isNaN(discountPrice) && base > 0) {
//                 newColors[index].discountPercentage = (
//                     ((base - discountPrice) / base) *
//                     100
//                 ).toFixed(2);
//             }
//             return newColors;
//         });
//     };

//     // Add a new color variation section.
//     const addNewColor = () => {
//         setColors((prevColors) => [
//             ...prevColors,
//             {
//                 color: "",
//                 images: [null, null, null, null, null],
//                 basePrice: "",
//                 discountPrice: "",
//                 discountPercentage: "",
//                 variants: {
//                     small: { size: "Small", stock: "" },
//                     medium: { size: "Medium", stock: "" },
//                     large: { size: "Large", stock: "" },
//                     extraLarge: { size: "Extra Large", stock: "" },
//                 },
//             },
//         ]);
//     };

//     // Auto-generate SKU using brand, first letters of product name, and 4 random numbers.
//     const generateSku = () => {
//         const brandPart = brand ? brand.replace(/\s+/g, "").toUpperCase() : "BRAND";
//         const productPart =
//             productName
//                 .split(" ")
//                 .map((w) => w[0])
//                 .join("")
//                 .toUpperCase() || "PROD";
//         const randomPart = Math.floor(1000 + Math.random() * 9000);
//         return `${brandPart}-${productPart}-${randomPart}`;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         // Auto-generate SKU if not provided.
//         const generatedSku = generateSku();
//         setSku(generatedSku);

//         // Prepare the form data.
//         const formData = new FormData();
//         formData.append("name", productName);
//         formData.append("shortDescription", shortDescription);
//         formData.append("description", productDescription);
//         formData.append("brand", brand);
//         formData.append("category", category);
//         formData.append("subCategory", subCategory);
//         formData.append("sku", generatedSku);
//         formData.append("material", material);
//         formData.append("careInstructions", JSON.stringify(careInstructions));

//         // Process colors data: Calculate totalStock for each color.
//         const colorsData = colors.map((col) => {
//             const totalStock = Object.values(col.variants).reduce((acc, variant) => {
//                 const stockNum = parseInt(variant.stock, 10);
//                 return acc + (isNaN(stockNum) ? 0 : stockNum);
//             }, 0);
//             return { ...col, totalStock };
//         });
//         formData.append("colors", JSON.stringify(colorsData));

//         // Append images for each color variation.
//         colors.forEach((col, colorIndex) => {
//             col.images.forEach((img, imgIndex) => {
//                 if (img) {
//                     // Naming: color0_image0, color0_image1, ..., color1_image0, etc.
//                     formData.append(`color${colorIndex}_image`, img);
//                 }
//             });
//         });

//         try {
//             const response = await axios.post(
//                 "http://localhost:3333/seller/add-products",
//                 formData,
//                 {
//                     headers: { "Content-Type": "multipart/form-data" },
//                 }
//             );
//             console.log("Product added successfully:", response.data);
//         } catch (error) {
//             console.error("Error adding product:", error);
//         }
//     };

//     return (
//         <div className="mx-auto p-6 bg-white rounded shadow max-w-6xl">
//             <h1 className="text-2xl font-bold mb-4">Add Product</h1>
//             <form onSubmit={handleSubmit} className="space-y-6">
//                 {/* Common Product Fields */}
//                 <div className="flex space-x-4">
//                     <div className="w-1/2">
//                         <label className="block font-medium mb-1">Product Name</label>
//                         <input
//                             type="text"
//                             value={productName}
//                             onChange={(e) => setProductName(e.target.value)}
//                             required
//                             className="w-full border border-gray-300 rounded px-3 py-2"
//                             placeholder="Enter product name"
//                         />
//                     </div>
//                     <div className="w-1/2">
//                         <label className="block font-medium mb-1">Short Description</label>
//                         <input
//                             type="text"
//                             value={shortDescription}
//                             onChange={(e) => setShortDescription(e.target.value)}
//                             className="w-full border border-gray-300 rounded px-3 py-2"
//                             placeholder="Enter short description"
//                         />
//                     </div>
//                 </div>

//                 <div>
//                     <label className="block font-medium mb-1">Product Description</label>
//                     <textarea
//                         value={productDescription}
//                         onChange={(e) => setProductDescription(e.target.value)}
//                         className="w-full border border-gray-300 rounded px-3 py-2 h-24"
//                         placeholder="Enter detailed description"
//                     />
//                 </div>

//                 <div className="flex space-x-4">
//                     <div className="w-1/2">
//                         <label className="block font-medium mb-1">Brand</label>
//                         <input
//                             type="text"
//                             value={brand}
//                             onChange={(e) => setBrand(e.target.value)}
//                             required
//                             className="w-full border border-gray-300 rounded px-3 py-2"
//                             placeholder="Enter brand"
//                         />
//                     </div>
//                     <div className="w-1/2">
//                         <label className="block font-medium mb-1">Category</label>
//                         <select
//                             value={category}
//                             onChange={(e) => setCategory(e.target.value)}
//                             required
//                             className="w-full border border-gray-300 rounded px-3 py-2"
//                         >
//                             <option value="">Select a category</option>
//                             <option value="Mens Wear">Mens Wear</option>
//                             <option value="Boys">Boys</option>
//                         </select>
//                     </div>
//                 </div>

//                 <div className="flex space-x-4">
//                     <div className="w-1/2">
//                         <label className="block font-medium mb-1">SKU</label>
//                         {/* Auto-generated SKU will be set on submit */}
//                         <input
//                             type="text"
//                             value={sku}
//                             readOnly
//                             className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
//                             placeholder="Auto-generated SKU"
//                         />
//                     </div>
//                     <div className="w-1/2">
//                         <label className="block font-medium mb-1">Material</label>
//                         <input
//                             type="text"
//                             value={material}
//                             onChange={(e) => setMaterial(e.target.value)}
//                             className="w-full border border-gray-300 rounded px-3 py-2"
//                             placeholder="Enter material"
//                         />
//                     </div>
//                 </div>

//                 <div className="flex space-x-4">
//                     <div className="w-1/2">
//                         <label className="block font-medium mb-1">Sub Category</label>
//                         <select
//                             value={subCategory}
//                             onChange={(e) => setSubCategory(e.target.value)}
//                             required
//                             className="w-full border border-gray-300 rounded px-3 py-2"
//                         >
//                             <option value="">Select a sub category</option>
//                             <option value="Shirt">Shirt</option>
//                             <option value="Pant">Pant</option>
//                             <option value="Kurtha">Kurtha</option>
//                             <option value="Jogger">Jogger</option>
//                             <option value="Coat">Coat</option>
//                         </select>
//                     </div>
//                     <div className="w-1/2">
//                         <label className="block font-medium mb-1">Care Instructions</label>
//                         <div className="flex flex-wrap gap-4">
//                             {[
//                                 "Machine Wash",
//                                 "Hand Wash",
//                                 "Do Not Bleach",
//                                 "Tumble Dry Low",
//                                 "Iron Low",
//                                 "Dry Clean Only",
//                             ].map((option) => (
//                                 <div key={option} className="flex items-center">
//                                     <input
//                                         type="checkbox"
//                                         id={option}
//                                         value={option}
//                                         checked={careInstructions.includes(option)}
//                                         onChange={(e) => {
//                                             if (e.target.checked) {
//                                                 setCareInstructions((prev) => [...prev, option]);
//                                             } else {
//                                                 setCareInstructions((prev) =>
//                                                     prev.filter((item) => item !== option)
//                                                 );
//                                             }
//                                         }}
//                                         className="mr-2"
//                                     />
//                                     <label htmlFor={option} className="text-sm">
//                                         {option}
//                                     </label>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Color Variations Section */}
//                 <div className="border-t pt-4">
//                     <h2 className="text-xl font-bold mb-2">Color Variations</h2>
//                     {colors.map((col, colIndex) => (
//                         <div key={colIndex} className="mb-6 p-4 border rounded">
//                             <h3 className="font-semibold mb-2">Variation #{colIndex + 1}</h3>

//                             {/* Color Selection */}
//                             <div className="mb-4">
//                                 <label className="block font-medium mb-1">Color</label>
//                                 <select
//                                     value={col.color}
//                                     onChange={(e) =>
//                                         handleColorChange(colIndex, "color", e.target.value)
//                                     }
//                                     required
//                                     className="w-full border border-gray-300 rounded px-3 py-2"
//                                 >
//                                     <option value="">Select a color</option>
//                                     {[
//                                         "Red",
//                                         "Blue",
//                                         "Green",
//                                         "Yellow",
//                                         "Black",
//                                         "White",
//                                         "Purple",
//                                         "Pink",
//                                         "Orange",
//                                         "Gray",
//                                     ].map((clr) => (
//                                         <option key={clr} value={clr}>
//                                             {clr}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>

//                             {/* Images Upload for this color (5 images) */}
//                             <div className="mb-4">
//                                 <label className="block font-medium mb-2">Upload 5 Images</label>
//                                 <div className="flex flex-wrap gap-4">
//                                     {col.images.map((imgFile, imgIndex) => (
//                                         <div
//                                             key={imgIndex}
//                                             className="relative flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded cursor-pointer"
//                                         >
//                                             {imgFile ? (
//                                                 <img
//                                                     src={URL.createObjectURL(imgFile)}
//                                                     alt="Preview"
//                                                     className="object-cover w-full h-full rounded"
//                                                 />
//                                             ) : (
//                                                 <span className="text-gray-400 text-sm">Add Image</span>
//                                             )}
//                                             <input
//                                                 type="file"
//                                                 className="opacity-0 absolute w-24 h-24"
//                                                 accept="image/*"
//                                                 onChange={(e) => {
//                                                     if (e.target.files[0]) {
//                                                         handleColorImageChange(
//                                                             colIndex,
//                                                             imgIndex,
//                                                             e.target.files[0]
//                                                         );
//                                                     }
//                                                 }}
//                                             />
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>

//                             {/* Pricing for this color */}
//                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//                                 <div>
//                                     <label className="block font-medium mb-1">Base Price</label>
//                                     <input
//                                         type="number"
//                                         value={col.basePrice}
//                                         onChange={(e) =>
//                                             handleBasePriceChange(colIndex, e.target.value)
//                                         }
//                                         required
//                                         className="w-full border border-gray-300 rounded px-3 py-2"
//                                         placeholder="e.g., 1299"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block font-medium mb-1">Discount Price</label>
//                                     <input
//                                         type="number"
//                                         value={col.discountPrice}
//                                         onChange={(e) =>
//                                             handleDiscountPriceChange(colIndex, e.target.value)
//                                         }
//                                         required
//                                         max="999"
//                                         className="w-full border border-gray-300 rounded px-3 py-2"
//                                         placeholder="Final price after discount (max 999)"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block font-medium mb-1">
//                                         Discount Percentage
//                                     </label>
//                                     <input
//                                         type="number"
//                                         value={col.discountPercentage}
//                                         readOnly
//                                         className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
//                                     />
//                                 </div>
//                             </div>

//                             {/* Variants for this color */}
//                             <div>
//                                 <label className="block font-medium mb-1">
//                                     Variants (Size & Stock)
//                                 </label>
//                                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
//                                     {Object.entries(col.variants).map(([key, variant]) => (
//                                         <div key={key}>
//                                             <p className="text-sm mb-1">{variant.size}</p>
//                                             <input
//                                                 type="number"
//                                                 value={variant.stock}
//                                                 onChange={(e) =>
//                                                     handleVariantChange(colIndex, key, e.target.value)
//                                                 }
//                                                 placeholder="Stock"
//                                                 min="0"
//                                                 className="w-full border border-gray-300 rounded px-2 py-1"
//                                             />
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                     <button
//                         type="button"
//                         onClick={addNewColor}
//                         className="bg-blue-500 text-white px-4 py-2 rounded"
//                     >
//                         Add Another Color
//                     </button>
//                 </div>

//                 {/* Submit Button */}
//                 <div className="flex justify-end space-x-4">
//                     <button
//                         type="button"
//                         onClick={() => console.log("Cancel clicked")}
//                         className="border border-gray-400 px-4 py-2 rounded hover:bg-gray-100"
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         type="submit"
//                         className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
//                     >
//                         Save Product
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default AddProduct;



import axios from "axios";
import React, { useEffect, useState } from "react";

const AddProduct = () => {
    // Common Product Fields
    const [productName, setProductName] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [brand, setBrand] = useState("");
    const [category, setCategory] = useState(""); // e.g., Mens Wear, Boys
    const [subCategory, setSubCategory] = useState(""); // fixed options below
    const [material, setMaterial] = useState("");
    const [careInstructions, setCareInstructions] = useState([]);

    // SKU state (shown in realtime)
    const [sku, setSku] = useState("");

    // Colors: Array of variations. Each variation has its own data.
    const [colors, setColors] = useState([
        {
            color: "",
            // 5 image slots per color variation.
            images: [null, null, null, null, null],
            basePrice: "",
            discountPrice: "",
            discountPercentage: "",
            // Variants: added "Extra Large" along with others.
            variants: {
                small: { size: "Small", stock: "" },
                medium: { size: "Medium", stock: "" },
                large: { size: "Large", stock: "" },
                extraLarge: { size: "Extra Large", stock: "" },
            },
        },
    ]);

    // Compute SKU on the fly whenever brand or productName changes.
    useEffect(() => {
        const generateSku = () => {
            const brandPart = brand ? brand.replace(/\s+/g, "").toUpperCase() : "BRAND";
            const productPart =
                productName
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .toUpperCase() || "PROD";
            const randomPart = Math.floor(1000 + Math.random() * 9000);
            return `${brandPart}-${productPart}-${randomPart}`;
        };
        setSku(generateSku());
    }, [brand, productName]);

    // Handle dynamic changes for each color variation.
    const handleColorChange = (index, field, value) => {
        setColors((prevColors) => {
            const newColors = [...prevColors];
            newColors[index] = { ...newColors[index], [field]: value };
            return newColors;
        });
    };

    // Handle image change for a specific color and image slot.
    const handleColorImageChange = (colorIndex, imageIndex, file) => {
        setColors((prevColors) => {
            const newColors = [...prevColors];
            const images = [...newColors[colorIndex].images];
            images[imageIndex] = file;
            newColors[colorIndex].images = images;
            return newColors;
        });
    };

    // Handle variant (size & stock) changes per color.
    const handleVariantChange = (colorIndex, variantKey, value) => {
        setColors((prevColors) => {
            const newColors = [...prevColors];
            newColors[colorIndex].variants[variantKey].stock = value;
            return newColors;
        });
    };

    // Discount logic for each color variation.
    const handleBasePriceChange = (index, value) => {
        setColors((prevColors) => {
            const newColors = [...prevColors];
            newColors[index].basePrice = value;
            // Recalculate discount if discountPrice is set.
            const base = parseFloat(value);
            const discountPrice = parseFloat(newColors[index].discountPrice);
            if (!isNaN(base) && !isNaN(discountPrice) && base > 0) {
                newColors[index].discountPercentage = (
                    ((base - discountPrice) / base) *
                    100
                ).toFixed(2);
            }
            return newColors;
        });
    };

    const handleDiscountPriceChange = (index, value) => {
        // Enforce discountPrice <= 999.
        if (parseFloat(value) > 999) return;
        setColors((prevColors) => {
            const newColors = [...prevColors];
            newColors[index].discountPrice = value;
            const base = parseFloat(newColors[index].basePrice);
            const discountPrice = parseFloat(value);
            if (!isNaN(base) && !isNaN(discountPrice) && base > 0) {
                newColors[index].discountPercentage = (
                    ((base - discountPrice) / base) *
                    100
                ).toFixed(2);
            }
            return newColors;
        });
    };

    // Add a new color variation section.
    const addNewColor = () => {
        setColors((prevColors) => [
            ...prevColors,
            {
                color: "",
                images: [null, null, null, null, null],
                basePrice: "",
                discountPrice: "",
                discountPercentage: "",
                variants: {
                    small: { size: "Small", stock: "" },
                    medium: { size: "Medium", stock: "" },
                    large: { size: "Large", stock: "" },
                    extraLarge: { size: "Extra Large", stock: "" },
                },
            },
        ]);
    };

    // Clear a color variation form (reset its fields), but ensure at least one remains.
    const clearColorVariant = (index) => {
        if (colors.length === 1) return;
        setColors((prevColors) => {
            const newColors = [...prevColors];
            newColors.splice(index, 1);
            return newColors;
        });
    };

    // Calculate total quantity from all color variants across all sizes.
    const totalQuantity = colors.reduce((total, col) => {
        const colorStock = Object.values(col.variants).reduce((acc, variant) => {
            const stockNum = parseInt(variant.stock, 10);
            return acc + (isNaN(stockNum) ? 0 : stockNum);
        }, 0);
        return total + colorStock;
    }, 0);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare the form data.
        const formData = new FormData();
        formData.append("name", productName);
        formData.append("shortDescription", shortDescription);
        formData.append("description", productDescription);
        formData.append("brand", brand);
        formData.append("category", category);
        formData.append("subCategory", subCategory);
        formData.append("sku", sku);
        formData.append("material", material);
        formData.append("careInstructions", JSON.stringify(careInstructions));

        // Process colors data: Calculate totalStock for each color.
        const colorsData = colors.map((col) => {
            const totalStock = Object.values(col.variants).reduce((acc, variant) => {
                const stockNum = parseInt(variant.stock, 10);
                return acc + (isNaN(stockNum) ? 0 : stockNum);
            }, 0);
            return { ...col, totalStock };
        });
        formData.append("colors", JSON.stringify(colorsData));

        // Append images for each color variation.
        colors.forEach((col, colorIndex) => {
            col.images.forEach((img, imgIndex) => {
                if (img) {
                    // Naming: color0_image0, color0_image1, etc.
                    formData.append(`color${colorIndex}_image`, img);
                }
            });
        });

        try {
            const response = await axios.post(
                "http://localhost:3333/seller/add-products",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            console.log("Product added successfully:", response.data);
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    return (
        <div className="mx-auto p-6 bg-white rounded shadow max-w-6xl">
            <h1 className="text-2xl font-bold mb-4">Add Product</h1>
            {/* Real-time SKU display */}
            <div className="mb-4">
                <label className="block font-medium">SKU (Auto-generated):</label>
                <input
                    type="text"
                    value={sku}
                    readOnly
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                />
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Common Product Fields */}
                <div className="flex space-x-4">
                    <div className="w-1/2">
                        <label className="block font-medium mb-1">Product Name</label>
                        <input
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="Enter product name"
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="block font-medium mb-1">Short Description</label>
                        <input
                            type="text"
                            value={shortDescription}
                            onChange={(e) => setShortDescription(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="Enter short description"
                        />
                    </div>
                </div>

                <div>
                    <label className="block font-medium mb-1">Product Description</label>
                    <textarea
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 h-24"
                        placeholder="Enter detailed description"
                    />
                </div>

                <div className="flex space-x-4">
                    <div className="w-1/2">
                        <label className="block font-medium mb-1">Brand</label>
                        <input
                            type="text"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="Enter brand"
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="block font-medium mb-1">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
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
                        <label className="block font-medium mb-1">Sub Category</label>
                        <select
                            value={subCategory}
                            onChange={(e) => setSubCategory(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        >
                            <option value="">Select a sub category</option>
                            {/* Extended subcategory options */}
                            <option value="Shirt">Shirt</option>
                            <option value="Pant">Pant</option>
                            <option value="Kurtha">Kurtha</option>
                            <option value="Jogger">Jogger</option>
                            <option value="Coat">Coat</option>
                            <option value="T-Shirt">T-Shirt</option>
                            <option value="Shorts">Shorts</option>
                            <option value="Track Pants">Track Pants</option>
                        </select>
                    </div>
                    <div className="w-1/2">
                        <label className="block font-medium mb-1">Material</label>
                        <input
                            type="text"
                            value={material}
                            onChange={(e) => setMaterial(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="Enter material"
                        />
                    </div>
                </div>

                <div className="flex space-x-4">
                    <div className="w-1/2">
                        <label className="block font-medium mb-1">Care Instructions</label>
                        <div className="flex flex-wrap gap-4">
                            {[
                                "Machine Wash",
                                "Hand Wash",
                                "Do Not Bleach",
                                "Tumble Dry Low",
                                "Iron Low",
                                "Dry Clean Only",
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
                    <div className="w-1/2 flex flex-col justify-end">
                        {/* Total Quantity Field (read-only) */}
                        <label className="block font-medium mb-1">Total Quantity</label>
                        <input
                            type="number"
                            value={totalQuantity}
                            readOnly
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                        />
                    </div>
                </div>

                {/* Color Variations Section */}
                <div className="border-t pt-4">
                    <h2 className="text-xl font-bold mb-2">Color Variations</h2>
                    {colors.map((col, colIndex) => (
                        <div key={colIndex} className="mb-6 p-4 border rounded relative">
                            <h3 className="font-semibold mb-2">Variation #{colIndex + 1}</h3>
                            {/* Clear button (if more than one color exists) */}
                            {colors.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => clearColorVariant(colIndex)}
                                    className="absolute top-2 right-2 text-sm text-red-600"
                                >
                                    Clear
                                </button>
                            )}

                            {/* Color Selection */}
                            <div className="mb-4">

                                <div className="w-1/2">
                                    <label className="block font-medium mb-1">Color</label>
                                    <select
                                        value={col.color}
                                        onChange={(e) =>
                                            handleColorChange(colIndex, "color", e.target.value)
                                        }
                                        required
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
                                        ].map((clr) => (
                                            <option key={clr} value={clr}>
                                                {clr}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Images Upload for this color (5 images) */}
                            <div className="mb-4">
                                <label className="block font-medium mb-2">Upload 5 Images</label>
                                <div className="flex flex-wrap gap-4">
                                    {col.images.map((imgFile, imgIndex) => (
                                        <div
                                            key={imgIndex}
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
                                                        handleColorImageChange(
                                                            colIndex,
                                                            imgIndex,
                                                            e.target.files[0]
                                                        );
                                                    }
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pricing for this color */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="block font-medium mb-1">Base Price</label>
                                    <input
                                        type="number"
                                        value={col.basePrice}
                                        onChange={(e) =>
                                            handleBasePriceChange(colIndex, e.target.value)
                                        }
                                        required
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                        placeholder="e.g., 1299"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium mb-1">Discount Price</label>
                                    <input
                                        type="number"
                                        value={col.discountPrice}
                                        onChange={(e) =>
                                            handleDiscountPriceChange(colIndex, e.target.value)
                                        }
                                        required
                                        max="999"
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                        placeholder="Final price after discount (max 999)"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium mb-1">
                                        Discount Percentage
                                    </label>
                                    <input
                                        type="number"
                                        value={col.discountPercentage}
                                        readOnly
                                        className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                                    />
                                </div>
                            </div>

                            {/* Variants for this color */}
                            <div>
                                <label className="block font-medium mb-1">
                                    Variants (Size & Stock)
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {Object.entries(col.variants).map(([key, variant]) => (
                                        <div key={key}>
                                            <p className="text-sm mb-1">{variant.size}</p>
                                            <input
                                                type="number"
                                                value={variant.stock}
                                                onChange={(e) =>
                                                    handleVariantChange(colIndex, key, e.target.value)
                                                }
                                                placeholder="Stock"
                                                min="0"
                                                className="w-full border border-gray-300 rounded px-2 py-1"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addNewColor}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Add Another Color
                    </button>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => console.log("Cancel clicked")}
                        className="border border-gray-400 px-4 py-2 rounded hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
                    >
                        Save Product
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;

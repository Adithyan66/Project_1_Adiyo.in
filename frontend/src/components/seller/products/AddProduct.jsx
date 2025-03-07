



import axios from "axios";
import React, { useEffect, useState } from "react";

const AddProduct = ({ setSelectedSection }) => {
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
    const handleColorImageChange = (colorIndex, imageIndex, file, event) => {
        setColors((prevColors) => {
            const newColors = [...prevColors];
            const images = [...newColors[colorIndex].images];
            images[imageIndex] = file;
            newColors[colorIndex].images = images;
            return newColors;
        });
        event.target.value = "";
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
                    formData.append(`color${colorIndex}_image${imgIndex}`, img,
                        `${Date.now()}_${Math.random().toString(36).substring(2)}_${img.name}`
                    );
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
                                                            e.target.files[0],
                                                            e
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
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Add Color
                    </button>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => setSelectedSection("products")}
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



import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ImagePreview from "../../common/ImagePreview";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function EditProduct() {
    const navigate = useNavigate();
    const productId = useSelector(
        (state) => state.sellerSideSelected.editProductID
    );

    const [loading, setLoading] = useState(true);

    const [sku, setSku] = useState("");
    const [productName, setProductName] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [brand, setBrand] = useState("");
    const [category, setCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [material, setMaterial] = useState("");
    const [careInstructions, setCareInstructions] = useState([]);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [colors, setColors] = useState([]);

    useEffect(() => {
        async function fetchProductDetails() {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/seller/products/${productId}`
                );
                const product = response.data.product;

                // Pre-populate form fields from fetched product details
                setSku(product.sku || "");
                setProductName(product.name || "");
                setShortDescription(product.shortDescription || "");
                setProductDescription(product.description || "");
                setBrand(product.brand || "");
                setCategory(product.category || "");
                setSubCategory(product.subCategory || "");
                setMaterial(product.material || "");
                setCareInstructions(product.careInstructions || []);
                setTotalQuantity(product.totalQuantity || 0);
                // Ensure that each color object contains imagePublicIds if available
                setColors(product.colors || []);
            } catch (error) {
                console.error("Error fetching product details:", error);
            } finally {
                setLoading(false);
            }
        }

        if (productId) {
            fetchProductDetails();
        }
    }, [productId]);

    // Functions for handling color variations and dynamic variants
    const addNewColor = () => {
        setColors([
            ...colors,
            {
                color: "",
                images: [null, null, null, null, null],
                basePrice: "",
                discountPrice: "",
                discountPercentage: "",
                variants: {},
                // Optionally, if there are no previous images, imagePublicIds may be empty:
                imagePublicIds: [],
            },
        ]);
    };

    const clearColorVariant = (colIndex) => {
        setColors(colors.filter((_, index) => index !== colIndex));
    };

    const handleColorChange = (colIndex, key, value) => {
        setColors((prevColors) => {
            const updatedColors = [...prevColors];
            updatedColors[colIndex] = { ...updatedColors[colIndex], [key]: value };
            return updatedColors;
        });
    };

    const handleColorImageChange = (colIndex, imgIndex, file) => {
        setColors((prevColors) => {
            const updatedColors = [...prevColors];
            const currentImages = updatedColors[colIndex].images;
            currentImages[imgIndex] = file;
            updatedColors[colIndex] = { ...updatedColors[colIndex], images: currentImages };
            return updatedColors;
        });
    };

    const handleBasePriceChange = (colIndex, value) => {
        setColors((prevColors) => {
            const updatedColors = [...prevColors];
            updatedColors[colIndex] = { ...updatedColors[colIndex], basePrice: value };
            return updatedColors;
        });
    };

    const handleDiscountPriceChange = (colIndex, value) => {
        setColors((prevColors) => {
            const updatedColors = [...prevColors];
            const basePrice = Number(updatedColors[colIndex].basePrice) || 0;
            const discountPrice = Number(value);
            const discountPercentage =
                basePrice > 0 ? Math.round(((basePrice - discountPrice) / basePrice) * 100) : 0;
            updatedColors[colIndex] = {
                ...updatedColors[colIndex],
                discountPrice: value,
                discountPercentage,
            };
            return updatedColors;
        });
    };

    const handleVariantChange = (colIndex, variantKey, value) => {
        setColors((prevColors) => {
            const updatedColors = [...prevColors];
            const currentVariants = { ...updatedColors[colIndex].variants };
            currentVariants[variantKey] = {
                size: variantKey,
                stock: Number(value),
            };
            updatedColors[colIndex] = { ...updatedColors[colIndex], variants: currentVariants };
            return updatedColors;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        // Append simple text fields
        formData.append("sku", sku);
        formData.append("name", productName);
        formData.append("shortDescription", shortDescription);
        formData.append("description", productDescription);
        formData.append("brand", brand);
        formData.append("category", category);
        formData.append("subCategory", subCategory);
        formData.append("material", material);
        formData.append("careInstructions", JSON.stringify(careInstructions));
        formData.append("totalQuantity", totalQuantity);

        // Create a new colors array excluding the image file objects
        // (but keep the existing imagePublicIds, variants, etc.)
        const colorsForJson = colors.map((color) => {
            const { images, ...rest } = color;
            return rest;
        });
        formData.append("colors", JSON.stringify(colorsForJson));

        // Append image files separately with a naming convention: color{i}_image
        colors.forEach((color, i) => {
            color.images.forEach((imgFile) => {
                if (imgFile instanceof File) {
                    formData.append(
                        `color${i}_image`,
                        imgFile,
                        `${Date.now()}_${Math.random().toString(36).substring(2)}_${imgFile.name}`
                    );
                }
            });
        });


        try {

            const response = await axios.put(
                `${API_BASE_URL}/seller/edit-product/${productId}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            console.log("Updated product:", response.data.product);
            toast.success("product updated")

        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="mx-auto p-6 bg-white rounded shadow max-w-6xl">
            <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
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
                            {colors.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => clearColorVariant(colIndex)}
                                    className="absolute top-2 right-2 text-sm text-red-600"
                                >
                                    Clear
                                </button>
                            )}
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
                            <div className="mb-4">
                                <label className="block font-medium mb-2">Upload 5 Images</label>
                                <div className="flex flex-wrap gap-4">
                                    {col.images.map((imgFile, imgIndex) => (
                                        <div
                                            key={imgIndex}
                                            className="relative flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded cursor-pointer"
                                        >
                                            {imgFile ? (
                                                <ImagePreview file={imgFile} />
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
                            <div>
                                <label className="block font-medium mb-1">
                                    Variants (Size & Stock)
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {col.variants &&
                                        Object.entries(col.variants).map(([key, variant]) => (
                                            <div key={key}>
                                                <p className="text-sm mb-1">{variant.size}</p>
                                                <input
                                                    type="number"
                                                    value={variant.stock}
                                                    onChange={(e) =>
                                                        handleVariantChange(
                                                            colIndex,
                                                            key,
                                                            e.target.value
                                                        )
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
                        onClick={() => navigate("/products")}
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
}

export default EditProduct;

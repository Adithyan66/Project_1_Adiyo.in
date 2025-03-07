

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
    // originalProduct holds the product as fetched from the backend
    const [originalProduct, setOriginalProduct] = useState(null);
    // editedColors holds only the changes made by the user (initially, copy the colors array)
    const [editedColors, setEditedColors] = useState([]);

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

    useEffect(() => {
        async function fetchProductDetails() {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/seller/products/${productId}`
                );
                const product = response.data.product;
                setOriginalProduct(product);
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
                // Initialize editedColors with a deep copy of product.colors
                setEditedColors(JSON.parse(JSON.stringify(product.colors || [])));
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

    // When a new file is selected for a specific color and image index, update editedColors
    const handleColorImageChange = (colIndex, imgIndex, file) => {
        setEditedColors((prevColors) => {
            const newColors = [...prevColors];
            // Replace the image at imgIndex with the new File
            newColors[colIndex][imgIndex] = file;
            return newColors;
        });
    };

    // Other field update functions (for text fields, variants, etc.) will update editedColors similarly
    const handleColorChange = (colIndex, key, value) => {
        setEditedColors((prevColors) => {
            const newColors = [...prevColors];
            newColors[colIndex] = { ...newColors[colIndex], [key]: value };
            return newColors;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        // Append simple text fields.
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

        // Merge editedColors with originalProduct.colors:
        // For each color, for each image slot, if the editedColors entry is a File, that means an update.
        // Otherwise, we use the URL from originalProduct.
        const mergedColors = originalProduct.colors.map((origColor, i) => {
            const updatedColor = { ...origColor };
            updatedColor.images = origColor.images.map((imgUrl, j) => {
                if (editedColors[i] && editedColors[i][j] instanceof File) {
                    // Placeholder (null) will be used on backend to indicate file upload for this index.
                    return null;
                }
                return imgUrl;
            });
            return updatedColor;
        });
        formData.append("colors", JSON.stringify(mergedColors));

        // Append only the new image Files using the naming convention "color{colorIndex}_image_{imageIndex}"
        editedColors.forEach((color, i) => {
            // If a color row is missing (should not be) skip it.
            if (!color) return;
            color.forEach((img, j) => {
                if (img instanceof File) {
                    formData.append(
                        `color${i}_image_${j}`,
                        img,
                        `${Date.now()}_${Math.random().toString(36).substring(2)}_${img.name}`
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
            toast.success("Product updated");
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

                {/* (Other common fields go here similar to your original code) */}

                {/* Color Variations Section */}
                <div className="border-t pt-4">
                    <h2 className="text-xl font-bold mb-2">Color Variations</h2>
                    {editedColors.map((col, colIndex) => (
                        <div key={colIndex} className="mb-6 p-4 border rounded relative">
                            <h3 className="font-semibold mb-2">Variation #{colIndex + 1}</h3>
                            {editedColors.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setEditedColors((prev) =>
                                            prev.filter((_, index) => index !== colIndex)
                                        )
                                    }
                                    className="absolute top-2 right-2 text-sm text-red-600"
                                >
                                    Clear
                                </button>
                            )}
                            <div className="mb-4">
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
                            <div className="mb-4">
                                <label className="block font-medium mb-2">Upload 5 Images</label>
                                <div className="flex flex-wrap gap-4">
                                    {col.images.map((img, imgIndex) => (
                                        <div
                                            key={imgIndex}
                                            className="relative flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded cursor-pointer"
                                        >
                                            {img && !(img instanceof File) ? (
                                                <img
                                                    src={img}
                                                    alt={`Color ${colIndex} - ${imgIndex}`}
                                                    className="w-full h-full object-cover rounded"
                                                />
                                            ) : img instanceof File ? (
                                                <ImagePreview file={img} />
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
                            {/* (Other color variant fields: basePrice, discountPrice, variants, etc.) */}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() =>
                            setEditedColors((prev) => [
                                ...prev,
                                {
                                    color: "",
                                    images: [null, null, null, null, null],
                                    basePrice: "",
                                    discountPrice: "",
                                    discountPercentage: "",
                                    variants: {},
                                    imagePublicIds: [],
                                },
                            ])
                        }
                        className="bg-black text-white px-4 py-2 rounded"
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

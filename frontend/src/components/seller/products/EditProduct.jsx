



import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ImagePreview from "../../common/ImagePreview";
import { toast } from "react-toastify";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { CloseIcon } from "../../../icons/icons";
import { getCategoryList } from "../../../services/categoryService";
import { editProduct, getProductDetils } from "../../../services/productService";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function EditProduct({ setSelectedSection }) {
    const navigate = useNavigate();
    const productId = useSelector(
        (state) => state.sellerSideSelected.editProductID
    );

    const [loading, setLoading] = useState(true);
    const [originalProduct, setOriginalProduct] = useState(null);
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

    // ---------- Cropping State & Functions ----------
    const [cropMode, setCropMode] = useState(false);
    const [tempImage, setTempImage] = useState(null);
    const [imgSrc, setImgSrc] = useState("");
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState(null);
    const [imgRef, setImgRef] = useState(null);
    const [activeColorIndex, setActiveColorIndex] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(null);

    const [categories, setCategories] = useState([]);

    useEffect(() => {

        async function fetchCategories() {

            try {
                //const response = await axios.get(`${API_BASE_URL}/seller/categories`);
                // Assuming the response returns an array of categories
                const response = await getCategoryList()
                setCategories(response.data.categories);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        }
        fetchCategories();
    }, []);


    function onImageLoad(e) {
        const { width, height } = e.currentTarget;
        setImgRef(e.currentTarget);
        const targetAspect = 4 / 5;
        const imageAspect = width / height;
        const tolerance = 0.01;
        let cropObj;
        if (Math.abs(imageAspect - targetAspect) < tolerance) {
            cropObj = {
                unit: "%",
                x: 0,
                y: 0,
                width: 100,
                height: 100,
            };
        } else {
            cropObj = centerCrop(
                makeAspectCrop(
                    {
                        unit: "%",
                        width: 90,
                    },
                    targetAspect,
                    width,
                    height
                ),
                width,
                height
            );
        }
        setCrop(cropObj);
    }

    // Save the cropped image and update the editedColors state
    const handleSaveCrop = () => {
        if (completedCrop && imgRef) {
            const canvas = document.createElement("canvas");
            const scaleX = imgRef.naturalWidth / imgRef.width;
            const scaleY = imgRef.naturalHeight / imgRef.height;
            canvas.width = completedCrop.width;
            canvas.height = completedCrop.height;
            const ctx = canvas.getContext("2d");

            const pixelRatio = window.devicePixelRatio;
            canvas.width = completedCrop.width * pixelRatio;
            canvas.height = completedCrop.height * pixelRatio;
            ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
            ctx.imageSmoothingQuality = "high";

            ctx.drawImage(
                imgRef,
                completedCrop.x * scaleX,
                completedCrop.y * scaleY,
                completedCrop.width * scaleX,
                completedCrop.height * scaleY,
                0,
                0,
                completedCrop.width,
                completedCrop.height
            );

            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        const croppedFile = new File(
                            [blob],
                            `cropped_image_${Date.now()}.jpg`,
                            {
                                type: "image/jpeg",
                                lastModified: Date.now(),
                            }
                        );
                        setEditedColors((prevColors) => {
                            const newColors = [...prevColors];
                            // Replace the image at the active color and image index with the cropped file.
                            newColors[activeColorIndex].images[activeImageIndex] = croppedFile;
                            return newColors;
                        });
                        setCropMode(false);
                        setImgSrc("");
                        setCompletedCrop(null);
                        setTempImage(null);
                    }
                },
                "image/jpeg",
                0.95
            );
        }
    };

    const handleCancelCrop = () => {
        setCropMode(false);
        setImgSrc("");
        setCompletedCrop(null);
        setTempImage(null);
    };

    // Use this function to initiate the cropping session when an image is selected.
    const handleColorImageSelect = (colIndex, imgIndex, file, event) => {
        if (file) {
            setTempImage(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImgSrc(e.target.result);
                setActiveColorIndex(colIndex);
                setActiveImageIndex(imgIndex);
                setCropMode(true);
            };
            reader.readAsDataURL(file);
        }
        if (event) {
            event.target.value = "";
        }
    };
    // ---------- End Cropping Functions ----------

    // ------------- Fetch Product Details -------------
    useEffect(() => {
        async function fetchProductDetails() {
            try {
                // const response = await axios.get(
                //     `${API_BASE_URL}/seller/products/${productId}`
                // );
                const response = await getProductDetils(productId)

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
                // Deep copy colors
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

    // ------------- Handlers for Colors & Variants -------------
    const handleColorChange = (colIndex, key, value) => {
        setEditedColors((prevColors) => {
            const newColors = [...prevColors];
            newColors[colIndex] = { ...newColors[colIndex], [key]: value };
            return newColors;
        });
    };

    const handleVariantChange = (colIndex, key, value) => {
        setEditedColors((prevColors) => {
            const newColors = [...prevColors];
            newColors[colIndex].variants = {
                ...newColors[colIndex].variants,
                [key]: { ...newColors[colIndex].variants[key], stock: value },
            };
            return newColors;
        });
    };

    const handleBasePriceChange = (colIndex, value) => {
        handleColorChange(colIndex, "basePrice", value);
    };

    const handleDiscountPriceChange = (colIndex, value) => {
        handleColorChange(colIndex, "discountPrice", value);
        // Optionally, calculate discountPercentage here.
    };

    const addNewColor = () => {
        setEditedColors((prev) => [
            ...prev,
            {
                color: "",
                images: [null, null, null, null, null],
                basePrice: "",
                discountPrice: "",
                discountPercentage: "",
                variants: {
                    S: { size: "S", stock: 0 },
                    M: { size: "M", stock: 0 },
                    L: { size: "L", stock: 0 },
                    XL: { size: "XL", stock: 0 },
                },
            },
        ]);
    };

    // ------------- Submit Handler -------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

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

        // Merge editedColors with original product colors
        const mergedColors = originalProduct.colors.map((origColor, i) => {
            const updatedColor = { ...origColor, ...editedColors[i] };
            updatedColor.images = origColor.images.map((imgUrl, j) => {
                if (editedColors[i] && editedColors[i].images[j] instanceof File) {
                    return null; // indicate file upload for this index
                }
                return imgUrl;
            });
            return updatedColor;
        });
        formData.append("colors", JSON.stringify(mergedColors));

        // Append new image files with naming convention.
        editedColors.forEach((color, i) => {
            if (!color) return;
            color.images.forEach((img, j) => {
                if (img instanceof File) {
                    formData.append(
                        `color${i}_image_${j}`,
                        img,
                        `${Date.now()}_${Math.random()
                            .toString(36)
                            .substring(2)}_${img.name}`
                    );
                }
            });
        });

        try {
            // const response = await axios.put(
            //     `${API_BASE_URL}/seller/edit-product/${productId}`,
            //     formData,
            //     { headers: { "Content-Type": "multipart/form-data" } }
            // );
            const response = await editProduct(productId, formData)

            console.log("Updated product:", response.data.product);
            toast.success("Product updated");
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };



    const selectedCategory =
        categories.find((cat) => cat._id === category) || null;
    const subcategories = selectedCategory ? selectedCategory.subcategories : [];


    if (loading) return <div>Loading...</div>;

    return (
        <div className="mx-auto p-6 bg-white rounded shadow max-w-6xl">
            <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
            {/* Real-time SKU display */}
            <div className="mb-4">
                <label className="block font-medium">
                    SKU (Auto-generated):
                </label>
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
                        <label className="block font-medium mb-1">
                            Product Name
                        </label>
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
                        <label className="block font-medium mb-1">
                            Short Description
                        </label>
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
                    <label className="block font-medium mb-1">
                        Product Description
                    </label>
                    <textarea
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 h-84"
                        placeholder="Enter detailed description"
                    />
                </div>

                <div className="flex space-x-4">
                    <div className="w-1/2">
                        <label className="block font-medium mb-1">
                            Brand
                        </label>
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
                            onChange={(e) => {
                                setCategory(e.target.value);
                                // Reset subcategory if a different main category is selected
                                setSubCategory("");
                            }}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
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
                            {subcategories.map((sub) => (
                                <option key={sub._id} value={sub._id}>
                                    {sub.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="w-1/2">
                        <label className="block font-medium mb-1">
                            Material
                        </label>
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
                        <label className="block font-medium mb-1">
                            Care Instructions
                        </label>
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
                        <label className="block font-medium mb-1">
                            Total Quantity
                        </label>
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
                    {editedColors.map((col, colIndex) => (
                        <div key={colIndex} className="mb-6 p-4 border rounded relative">
                            <h3 className="font-semibold mb-2">
                                Variation #{colIndex + 1}
                            </h3>
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
                                <label className="block font-medium mb-1">
                                    Color
                                </label>
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

                            {/* Images Upload */}
                            <div className="mb-4">
                                <label className="block font-medium mb-2">
                                    Upload 5 Images
                                </label>
                                <div className="flex flex-wrap gap-4">
                                    {col.images.map((img, imgIndex) => (
                                        <div
                                            key={imgIndex}
                                            className="relative flex flex-col items-center justify-center w-80 h-80 border-2 border-dashed border-gray-300 rounded cursor-pointer"
                                        >
                                            {img && !(img instanceof File) ? (
                                                <img
                                                    src={img}
                                                    alt={`Color ${colIndex} - ${imgIndex}`}
                                                    className="object-cover w-full h-full rounded"
                                                />
                                            ) : img instanceof File ? (
                                                <ImagePreview file={img} />
                                            ) : (
                                                <span className="text-gray-400 text-sm">
                                                    Add Image
                                                </span>
                                            )}
                                            <input
                                                type="file"
                                                className="opacity-0 absolute w-80 h-80"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    if (e.target.files[0]) {
                                                        // Use the cropping function when selecting an image
                                                        handleColorImageSelect(
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
                                    <label className="block font-medium mb-1">
                                        Base Price
                                    </label>
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
                                    <label className="block font-medium mb-1">
                                        Discount Price
                                    </label>
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
                    {/* <button
                        type="button"
                        onClick={addNewColor}
                        className="bg-black text-white px-4 py-2 rounded"
                    >
                        Add Color
                    </button> */}
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

            {/* Cropping Modal */}
            {cropMode && imgSrc && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    {/* Semi-transparent backdrop */}
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    {/* Modal container */}
                    <div className="relative bg-white rounded-lg max-w-[620px] w-full p-4 shadow z-10">
                        {/* Close icon button */}
                        <button
                            onClick={handleCancelCrop}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            <CloseIcon />
                        </button>
                        <h3 className="text-xl font-bold mb-4">Crop Image</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Drag to position. The crop maintains a 4:5 aspect ratio.
                        </p>
                        <div className="mb-4 flex justify-center">
                            <div className="max-w-[400px]">
                                <ReactCrop
                                    crop={crop}
                                    onChange={(c) => setCrop(c)}
                                    onComplete={(c) => setCompletedCrop(c)}
                                    aspect={4 / 5}
                                    circularCrop={false}
                                >
                                    <img
                                        src={imgSrc}
                                        onLoad={onImageLoad}
                                        alt="Crop Preview"
                                        className="w-full object-contain"
                                    />
                                </ReactCrop>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={handleCancelCrop}
                                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveCrop}
                                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700"
                                disabled={!completedCrop?.width || !completedCrop?.height}
                            >
                                Save Crop
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EditProduct;

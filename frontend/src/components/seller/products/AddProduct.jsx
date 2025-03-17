

import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { CloseIcon } from "../../../icons/icons";
const API_BASE_URL = import.meta.env.VITE_API_URL;



const AddProduct = ({ setSelectedSection }) => {


    const [productName, setProductName] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [brand, setBrand] = useState("");
    const [category, setCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [material, setMaterial] = useState("");
    const [careInstructions, setCareInstructions] = useState([]);

    const [dbCategories, setDbCategories] = useState([])
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);

    // SKU state (shown in realtime)
    const [sku, setSku] = useState("");

    // Cropping state
    const [cropMode, setCropMode] = useState(false);
    const [tempImage, setTempImage] = useState(null);
    const [colorIndex, setColorIndex] = useState(0);
    const [imageIndex, setImageIndex] = useState(0);
    const [imgSrc, setImgSrc] = useState('');
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState(null);
    const [imgRef, setImgRef] = useState(null);

    // Colors: Array of variations. Each variation has its own data.
    const [colors, setColors] = useState([
        {
            color: "",
            // 5 image slots per color variation.
            images: [null, null, null, null, null],
            // Store cropped images separately
            croppedImages: [null, null, null, null, null],
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

    // Initialize crop when an image is selected
    function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
        return centerCrop(
            makeAspectCrop(
                {
                    unit: '%',
                    width: 90,
                },
                aspect,
                mediaWidth,
                mediaHeight,
            ),
            mediaWidth,
            mediaHeight,
        );
    }


    function onImageLoad(e) {
        const { width, height } = e.currentTarget;
        setImgRef(e.currentTarget);

        const targetAspect = 4 / 5;
        const imageAspect = width / height;
        const tolerance = 0.01;

        let crop;
        if (Math.abs(imageAspect - targetAspect) < tolerance) {
            // If the image is already 4:5, select the entire image
            crop = {
                unit: '%',
                x: 0,
                y: 0,
                width: 100,
                height: 100,
            };
        } else {
            // Otherwise, create a centered crop with a 4:5 aspect ratio
            crop = centerAspectCrop(width, height, targetAspect);
        }
        setCrop(crop);
    }


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

    // Handle image selection for a specific color and image slot.
    const handleColorImageSelect = (colorIndex, imageIndex, file, event) => {
        if (file) {
            // Store the temporary image for cropping
            setTempImage(file);

            // Set up cropping session
            const reader = new FileReader();
            reader.onload = (e) => {
                setImgSrc(e.target.result);
                setColorIndex(colorIndex);
                setImageIndex(imageIndex);
                setCropMode(true);
            };
            reader.readAsDataURL(file);
        }

        if (event) {
            event.target.value = "";
        }
    };

    // Save the cropped image
    const handleSaveCrop = () => {
        if (completedCrop && imgRef) {
            const canvas = document.createElement('canvas');
            const scaleX = imgRef.naturalWidth / imgRef.width;
            const scaleY = imgRef.naturalHeight / imgRef.height;
            canvas.width = completedCrop.width;
            canvas.height = completedCrop.height;

            const ctx = canvas.getContext('2d');

            const pixelRatio = window.devicePixelRatio;
            canvas.width = completedCrop.width * pixelRatio;
            canvas.height = completedCrop.height * pixelRatio;
            ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
            ctx.imageSmoothingQuality = 'high';

            ctx.drawImage(
                imgRef,
                completedCrop.x * scaleX,
                completedCrop.y * scaleY,
                completedCrop.width * scaleX,
                completedCrop.height * scaleY,
                0,
                0,
                completedCrop.width,
                completedCrop.height,
            );

            // Convert canvas to blob
            canvas.toBlob((blob) => {
                if (blob) {
                    const croppedFile = new File([blob], `cropped_image_${Date.now()}.jpg`, {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    });

                    // Update the arrays with the original and cropped images
                    setColors(prevColors => {
                        const newColors = [...prevColors];
                        const images = [...newColors[colorIndex].images];
                        const croppedImages = [...newColors[colorIndex].croppedImages];

                        // Store the original image
                        images[imageIndex] = tempImage;

                        // Store the cropped image
                        croppedImages[imageIndex] = croppedFile;

                        newColors[colorIndex].images = images;
                        newColors[colorIndex].croppedImages = croppedImages;
                        return newColors;
                    });

                    // Reset cropping state
                    setCropMode(false);
                    setImgSrc('');
                    setCompletedCrop(null);
                    setTempImage(null);
                }
            }, 'image/jpeg', 0.95);
        }
    };

    const handleCancelCrop = () => {
        setCropMode(false);
        setImgSrc('');
        setCompletedCrop(null);
        setTempImage(null);
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
                croppedImages: [null, null, null, null, null],
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

    // Remove an image from a specific color and slot
    const handleRemoveImage = (colorIndex, imageIndex) => {
        setColors(prevColors => {
            const newColors = [...prevColors];
            const images = [...newColors[colorIndex].images];
            const croppedImages = [...newColors[colorIndex].croppedImages];

            images[imageIndex] = null;
            croppedImages[imageIndex] = null;

            newColors[colorIndex].images = images;
            newColors[colorIndex].croppedImages = croppedImages;
            return newColors;
        });
    };


    useEffect(() => {

        const fetchDbCategories = async () => {

            try {

                const response = await axios.get(`${API_BASE_URL}/seller/categories`);

                console.log(response.data.categories);

                setDbCategories(response.data.categories);
                setIsLoadingCategories(false);

            } catch (error) {
                console.error("Error fetching categories:", error);

                setIsLoadingCategories(false);
            }
        };

        fetchDbCategories();

    }, [])

    useEffect(() => {
        setSubCategory("");
    }, [category]);



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
        formData.append("totalQuantity", totalQuantity)

        // Process colors data: Calculate totalStock for each color.
        const colorsData = colors.map((col) => {
            const totalStock = Object.values(col.variants).reduce((acc, variant) => {
                const stockNum = parseInt(variant.stock, 10);
                return acc + (isNaN(stockNum) ? 0 : stockNum);
            }, 0);
            return { ...col, totalStock };
        });
        formData.append("colors", JSON.stringify(colorsData));

        // Append cropped images for each color variation (if available)
        colors.forEach((col, colorIndex) => {
            col.croppedImages.forEach((img, imgIndex) => {
                if (img) {
                    // Use cropped images
                    formData.append(`color${colorIndex}_image${imgIndex}`, img,
                        `${Date.now()}_${Math.random().toString(36).substring(2)}_cropped.jpg`
                    );
                }
            });
        });

        try {

            console.log(Array.from(formData.entries()));

            const response = await axios.post(

                "http://localhost:3333/seller/add-products",

                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            console.log("Product added successfully:", response.data);

            setSelectedSection("products")

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
                        {isLoadingCategories ? (
                            <p>Loading categories...</p>
                        ) : (
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            >
                                <option value="">Select a category</option>
                                {dbCategories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                </div>

                <div className="flex space-x-4">
                    <div className="w-1/2">
                        <label className="block font-medium mb-1">Sub Category</label>
                        {category ? (
                            // Find the selected category in dbCategories to get its subcategories.
                            <select
                                value={subCategory}
                                onChange={(e) => setSubCategory(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            >
                                <option value="">Select a sub category</option>
                                {(() => {
                                    const selectedCat = dbCategories.find((cat) => cat._id === category);
                                    if (selectedCat && selectedCat.subcategories) {
                                        return selectedCat.subcategories.map((sub) => (
                                            <option key={sub._id} value={sub._id}>
                                                {sub.name}
                                            </option>
                                        ));
                                    }
                                    return null;
                                })()}
                            </select>
                        ) : (
                            <p>Please select a category first</p>
                        )}
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
                                <label className="block font-medium mb-2">
                                    Upload 5 Images (Images must be cropped before saving)
                                </label>
                                <div className="flex flex-wrap gap-4">
                                    {Array(5).fill(null).map((_, imgIndex) => (
                                        <div
                                            key={imgIndex}
                                            className="relative flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded"
                                        >
                                            {col.croppedImages[imgIndex] ? (
                                                // Show cropped image with delete option
                                                <div className="relative w-full h-full">
                                                    <img
                                                        src={URL.createObjectURL(col.croppedImages[imgIndex])}
                                                        alt="Cropped Preview"
                                                        className="object-cover w-full h-full rounded"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveImage(colIndex, imgIndex)}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ) : (
                                                // Upload area
                                                <div className="w-full h-full flex items-center justify-center cursor-pointer">
                                                    <input
                                                        type="file"
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            if (e.target.files[0]) {
                                                                handleColorImageSelect(
                                                                    colIndex,
                                                                    imgIndex,
                                                                    e.target.files[0],
                                                                    e
                                                                );
                                                            }
                                                        }}
                                                    />
                                                    <span className="text-gray-400 text-sm">Add Image</span>
                                                </div>
                                            )}
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
                        className="bg-gray-900 text-white px-4 py-2 rounded"
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

            {cropMode && imgSrc && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    {/* Semi-transparent backdrop */}
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    {/* Modal container */}
                    <div className="relative bg-white rounded-lg max-w-[620px] w-full p-4 shadow z-10">
                        {/* Cross icon button */}
                        <button
                            onClick={handleCancelCrop}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            <CloseIcon />

                        </button>
                        <h3 className="text-xl font-bold mb-4">Crop Image</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Drag to position  The crop maintains a 4:5 aspect ratio.
                        </p>

                        <div className="mb-4 flex justify-center">
                            {/* Container with a fixed max-height and overflow */}
                            <div className="max-w-[400px] ">
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
                                        className=" w-full object-contain"
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
};

export default AddProduct;
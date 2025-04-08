

import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { CloseIcon } from "../../../icons/icons";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addProduct } from "../../../services/productService";
import { getCategoryList } from "../../../services/categoryService";
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

    // Form validation errors
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                extralarge: { size: "Extra Large", stock: "" },
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
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const datePart = `${year}${month}${day}`;

            // Generate a 4-character random alphanumeric string
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let randomPart = '';
            const randomLength = 4;
            for (let i = 0; i < randomLength; i++) {
                randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
            }

            return `PRD-${datePart}-${randomPart}`;
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

        // Clear related errors when field changes
        if (errors[`color_${index}_${field}`]) {
            setErrors(prev => ({
                ...prev,
                [`color_${index}_${field}`]: null
            }));
        }
    };

    // Handle image selection for a specific color and image slot.
    const handleColorImageSelect = (colorIndex, imageIndex, file, event) => {
        // Validate file size (5MB max)
        if (file && file.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5MB");
            if (event) {
                event.target.value = "";
            }
            return;
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (file && !validTypes.includes(file.type)) {
            toast.error("Only JPEG, JPG, PNG, and WEBP images are allowed");
            if (event) {
                event.target.value = "";
            }
            return;
        }

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

        // Clear related errors
        if (errors[`color_${colorIndex}_image`]) {
            setErrors(prev => ({
                ...prev,
                [`color_${colorIndex}_image`]: null
            }));
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

                    // Show success toast
                    toast.success("Image cropped successfully");
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
        // Validate that stock is a non-negative number
        if (value !== "" && (isNaN(value) || parseInt(value) < 0)) {
            return;
        }

        setColors((prevColors) => {
            const newColors = [...prevColors];
            newColors[colorIndex].variants[variantKey].stock = value;
            return newColors;
        });

        // Clear related errors
        if (errors[`color_${colorIndex}_stock`]) {
            setErrors(prev => ({
                ...prev,
                [`color_${colorIndex}_stock`]: null
            }));
        }
    };

    // Discount logic for each color variation.
    const handleBasePriceChange = (index, value) => {
        // Validate price is non-negative
        if (value !== "" && (isNaN(value) || parseFloat(value) < 0)) {
            return;
        }

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

        // Clear related errors
        if (errors[`color_${index}_basePrice`]) {
            setErrors(prev => ({
                ...prev,
                [`color_${index}_basePrice`]: null
            }));
        }
    };

    const handleDiscountPriceChange = (index, value) => {
        // Validate discount price is non-negative and <= 999
        if (value !== "" && (isNaN(value) || parseFloat(value) < 0)) {
            return;
        }

        // Enforce discountPrice <= 999.
        if (parseFloat(value) > 999) {
            toast.warning("Discount price cannot exceed 999");
            return;
        }

        setColors((prevColors) => {
            const newColors = [...prevColors];
            newColors[index].discountPrice = value;
            const base = parseFloat(newColors[index].basePrice);
            const discountPrice = parseFloat(value);

            // Validate discount price is less than or equal to base price
            if (!isNaN(base) && !isNaN(discountPrice) && discountPrice > base) {
                toast.warning("Discount price cannot exceed base price");
                newColors[index].discountPrice = newColors[index].basePrice;
                newColors[index].discountPercentage = "0.00";
                return newColors;
            }

            if (!isNaN(base) && !isNaN(discountPrice) && base > 0) {
                newColors[index].discountPercentage = (
                    ((base - discountPrice) / base) *
                    100
                ).toFixed(2);
            }
            return newColors;
        });

        // Clear related errors
        if (errors[`color_${index}_discountPrice`]) {
            setErrors(prev => ({
                ...prev,
                [`color_${index}_discountPrice`]: null
            }));
        }
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
        toast.success("New color variation added");
    };

    // Clear a color variation form (reset its fields), but ensure at least one remains.
    const clearColorVariant = (index) => {
        if (colors.length === 1) {
            toast.warning("At least one color variation is required");
            return;
        }

        setColors((prevColors) => {
            const newColors = [...prevColors];
            newColors.splice(index, 1);
            return newColors;
        });

        toast.success("Color variation removed");
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

        toast.info("Image removed");
    };

    useEffect(() => {
        const fetchDbCategories = async () => {
            try {
                // const response = await axios.get(`${API_BASE_URL}/seller/categories`);
                const response = await getCategoryList()

                console.log(response.data.categories);
                setDbCategories(response.data.categories);
                setIsLoadingCategories(false);
            } catch (error) {
                console.error("Error fetching categories:", error);
                setIsLoadingCategories(false);
                toast.error("Failed to load categories");
            }
        };

        fetchDbCategories();
    }, []);

    useEffect(() => {
        setSubCategory("");
    }, [category]);

    // Form validation function
    const validateForm = () => {
        const newErrors = {};

        // Basic field validations
        if (!productName.trim()) {
            newErrors.productName = "Product name is required";
        }

        if (!brand.trim()) {
            newErrors.brand = "Brand is required";
        }

        if (!category) {
            newErrors.category = "Category is required";
        }

        if (category && !subCategory) {
            newErrors.subCategory = "Sub-category is required";
        }

        if (!productDescription.trim()) {
            newErrors.productDescription = "Product description is required";
        } else if (productDescription.length < 20) {
            newErrors.productDescription = "Description should be at least 20 characters";
        }

        // Color variations validation
        colors.forEach((color, index) => {
            if (!color.color) {
                newErrors[`color_${index}_color`] = "Color is required";
            }

            // Check if at least one image is uploaded
            const hasImage = color.croppedImages.some(img => img !== null);
            if (!hasImage) {
                newErrors[`color_${index}_image`] = "At least one image is required";
            }

            if (!color.basePrice || parseFloat(color.basePrice) <= 0) {
                newErrors[`color_${index}_basePrice`] = "Valid base price is required";
            }

            if (!color.discountPrice || parseFloat(color.discountPrice) <= 0) {
                newErrors[`color_${index}_discountPrice`] = "Valid discount price is required";
            }

            // Check if at least one size has stock
            const hasStock = Object.values(color.variants).some(
                variant => variant.stock !== "" && parseInt(variant.stock) > 0
            );

            if (!hasStock) {
                newErrors[`color_${index}_stock`] = "At least one size must have stock";
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix the errors in the form");
            // Scroll to the first error
            const firstErrorField = document.querySelector(".error-text");
            if (firstErrorField) {
                firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
            }
            return;
        }

        setIsSubmitting(true);

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
        formData.append("totalQuantity", totalQuantity);

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
            // const response = await axios.post(
            //     "http://localhost:3333/seller/add-products",
            //     formData,
            //     {
            //         headers: { "Content-Type": "multipart/form-data" },
            //     }
            // );
            const response = await addProduct(formData);

            console.log("Product added successfully:", response.data);
            toast.success("Product added successfully!");
            setSelectedSection("products");
        } catch (error) {
            console.error("Error adding product:", error);
            toast.error(error.response?.data?.message || "Failed to add product");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mx-auto p-6 bg-white rounded shadow max-w-6xl">
            <ToastContainer position="top-right" autoClose={3000} />

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
                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                    <div className="w-full md:w-1/2">
                        <label className="block font-medium mb-1">
                            Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={productName}
                            onChange={(e) => {
                                setProductName(e.target.value);
                                if (errors.productName) setErrors({ ...errors, productName: null });
                            }}
                            required
                            className={`w-full border ${errors.productName ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
                            placeholder="Enter product name"
                        />
                        {errors.productName && (
                            <p className="text-red-500 text-sm mt-1 error-text">{errors.productName}</p>
                        )}
                    </div>
                    <div className="w-full md:w-1/2">
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
                    <label className="block font-medium mb-1">
                        Product Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={productDescription}
                        onChange={(e) => {
                            setProductDescription(e.target.value);
                            if (errors.productDescription) setErrors({ ...errors, productDescription: null });
                        }}
                        className={`w-full border ${errors.productDescription ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 h-24`}
                        placeholder="Enter detailed description"
                    />
                    {errors.productDescription && (
                        <p className="text-red-500 text-sm mt-1 error-text">{errors.productDescription}</p>
                    )}
                </div>

                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                    <div className="w-full md:w-1/2">
                        <label className="block font-medium mb-1">
                            Brand <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={brand}
                            onChange={(e) => {
                                setBrand(e.target.value);
                                if (errors.brand) setErrors({ ...errors, brand: null });
                            }}
                            required
                            className={`w-full border ${errors.brand ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
                            placeholder="Enter brand"
                        />
                        {errors.brand && (
                            <p className="text-red-500 text-sm mt-1 error-text">{errors.brand}</p>
                        )}
                    </div>

                    <div className="w-full md:w-1/2">
                        <label className="block font-medium mb-1">
                            Category <span className="text-red-500">*</span>
                        </label>
                        {isLoadingCategories ? (
                            <p>Loading categories...</p>
                        ) : (
                            <select
                                value={category}
                                onChange={(e) => {
                                    setCategory(e.target.value);
                                    if (errors.category) setErrors({ ...errors, category: null });
                                }}
                                required
                                className={`w-full border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
                            >
                                <option value="">Select a category</option>
                                {dbCategories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        )}
                        {errors.category && (
                            <p className="text-red-500 text-sm mt-1 error-text">{errors.category}</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                    <div className="w-full md:w-1/2">
                        <label className="block font-medium mb-1">
                            Sub Category <span className="text-red-500">*</span>
                        </label>
                        {category ? (
                            // Find the selected category in dbCategories to get its subcategories.
                            <select
                                value={subCategory}
                                onChange={(e) => {
                                    setSubCategory(e.target.value);
                                    if (errors.subCategory) setErrors({ ...errors, subCategory: null });
                                }}
                                required
                                className={`w-full border ${errors.subCategory ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
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
                        {errors.subCategory && (
                            <p className="text-red-500 text-sm mt-1 error-text">{errors.subCategory}</p>
                        )}
                    </div>
                    <div className="w-full md:w-1/2">
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

                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                    <div className="w-full md:w-1/2">
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
                    <div className="w-full md:w-1/2 flex flex-col justify-end">
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

                            <div className="mb-4">
                                <div className="w-full md:w-1/2">
                                    <label className="block font-medium mb-1">
                                        Color Name <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={col.color}
                                        onChange={(e) => {
                                            handleColorChange(colIndex, "color", e.target.value);
                                        }}
                                        required
                                        className={`w-full border ${errors[`color_${colIndex}_color`] ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
                                    >
                                        <option value="" disabled>Select a color</option>
                                        <option value="Red">Red</option>
                                        <option value="Blue">Blue</option>
                                        <option value="Green">Green</option>
                                        <option value="Yellow">Yellow</option>
                                        <option value="Black">Black</option>
                                        <option value="White">White</option>
                                        <option value="Purple">Purple</option>
                                        <option value="Pink">Pink</option>
                                        <option value="Orange">Orange</option>
                                        <option value="Gray">Gray</option>
                                    </select>
                                    {errors[`color_${colIndex}_color`] && (
                                        <p className="text-red-500 text-sm mt-1 error-text">
                                            {errors[`color_${colIndex}_color`]}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Images Section */}
                            <div className="mb-4">
                                <label className="block font-medium mb-1">
                                    Product Images <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                                    {[0, 1, 2, 3, 4].map((imgIndex) => (
                                        <div
                                            key={imgIndex}
                                            className="border border-dashed border-gray-300 rounded p-2 flex flex-col items-center justify-center h-32 relative"
                                        >
                                            {col.croppedImages[imgIndex] ? (
                                                <div className="relative w-full h-full">
                                                    <img
                                                        src={URL.createObjectURL(col.croppedImages[imgIndex])}
                                                        alt={`Preview ${imgIndex}`}
                                                        className="object-contain w-full h-full"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                                        onClick={() => handleRemoveImage(colIndex, imgIndex)}
                                                    >
                                                        <CloseIcon className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <input
                                                        type="file"
                                                        accept="image/jpeg, image/png, image/jpg, image/webp"
                                                        onChange={(e) => handleColorImageSelect(colIndex, imgIndex, e.target.files[0], e)}
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                    />
                                                    <div className="text-gray-400 text-center text-sm">
                                                        <span className="block">+</span>
                                                        <span className="block">Upload</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {errors[`color_${colIndex}_image`] && (
                                    <p className="text-red-500 text-sm mt-1 error-text">
                                        {errors[`color_${colIndex}_image`]}
                                    </p>
                                )}
                            </div>

                            {/* Pricing */}
                            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mb-4">
                                <div className="w-full md:w-1/3">
                                    <label className="block font-medium mb-1">
                                        Base Price <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={col.basePrice}
                                        onChange={(e) => handleBasePriceChange(colIndex, e.target.value)}
                                        required
                                        min="0"
                                        step="0.01"
                                        className={`w-full border ${errors[`color_${colIndex}_basePrice`] ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
                                        placeholder="0.00"
                                    />
                                    {errors[`color_${colIndex}_basePrice`] && (
                                        <p className="text-red-500 text-sm mt-1 error-text">
                                            {errors[`color_${colIndex}_basePrice`]}
                                        </p>
                                    )}
                                </div>
                                <div className="w-full md:w-1/3">
                                    <label className="block font-medium mb-1">
                                        Discount Price <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={col.discountPrice}
                                        onChange={(e) => handleDiscountPriceChange(colIndex, e.target.value)}
                                        required
                                        min="0"
                                        max="999"
                                        step="0.01"
                                        className={`w-full border ${errors[`color_${colIndex}_discountPrice`] ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
                                        placeholder="0.00"
                                    />
                                    {errors[`color_${colIndex}_discountPrice`] && (
                                        <p className="text-red-500 text-sm mt-1 error-text">
                                            {errors[`color_${colIndex}_discountPrice`]}
                                        </p>
                                    )}
                                </div>
                                <div className="w-full md:w-1/3">
                                    <label className="block font-medium mb-1">Discount %</label>
                                    <input
                                        type="text"
                                        value={col.discountPercentage}
                                        readOnly
                                        className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                                    />
                                </div>
                            </div>

                            {/* Variants (Size & Stock) */}
                            <div>
                                <label className="block font-medium mb-1">
                                    Size & Stock <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                    {Object.keys(col.variants).map((variantKey) => (
                                        <div key={variantKey} className="mb-2">
                                            <label className="block text-sm font-medium">
                                                {col.variants[variantKey].size}
                                            </label>
                                            <input
                                                type="number"
                                                value={col.variants[variantKey].stock}
                                                onChange={(e) =>
                                                    handleVariantChange(colIndex, variantKey, e.target.value)
                                                }
                                                min="0"
                                                className="w-full border border-gray-300 rounded px-3 py-2"
                                                placeholder="Stock quantity"
                                            />
                                        </div>
                                    ))}
                                </div>
                                {errors[`color_${colIndex}_stock`] && (
                                    <p className="text-red-500 text-sm mt-1 error-text">
                                        {errors[`color_${colIndex}_stock`]}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Add New Color Button */}
                    <button
                        type="button"
                        onClick={addNewColor}
                        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                        Add Another Color
                    </button>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-between mt-8">
                    <button
                        type="button"
                        onClick={() => setSelectedSection("products")}
                        className="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-6 py-2 bg-black text-white rounded hover:bg-gray-700 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                    >
                        {isSubmitting ? "Adding..." : "Add Product"}
                    </button>
                </div>
            </form>

            {/* Image Cropping Modal */}
            {/* {cropMode && (


                <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto border-4 border-black">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Crop Image</h3>
                            <button
                                onClick={handleCancelCrop}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <CloseIcon className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="mb-4 max-h-[60vh] overflow-hidden">
                                <ReactCrop
                                    crop={crop}
                                    onChange={(c) => setCrop(c)}
                                    onComplete={(c) => setCompletedCrop(c)}
                                    aspect={4 / 5}
                                >
                                    <img
                                        src={imgSrc}
                                        alt="Crop preview"
                                        onLoad={onImageLoad}
                                        className="max-h-[60vh] w-auto"
                                    />
                                </ReactCrop>
                            </div>
                            <p className="text-gray-500 text-sm mb-4">
                                Crop the image to a 4:5 aspect ratio for best results.
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleCancelCrop}
                                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveCrop}
                                    className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700"
                                >
                                    Apply Crop
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )} */}



            {cropMode && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    {/* Semi-transparent backdrop */}
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">

                        <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto border-4 border-black">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold">Crop Image</h3>
                                <button
                                    onClick={handleCancelCrop}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <CloseIcon className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="mb-4 max-h-[60vh] w-full flex justify-center">
                                    {imgSrc && (
                                        <ReactCrop
                                            crop={crop}
                                            onChange={(c) => setCrop(c)}
                                            onComplete={(c) => setCompletedCrop(c)}
                                            aspect={4 / 5}
                                            className="h-auto"
                                        >
                                            <img
                                                src={imgSrc}
                                                alt="Crop preview"
                                                onLoad={onImageLoad}
                                                style={{ maxHeight: "60vh", width: "auto", objectFit: "contain" }}
                                            />
                                        </ReactCrop>
                                    )}
                                </div>
                                <p className="text-gray-500 text-sm mb-4">
                                    Crop the image to a 4:5 aspect ratio for best results.
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleCancelCrop}
                                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveCrop}
                                        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700"
                                        disabled={!imgSrc || !completedCrop?.width || !completedCrop?.height}
                                    >
                                        Apply Crop
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddProduct;
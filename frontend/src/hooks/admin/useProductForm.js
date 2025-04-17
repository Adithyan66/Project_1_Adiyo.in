import { useNavigate } from "react-router";
import { getCategoryList } from "../../services/categoryService";
import { editProduct, getProductDetils } from "../../services/productService";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";




const useProductForm = ({ productId }) => {

    const navigate = useNavigate();
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
    const [cropMode, setCropMode] = useState(false);
    const [tempImage, setTempImage] = useState(null);
    const [imgSrc, setImgSrc] = useState("");
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState(null);
    const [imgRef, setImgRef] = useState(null);
    const [activeColorIndex, setActiveColorIndex] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(null);
    const [categories, setCategories] = useState([]);

    // Fetch categories
    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await getCategoryList();
                setCategories(response.data.categories);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        }
        fetchCategories();
    }, []);

    // Fetch product details
    useEffect(() => {
        async function fetchProductDetails() {
            try {
                const response = await getProductDetils(productId);
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

    // Update total quantity
    useEffect(() => {
        const updatedColors = editedColors.map((color) => {
            if (!color || !color.variants) return color;
            const colorTotalStock = Object.values(color.variants).reduce(
                (sum, variant) => sum + (parseInt(variant.stock) || 0),
                0
            );
            return { ...color, totalStock: colorTotalStock };
        });
        const newTotalQuantity = updatedColors.reduce(
            (total, color) => total + (color?.totalStock || 0),
            0
        );
        setEditedColors(updatedColors);
        setTotalQuantity(newTotalQuantity);
    }, [JSON.stringify(editedColors.map((color) => color?.variants || {}))]);

    // Image load for cropping
    const onImageLoad = (e) => {
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
    };

    // Save cropped image
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

    // Cancel crop
    const handleCancelCrop = () => {
        setCropMode(false);
        setImgSrc("");
        setCompletedCrop(null);
        setTempImage(null);
    };

    // Handle image selection
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

    // Handle color change
    const handleColorChange = (colIndex, key, value) => {
        setEditedColors((prevColors) => {
            const newColors = [...prevColors];
            newColors[colIndex] = { ...newColors[colIndex], [key]: value };
            return newColors;
        });
    };

    // Handle variant change
    const handleVariantChange = (colIndex, key, value) => {
        setEditedColors((prevColors) => {
            const newColors = [...prevColors];
            newColors[colIndex].variants = {
                ...newColors[colIndex].variants,
                [key]: { ...newColors[colIndex].variants[key], stock: value },
            };
            const colorTotalStock = Object.values(newColors[colIndex].variants).reduce(
                (sum, variant) => sum + (parseInt(variant.stock) || 0),
                0
            );
            newColors[colIndex].totalStock = colorTotalStock;
            return newColors;
        });
    };

    // Handle form submission
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

        const mergedColors = originalProduct.colors.map((origColor, i) => {
            const updatedColor = { ...origColor, ...editedColors[i] };
            updatedColor.images = origColor.images.map((imgUrl, j) => {
                if (editedColors[i] && editedColors[i].images[j] instanceof File) {
                    return null;
                }
                return imgUrl;
            });
            updatedColor.totalStock = Object.values(updatedColor.variants).reduce(
                (sum, variant) => sum + (parseInt(variant.stock) || 0),
                0
            );
            return updatedColor;
        });

        formData.append("colors", JSON.stringify(mergedColors));

        editedColors.forEach((color, i) => {
            if (!color) return;
            color.images.forEach((img, j) => {
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
            setLoading(true)
            const response = await editProduct(productId, formData);
            console.log("Updated product:", response.data.product);
            toast.success("Product updated");
            navigate("/admin/manage-products");
        } catch (error) {
            console.error("Error updating product:", error);
        } finally {
            setLoading(false)
        }
    };

    return {
        loading,
        sku,
        setSku,
        productName,
        setProductName,
        shortDescription,
        setShortDescription,
        productDescription,
        setProductDescription,
        brand,
        setBrand,
        category,
        setCategory,
        subCategory,
        setSubCategory,
        material,
        setMaterial,
        careInstructions,
        setCareInstructions,
        totalQuantity,
        setTotalQuantity,
        editedColors,
        setEditedColors,
        originalProduct,
        categories,
        cropMode,
        setCropMode,
        tempImage,
        setTempImage,
        imgSrc,
        setImgSrc,
        crop,
        setCrop,
        completedCrop,
        setCompletedCrop,
        imgRef,
        setImgRef,
        activeColorIndex,
        setActiveColorIndex,
        activeImageIndex,
        setActiveImageIndex,
        selectedCategory: categories.find((cat) => cat._id === category) || null,
        onImageLoad,
        handleSaveCrop,
        handleCancelCrop,
        handleColorImageSelect,
        handleColorChange,
        handleVariantChange,
        handleBasePriceChange: (colIndex, value) =>
            handleColorChange(colIndex, "basePrice", value),
        handleDiscountPriceChange: (colIndex, value) =>
            handleColorChange(colIndex, "discountPrice", value),
        handleSubmit,
    };
};


export default useProductForm
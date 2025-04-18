

import React from "react";
import { useSelector } from "react-redux";
import useProductForm from "../../../../hooks/admin/useProductForm"
import { ProductDetailsForm } from "./ProductDetailsForm";
import { ColorVariations } from "../../../common/uploadImages/ColorVariations";
import { CropModal } from "../../../common/uploadImages/CropImages";
import { PulseRingLoader } from "../../../common/loading/Spinner";

function EditProduct({ setSelectedSection }) {
    const productId = useSelector(
        (state) => state.sellerSideSelected.editProductID
    );
    const {
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
        editedColors,
        setEditedColors,
        categories,
        selectedCategory,
        cropMode,
        imgSrc,
        crop,
        setCrop,
        completedCrop,
        setCompletedCrop,
        onImageLoad,
        handleSaveCrop,
        handleCancelCrop,
        handleColorImageSelect,
        handleColorChange,
        handleVariantChange,
        handleBasePriceChange,
        handleDiscountPriceChange,
        handleSubmit,
    } = useProductForm({ productId });

    if (loading) return <PulseRingLoader />


    return (
        <div className="mx-auto p-6 bg-white rounded shadow max-w-6xl">
            <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <ProductDetailsForm
                    sku={sku}
                    productName={productName}
                    setProductName={setProductName}
                    shortDescription={shortDescription}
                    setShortDescription={setShortDescription}
                    productDescription={productDescription}
                    setProductDescription={setProductDescription}
                    brand={brand}
                    setBrand={setBrand}
                    category={category}
                    setCategory={setCategory}
                    subCategory={subCategory}
                    setSubCategory={setSubCategory}
                    material={material}
                    setMaterial={setMaterial}
                    careInstructions={careInstructions}
                    setCareInstructions={setCareInstructions}
                    totalQuantity={totalQuantity}
                    categories={categories}
                    selectedCategory={selectedCategory}
                    handleSubmit={handleSubmit}
                />
                <ColorVariations
                    editedColors={editedColors}
                    setEditedColors={setEditedColors}
                    handleColorChange={handleColorChange}
                    handleVariantChange={handleVariantChange}
                    handleBasePriceChange={handleBasePriceChange}
                    handleDiscountPriceChange={handleDiscountPriceChange}
                    handleColorImageSelect={handleColorImageSelect}
                />
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
            <CropModal
                cropMode={cropMode}
                imgSrc={imgSrc}
                crop={crop}
                setCrop={setCrop}
                completedCrop={completedCrop}
                setCompletedCrop={setCompletedCrop}
                onImageLoad={onImageLoad}
                handleSaveCrop={handleSaveCrop}
                handleCancelCrop={handleCancelCrop}
            />
        </div>
    );
}

export default EditProduct;
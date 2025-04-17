import { ImageUpload } from "./ImageUpload";

export const ColorVariationItem = ({
    col,
    colIndex,
    editedColors,
    setEditedColors,
    handleColorChange,
    handleVariantChange,
    handleBasePriceChange,
    handleDiscountPriceChange,
    handleColorImageSelect,
}) => (
    <div className="mb-6 p-4 border rounded relative">
        <h3 className="font-semibold mb-2">Variation #{colIndex + 1}</h3>
        {editedColors.length > 1 && (
            <button
                type="button"
                onClick={() =>
                    setEditedColors((prev) => prev.filter((_, index) => index !== colIndex))
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
                onChange={(e) => handleColorChange(colIndex, "color", e.target.value)}
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
            <label className="block font-medium mb-2">Upload 5 Images</label>
            <div className="flex flex-wrap gap-4">
                {col.images.map((img, imgIndex) => (
                    <ImageUpload
                        key={imgIndex}
                        img={img}
                        colIndex={colIndex}
                        imgIndex={imgIndex}
                        handleColorImageSelect={handleColorImageSelect}
                        colorName={col.color}
                    />
                ))}
            </div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
                <label className="block font-medium mb-1">Base Price</label>
                <input
                    type="number"
                    value={col.basePrice}
                    onChange={(e) => handleBasePriceChange(colIndex, e.target.value)}
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
                    onChange={(e) => handleDiscountPriceChange(colIndex, e.target.value)}
                    required
                    max="999"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="Final price after discount (max 999)"
                />
            </div>
            <div>
                <label className="block font-medium mb-1">Discount Percentage</label>
                <input
                    type="number"
                    value={col.discountPercentage}
                    readOnly
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                />
            </div>
        </div>

        {/* Variants */}
        <div>
            <label className="block font-medium mb-1">Variants (Size & Stock)</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.entries(col.variants).map(([key, variant]) => (
                    <div key={key}>
                        <p className="text-sm mb-1">{variant.size}</p>
                        <input
                            type="number"
                            value={variant.stock}
                            onChange={(e) => handleVariantChange(colIndex, key, e.target.value)}
                            placeholder="Stock"
                            min="0"
                            className="w-full border border-gray-300 rounded px-2 py-1"
                        />
                    </div>
                ))}
            </div>
        </div>
    </div>
);
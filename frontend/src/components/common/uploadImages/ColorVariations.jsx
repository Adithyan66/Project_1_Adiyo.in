import { ColorVariationItem } from "./ColorVariationItem";

export const ColorVariations = ({
    editedColors,
    setEditedColors,
    handleColorChange,
    handleVariantChange,
    handleBasePriceChange,
    handleDiscountPriceChange,
    handleColorImageSelect,
}) => (
    <div className="border-t pt-4">
        <h2 className="text-xl font-bold mb-2">Color Variations</h2>
        {editedColors.map((col, colIndex) => (
            <ColorVariationItem
                key={colIndex}
                col={col}
                colIndex={colIndex}
                editedColors={editedColors}
                setEditedColors={setEditedColors}
                handleColorChange={handleColorChange}
                handleVariantChange={handleVariantChange}
                handleBasePriceChange={handleBasePriceChange}
                handleDiscountPriceChange={handleDiscountPriceChange}
                handleColorImageSelect={handleColorImageSelect}
            />
        ))}
    </div>
);

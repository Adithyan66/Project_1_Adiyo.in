
import React from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

function FilterSidebar({
    selectedColors,
    setSelectedColors,
    selectedSizes,
    setSelectedSizes,
    selectedStyle,
    setSelectedStyle,
    minPrice,
    maxPrice,
    setMinPrice,
    setMaxPrice,
    handleApplyFilter,
    handleResetFilter,
    dbCategories,
    filterCategory,
    setFilterCategory,
    isLoadingCategories,
}) {
    const availableColors = [
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
        "Brown",
        "Maroon",
        "Navy",
        "Olive",
        "Teal",
    ];

    const availableSizes = [
        { display: "Small", value: "small" },
        { display: "Medium", value: "medium" },
        { display: "Large", value: "large" },
        { display: "Extra Large", value: "extralarge" },
    ];

    const handleColorChange = (color) => {
        setSelectedColors((prev) =>
            prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
        );
    };

    const handleSizeChange = (size) => {
        setSelectedSizes((prev) =>
            prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
        );
    };

    const handlePriceSlider = (value) => {
        setMinPrice(value[0]);
        setMaxPrice(value[1]);
    };

    return (
        <div className="w-full md:w-74 bg-white p-4 rounded shadow md:sticky md:top-0 md:h-[92vh] md:overflow-y-auto md:scrollbar-hidden">
            {/* <h2 className="text-xl font-bold mb-4">Filters</h2> */}

            {/* <hr className="p-3 text-gray-200" /> */}

            {/* Price Filter */}
            <div className="mb-6">
                <h3 className="font-semibold mb-2">Price</h3>
                <div className="px-1">
                    <Slider
                        range
                        min={0}
                        max={1000}
                        step={50}
                        value={[Number(minPrice), Number(maxPrice)]}
                        onChange={handlePriceSlider}
                        allowCross={false}
                        trackStyle={[{ backgroundColor: "#000" }]}
                        handleStyle={[{ borderColor: "#000" }, { borderColor: "#000" }]}
                    />
                    <div className="flex justify-between mt-2 text-sm">
                        <span>₹{minPrice}</span>
                        <span>₹{maxPrice}</span>
                    </div>
                </div>
            </div>

            <hr className="p-3 text-gray-200" />

            {/* Colors */}
            <div className="mb-4">
                <h3 className="font-semibold mb-2">Colors</h3>
                <div className="flex flex-wrap gap-2">
                    {availableColors.map((color) => {
                        const lowerColor = color.toLowerCase();
                        const isSelected = selectedColors.includes(color);
                        return (
                            <label key={color} className="flex flex-col items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={isSelected}
                                    onChange={() => handleColorChange(color)}
                                />
                                <div
                                    className={`w-8 h-8 rounded-full border-2 transition-all ${isSelected ? "border-black" : "border-gray-300"
                                        }`}
                                    style={{ backgroundColor: lowerColor }}
                                ></div>
                                <span className="text-xs mt-1 text-center">{color}</span>
                            </label>
                        );
                    })}
                </div>
            </div>

            <hr className="p-3 text-gray-200" />

            {/* Sizes */}
            <div className="mb-4">
                <h3 className="font-semibold mb-2">Size</h3>
                <div className="grid grid-cols-2 gap-2">
                    {availableSizes.map((size) => {
                        const isSelected = selectedSizes.includes(size.value);
                        return (
                            <label
                                key={size.value}
                                className={`cursor-pointer block h-10 border rounded-full px-4 py-2 text-base text-center transition-all ${isSelected
                                    ? "bg-black text-white border-black"
                                    : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={isSelected}
                                    onChange={() => handleSizeChange(size.value)}
                                />
                                {size.display}
                            </label>
                        );
                    })}
                </div>
            </div>

            <hr className="p-3 text-gray-200" />

            {/* Category */}
            <div className="mb-4">
                <h3 className="font-semibold mb-2">Category</h3>
                {isLoadingCategories ? (
                    [0, 0, 0, 0].map((_, index) => (
                        <div
                            key={index}
                            className="px-4 mb-5 w-full h-10 rounded bg-gray-100"
                        ></div>
                    ))
                ) : (
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => {
                                setSelectedStyle("");
                                setFilterCategory("");
                            }}
                            className={`px-4 py-2 w-full rounded border text-left transition-all ${filterCategory === ""
                                ? "bg-black text-white border-black"
                                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                                }`}
                        >
                            All Categories
                        </button>
                        {dbCategories.map((cat) => (
                            <button
                                key={cat._id}
                                onClick={() => {
                                    setSelectedStyle("");
                                    setFilterCategory(cat._id);
                                }}
                                className={`px-4 py-2 w-full rounded border text-left transition-all ${filterCategory === cat._id
                                    ? "bg-black text-white border-black"
                                    : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Subcategory */}
            {filterCategory && (
                <div className="mb-4">
                    <h3 className="font-semibold mb-2">Sub Category</h3>
                    {(() => {
                        const selectedCat = dbCategories.find((cat) => cat._id === filterCategory);
                        if (selectedCat && selectedCat.subcategories && selectedCat.subcategories.length > 0) {
                            return (
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setSelectedStyle("")}
                                        className={`px-4 py-2 w-full rounded border text-left transition-all ${selectedStyle === ""
                                            ? "bg-black text-white border-black"
                                            : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                                            }`}
                                    >
                                        All Sub Categories
                                    </button>
                                    {selectedCat.subcategories.map((sub) => (
                                        <button
                                            key={sub._id}
                                            onClick={() => setSelectedStyle(sub._id)}
                                            className={`px-4 py-2 w-full rounded border text-left transition-all ${selectedStyle === sub._id
                                                ? "bg-black text-white border-black"
                                                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                                                }`}
                                        >
                                            {sub.name}
                                        </button>
                                    ))}
                                </div>
                            );
                        } else {
                            return <p className="text-sm text-gray-500">No subcategories available</p>;
                        }
                    })()}
                </div>
            )}

            <hr className="p-3 text-gray-200" />

            {/* Apply / Reset Buttons */}
            <div className="flex space-x-2">
                <button
                    onClick={handleApplyFilter}
                    className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 flex-1"
                >
                    Apply Filters
                </button>
                <button
                    onClick={handleResetFilter}
                    className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 flex-1"
                >
                    Reset Filters
                </button>
            </div>
        </div>
    );
}

export default FilterSidebar;
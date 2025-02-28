





// // src/components/FilterSidebar.js
// import React from "react";
// import Slider from 'rc-slider';
// import 'rc-slider/assets/index.css';

// function FilterSidebar({
//     selectedColors,
//     setSelectedColors,
//     selectedSizes,
//     setSelectedSizes,
//     selectedStyle,
//     setSelectedStyle,
//     minPrice,
//     maxPrice,
//     setMinPrice,
//     setMaxPrice,
//     handleApplyFilter,
//     handleResetFilter,
// }) {
//     const availableColors = [
//         "Black",
//         "White",
//         "Pink",
//         "Blue",
//         "Red",
//         "Green",
//         "Gray",
//         "Orange",
//         "Navy",
//     ];
//     const availableSizes = ["S", "M", "L", "XL"];
//     const availableStyles = ["All", "Casual", "Formal"];

//     // Toggle color checkboxes
//     const handleColorChange = (color) => {
//         setSelectedColors((prev) =>
//             prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
//         );
//     };

//     // Toggle size checkboxes
//     const handleSizeChange = (size) => {
//         setSelectedSizes((prev) =>
//             prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
//         );
//     };

//     // Handle style change
//     const handleStyleSelect = (e) => {
//         setSelectedStyle(e.target.value);
//     };

//     // Handle slider changes
//     // value is an array: [newMin, newMax]
//     const handlePriceSlider = (value) => {
//         setMinPrice(value[0]);
//         setMaxPrice(value[1]);
//     };

//     return (
//         <div className="w-64 bg-white p-4 rounded shadow">
//             <h2 className="text-xl font-bold mb-4">Filters</h2>

//             <hr className="p-3 text-gray-200" />

//             {/* Price Filter */}
//             <div className="mb-6">
//                 <h3 className="font-semibold mb-2">Price</h3>
//                 <div className="px-1">
//                     {/* Range slider from rc-slider */}
//                     <Slider
//                         range
//                         min={0}
//                         max={1000}
//                         value={[Number(minPrice), Number(maxPrice)]}
//                         onChange={handlePriceSlider}
//                         allowCross={false}
//                     />
//                     {/* Show numeric values */}
//                     <div className="flex justify-between mt-2 text-sm">
//                         <span>₹{minPrice}</span>
//                         <span>₹{maxPrice}</span>
//                     </div>
//                 </div>
//             </div>

//             <hr className="p-3 text-gray-200" />


//             {/* Colors */}
//             <div className="mb-4">
//                 <h3 className="font-semibold mb-2">Colors</h3>
//                 <div className="flex flex-wrap gap-2">
//                     {availableColors.map((color) => {
//                         // Convert the color to lowercase for CSS background compatibility
//                         const lowerColor = color.toLowerCase();
//                         const isSelected = selectedColors.includes(color);
//                         return (
//                             <label key={color} className="flex flex-col items-center cursor-pointer">
//                                 <input
//                                     type="checkbox"
//                                     className="hidden"
//                                     checked={isSelected}
//                                     onChange={() => handleColorChange(color)}
//                                 />
//                                 <div
//                                     className={`w-8 h-8 rounded-full border-2 ${isSelected ? "border-black" : "border-gray-300"
//                                         }`}
//                                     style={{ backgroundColor: lowerColor }}
//                                 ></div>
//                                 <span className="text-xs mt-1">{color}</span>
//                             </label>
//                         );
//                     })}
//                 </div>
//             </div>

//             <hr className="p-3 text-gray-200" />

//             {/* Sizes */}
//             <div className="mb-4">
//                 <h3 className="font-semibold mb-2">Size</h3>
//                 <div className="grid grid-cols-2 gap-2">
//                     {availableSizes.map((size) => {
//                         const isSelected = selectedSizes.includes(size);
//                         return (
//                             <label
//                                 key={size}
//                                 className={`cursor-pointer block h-10 border rounded-full px-4 py-2 text-base text-center ${isSelected
//                                     ? "bg-black text-white"
//                                     : "bg-gray-100 text-gray-600 border-gray-300"
//                                     }`}
//                             >
//                                 <input
//                                     type="checkbox"
//                                     className="hidden"
//                                     checked={isSelected}
//                                     onChange={() => handleSizeChange(size)}
//                                 />
//                                 {size}
//                             </label>
//                         );
//                     })}
//                 </div>
//             </div>


//             <hr className="p-3 text-gray-200" />


//             {/* Dress Style */}
//             <div className="mb-4">
//                 <h3 className="font-semibold mb-2">Dress Style</h3>
//                 <div className="flex flex-col gap-2">
//                     {["Casual", "Formal", "Party", "Gym"].map((style) => {
//                         const isSelected = selectedStyle === style;
//                         return (
//                             <button
//                                 key={style}
//                                 onClick={() => setSelectedStyle(style)}
//                                 className={`cursor-pointer block w-full text-left px-4 py-2 text-sm ${isSelected ? "bg-black text-white rounded-2xl" : "bg-transparent text-gray-600"
//                                     }`}
//                             >
//                                 <div className="flex justify-between items-center">
//                                     <span>{style}</span>
//                                     <span>&gt;</span>
//                                 </div>
//                             </button>
//                         );
//                     })}
//                 </div>
//             </div>

//             <hr className="p-3 text-gray-200" />



//             {/* Apply / Reset Buttons */}
//             <div className="flex space-x-2">
//                 {/* <button
//                     onClick={handleApplyFilter}
//                     className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
//                 >
//                     Apply
//                 </button> */}
//                 <button
//                     onClick={handleResetFilter}
//                     className="bg-gray-200 mx-auto  text-black px-3 py-1 rounded text-sm"
//                 >
//                     Reset filter
//                 </button>
//             </div>
//         </div>
//     );
// }

// export default FilterSidebar;




// src/components/FilterSidebar.js
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
}) {
    const availableColors = [
        "Black",
        "White",
        "Pink",
        "Blue",
        "Red",
        "Green",
        "Gray",
        "Orange",
        "Navy",
    ];
    const availableSizes = ["S", "M", "L", "XL"];
    const availableStyles = ["All", "Casual", "Formal"];

    // Toggle color checkboxes
    const handleColorChange = (color) => {
        setSelectedColors((prev) =>
            prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
        );
    };

    // Toggle size checkboxes
    const handleSizeChange = (size) => {
        setSelectedSizes((prev) =>
            prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
        );
    };

    // Handle style change
    const handleStyleSelect = (e) => {
        setSelectedStyle(e.target.value);
    };

    // Handle slider changes (value is an array: [newMin, newMax])
    const handlePriceSlider = (value) => {
        setMinPrice(value[0]);
        setMaxPrice(value[1]);
    };

    return (
        // The outer container is now sticky, full viewport height, with vertical scroll if needed.
        <div className="w-74 bg-white p-4 rounded shadow sticky top-0 h-[92vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Filters</h2>

            <hr className="p-3 text-gray-200" />

            {/* Price Filter */}
            <div className="mb-6">
                <h3 className="font-semibold mb-2">Price</h3>
                <div className="px-1">
                    {/* Range slider from rc-slider */}
                    <Slider
                        range
                        min={0}
                        max={1000}
                        value={[Number(minPrice), Number(maxPrice)]}
                        onChange={handlePriceSlider}
                        allowCross={false}
                    />
                    {/* Show numeric values */}
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
                        // Convert the color to lowercase for CSS background compatibility
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
                                    className={`w-8 h-8 rounded-full border-2 ${isSelected ? "border-black" : "border-gray-300"
                                        }`}
                                    style={{ backgroundColor: lowerColor }}
                                ></div>
                                <span className="text-xs mt-1">{color}</span>
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
                        const isSelected = selectedSizes.includes(size);
                        return (
                            <label
                                key={size}
                                className={`cursor-pointer block h-10 border rounded-full px-4 py-2 text-base text-center ${isSelected
                                    ? "bg-black text-white"
                                    : "bg-gray-100 text-gray-600 border-gray-300"
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={isSelected}
                                    onChange={() => handleSizeChange(size)}
                                />
                                {size}
                            </label>
                        );
                    })}
                </div>
            </div>

            <hr className="p-3 text-gray-200" />

            {/* Dress Style */}
            <div className="mb-4">
                <h3 className="font-semibold mb-2">Dress Style</h3>
                <div className="flex flex-col gap-2">
                    {["Casual", "Formal", "Party", "Gym"].map((style) => {
                        const isSelected = selectedStyle === style;
                        return (
                            <button
                                key={style}
                                onClick={() => setSelectedStyle(style)}
                                className={`cursor-pointer block w-full text-left px-4 py-2 text-sm ${isSelected ? "bg-black text-white rounded-2xl" : "bg-transparent text-gray-600"
                                    }`}
                            >
                                <div className="flex justify-between items-center">
                                    <span>{style}</span>
                                    <span>&gt;</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            <hr className="p-3 text-gray-200" />

            {/* Apply / Reset Buttons */}
            <div className="flex space-x-2">
                <button
                    onClick={handleResetFilter}
                    className="bg-gray-200 mx-auto text-black px-3 py-1 rounded text-sm"
                >
                    Reset filter
                </button>
            </div>
        </div>
    );
}

export default FilterSidebar;

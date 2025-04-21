// // src/components/SortMenu.js
// import React from "react";

// function SortMenu({ sortBy, handleSortChange }) {
//     return (
//         <div className="flex items-center space-x-2">
//             <span className="text-sm font-medium text-gray-700">Sort by:</span>
//             <select
//                 value={sortBy}
//                 onChange={handleSortChange}
//                 className="appearance-none rounded-md focus:ring-0 focus:outline-none text-sm p-2 bg-white border-0"
//                 style={{ backgroundImage: 'none' }}
//             >
//                 <option value="most-popular" style={{ border: "none" }}>
//                     Most Popular
//                 </option>
//                 <option value="lowest-price" style={{ border: "none" }}>
//                     Lowest Price
//                 </option>
//                 <option value="highest-price" style={{ border: "none" }}>
//                     Highest Price
//                 </option>
//                 <option value="name-asc" style={{ border: "none" }}>
//                     Name (A-Z)
//                 </option>
//                 <option value="name-desc" style={{ border: "none" }}>
//                     Name (Z-A)
//                 </option>
//             </select>
//         </div>

//     );
// }

// export default SortMenu;



import React from "react";

function SortMenu({ sortBy, handleSortChange }) {
    const sortOptions = [
        { value: "most-popular", label: "Most Popular" },
        { value: "lowest-price", label: "Lowest Price" },
        { value: "highest-price", label: "Highest Price" },
        { value: "name-asc", label: "Name (A-Z)" },
        { value: "name-desc", label: "Name (Z-A)" },
    ];

    const handleTileClick = (value) => {
        // Create a synthetic event for compatibility with handleSortChange  
        const syntheticEvent = {
            target: { value },
        };
        handleSortChange(syntheticEvent);
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 w-full sm:w-auto px-4 sm:px-0">
            <label
                htmlFor="sort-menu"
                className="text-sm font-medium text-gray-700 sm:text-base mb-2 sm:mb-0"
            >
                Sort by:
            </label>

            {/* Mobile Tiles (visible on mobile, hidden on desktop) */}
            <div
                role="radiogroup"
                aria-label="Sort products by"
                className="grid grid-cols-2 gap-2 sm:hidden"
            >
                {sortOptions.map((option) => (
                    <button
                        key={option.value}
                        role="radio"
                        aria-checked={sortBy === option.value}
                        tabIndex={0}
                        onClick={() => handleTileClick(option.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                handleTileClick(option.value);
                                e.preventDefault();
                            }
                        }}
                        className={`flex items-center justify-center text-center py-3 px-4 rounded-md border ${sortBy === option.value
                            ? "border-black bg-gray-100 text-gray-900"
                            : "border-gray-300 bg-white text-gray-700"
                            } text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black transition-colors cursor-pointer min-h-[44px]`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            {/* Desktop Dropdown (hidden on mobile, visible on desktop) */}
            <div className="hidden sm:block relative w-full sm:w-auto">
                <select
                    id="sort-menu"
                    value={sortBy}
                    onChange={handleSortChange}
                    className="appearance-none w-full sm:w-48 rounded-md border border-gray-300 bg-white py-2.5 px-3 text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent cursor-pointer pr-10"
                    aria-label="Sort products by"
                >
                    {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
}

export default SortMenu;
// src/components/SortMenu.js
import React from "react";

function SortMenu({ sortBy, handleSortChange }) {
    return (
        <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select
                value={sortBy}
                onChange={handleSortChange}
                className="appearance-none rounded-md focus:ring-0 focus:outline-none text-sm p-2 bg-white border-0"
                style={{ backgroundImage: 'none' }}
            >
                <option value="most-popular" style={{ border: "none" }}>
                    Most Popular
                </option>
                <option value="lowest-price" style={{ border: "none" }}>
                    Lowest Price
                </option>
                <option value="highest-price" style={{ border: "none" }}>
                    Highest Price
                </option>
                <option value="name-asc" style={{ border: "none" }}>
                    Name (A-Z)
                </option>
                <option value="name-desc" style={{ border: "none" }}>
                    Name (Z-A)
                </option>
            </select>
        </div>

    );
}

export default SortMenu;

// src/App.js
import React, { useState } from "react";
import { dummyProducts } from "../customer/dummydata";

// Components
import FilterSidebar from "../customer/productlist/FilterSidebar";
import SortMenu from "./productlist/SortMenu";
import ProductGrid from "./productlist/ProductGrid";
import Pagination from "./productlist/Pagination";



function ProductLists() {




    // ======= State for Filters =======
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedStyle, setSelectedStyle] = useState("All");
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1000);

    // ======= State for Sorting =======
    const [sortBy, setSortBy] = useState("most-popular");

    // ======= State for Pagination =======
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 40; // number of products per page

    // ======= Filtered Products =======
    const filteredProducts = dummyProducts.filter((product) => {
        // Filter by color
        if (selectedColors.length > 0 && !selectedColors.includes(product.color)) {
            return false;
        }
        // Filter by size
        if (selectedSizes.length > 0 && !selectedSizes.includes(product.size)) {
            return false;
        }
        // Filter by style
        if (selectedStyle !== "All" && product.style !== selectedStyle) {
            return false;
        }
        // Filter by price range
        if (minPrice && product.price < Number(minPrice)) {
            return false;
        }
        if (maxPrice && product.price > Number(maxPrice)) {
            return false;
        }
        return true;
    });

    // ======= Sort Products =======
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case "lowest-price":
                return a.price - b.price;
            case "highest-price":
                return b.price - a.price;
            case "name-asc":
                return a.name.localeCompare(b.name);
            case "name-desc":
                return b.name.localeCompare(a.name);
            // "most-popular" can be no-op or custom logic if you have popularity data
            default:
                return 0;
        }
    });

    // ======= Pagination Calculation =======
    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = sortedProducts.slice(startIndex, endIndex);

    // ======= Handlers =======
    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const handleApplyFilter = () => {
        // you can do additional validations or transformations if needed
        setCurrentPage(1);
    };

    const handleResetFilter = () => {
        setSelectedColors([]);
        setSelectedSizes([]);
        setSelectedStyle("All");
        setMinPrice("");
        setMaxPrice("");
        setCurrentPage(1);
    };

    // Pagination handlers
    const goToPreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const goToNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto flex gap-6">
                {/* Sidebar Filters */}
                <FilterSidebar
                    selectedColors={selectedColors}
                    setSelectedColors={setSelectedColors}
                    selectedSizes={selectedSizes}
                    setSelectedSizes={setSelectedSizes}
                    selectedStyle={selectedStyle}
                    setSelectedStyle={setSelectedStyle}
                    minPrice={minPrice}
                    setMinPrice={setMinPrice}
                    maxPrice={maxPrice}
                    setMaxPrice={setMaxPrice}
                    handleApplyFilter={handleApplyFilter}
                    handleResetFilter={handleResetFilter}
                />

                {/* Main Content */}
                <div className="flex-1">
                    {/* Top Bar: Title + Sort */}
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">Casual</h1>
                        <SortMenu sortBy={sortBy} handleSortChange={handleSortChange} />
                    </div>

                    {/* Product Grid */}
                    <ProductGrid products={currentProducts} />

                    {/* Pagination Controls */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        goToPreviousPage={goToPreviousPage}
                        goToNextPage={goToNextPage}
                    />
                </div>
            </div>
        </div>
    );
}

export default ProductLists;

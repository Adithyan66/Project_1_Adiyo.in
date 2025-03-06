

import React, { useEffect, useState } from "react";
import axios from "axios";

import FilterSidebar from "../customer/productlist/FilterSidebar";
import SortMenu from "./productlist/SortMenu";
import ProductGrid from "./productlist/ProductGrid";
import Pagination from "./productlist/Pagination";

function ProductLists({ searchTerm, setSearchTerm }) {
    const [products, setProducts] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedStyle, setSelectedStyle] = useState("All");
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1000);
    const [sortBy, setSortBy] = useState("most-popular");

    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Map the sort value from the UI to the one expected by backend.
    const mapSortValue = (value) => {
        switch (value) {
            case "lowest-price":
                return "price_low_high";
            case "highest-price":
                return "price_high_low";
            case "name-asc":
                return "name_a_z";
            case "name-desc":
                return "name_z_a";
            default:
                return "";
        }
    };

    const fetchProducts = async () => {
        try {
            const params = {
                page: currentPage,
                limit: itemsPerPage,
                sort: mapSortValue(sortBy),
            };

            if (searchTerm.trim() !== "") {
                params.search = searchTerm.trim();
            }

            if (selectedColors.length > 0) {
                // Pass comma-separated list of colors.
                params.color = selectedColors.join(",");
            }
            if (selectedSizes.length > 0) {
                params.size = selectedSizes.join(",");
            }

            if (selectedStyle !== "All") {
                params.dressStyle = selectedStyle;
            }

            if (minPrice) {
                params.minPrice = minPrice;
            }
            if (maxPrice) {
                params.maxPrice = maxPrice;
            }
            console.log("params passing is ", params);

            // You can also pass category if needed:
            // if (category !== 'All') params.category = category;

            const { data } = await axios.get(
                "http://localhost:3333/user/product-list",
                { params }
            );

            console.log("data is ", data);
            // The returned product structure now includes a colors array.
            // For listing purposes, you may choose the first color variant as the default.
            setProducts(data.products);
            setTotalPages(data.totalPages);
        } catch (err) {
            console.error("Failed to fetch products:", err);
        }
    };

    // Fetch products when filters, sorting, or pagination changes.
    useEffect(() => {
        fetchProducts();

    }, [
        selectedColors,
        selectedSizes,
        selectedStyle,
        minPrice,
        maxPrice,
        sortBy,
        searchTerm,
        currentPage,
    ]);

    // Reset page to 1 when filters change.
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedColors, selectedSizes, selectedStyle, minPrice, maxPrice, searchTerm]);

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
        setCurrentPage(1);
    };

    const handleApplyFilter = () => {
        setCurrentPage(1);
        fetchProducts();
    };

    const handleResetFilter = () => {
        setSelectedColors([]);
        setSelectedSizes([]);
        setSelectedStyle("All");
        setMinPrice("");
        setMaxPrice("");
        setSearchTerm("");
    };

    const goToPreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const goToNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    return (
        <div className="min-h-[90%] bg-gray-50 p-4">
            <div className="max-w-11/12 mx-auto flex gap-6">
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
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    handleApplyFilter={handleApplyFilter}
                    handleResetFilter={handleResetFilter}
                />

                {/* Main Content */}
                <div className="flex-1">
                    {/* Top Bar: Title + Sort */}
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">Products</h1>
                        <SortMenu sortBy={sortBy} handleSortChange={handleSortChange} />
                    </div>

                    {/* Product Grid */}
                    <ProductGrid products={products} />

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

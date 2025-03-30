


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

import FilterSidebar from "../customer/productlist/FilterSidebar";
import SortMenu from "./productlist/SortMenu";
import ProductGrid from "./productlist/ProductGrid";
import Pagination from "./productlist/Pagination";
import { getProductList } from "../../services/productService";
import { getCategoryList } from "../../services/categoryService";

const API_BASE_URL = import.meta.env.VITE_API_URL;



function ProductLists({ searchTerm, setSearchTerm }) {
    const location = useLocation();


    const [products, setProducts] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    // This state represents the sub-category filter.
    // It is initially set from the URL if provided.
    const [selectedStyle, setSelectedStyle] = useState("All");

    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1000);
    const [sortBy, setSortBy] = useState("most-popular");

    // New state for category filter from breadcrumbs / sidebar
    const [filterCategory, setFilterCategory] = useState("");

    // Flag to wait for URL filters to load before fetching
    const [filtersLoaded, setFiltersLoaded] = useState(false);

    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // New state to hold categories fetched from DB.
    const [dbCategories, setDbCategories] = useState([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);

    // Map sort value if needed
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

    // On mount, parse query parameters and set filters.
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const category = queryParams.get("category") || "";
        const subCategory = queryParams.get("subCategory") || "";
        setFilterCategory(category);
        if (subCategory) {
            setSelectedStyle(subCategory);
        }
        setFiltersLoaded(true);
    }, [location.search]);

    // Fetch products using the filters.
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
                params.color = selectedColors.join(",");
            }
            if (selectedSizes.length > 0) {
                params.size = selectedSizes.join(",");
            }
            // Only apply subCategory filter if selectedStyle isn't "All"
            if (selectedStyle && selectedStyle !== "All") {
                params.subCategory = selectedStyle;
            }
            if (minPrice) {
                params.minPrice = minPrice;
            }
            if (maxPrice) {
                params.maxPrice = maxPrice;
            }
            if (filterCategory) {
                params.category = filterCategory;
            }

            console.log("Fetch parameters:", params);

            // const { data } = await axios.get(`${API_BASE_URL}/user/product-list`, { params });

            const { data } = await getProductList(params);

            setProducts(data.products);
            setTotalPages(data.totalPages);
        } catch (err) {
            console.error("Failed to fetch products:", err);
        }
    };


    useEffect(() => {
        const fetchDbCategories = async () => {
            try {

                // const response = await axios.get(`${API_BASE_URL}/admin/categories`);

                const response = await getCategoryList();

                setDbCategories(response.data.categories);

                setIsLoadingCategories(false);
            } catch (error) {
                console.error("Error fetching categories:", error);
                setIsLoadingCategories(false);
            }
        };
        fetchDbCategories();
    }, []);

    // Only fetch products after filters are loaded.
    useEffect(() => {
        if (filtersLoaded) {
            fetchProducts();
        }
    }, [
        filtersLoaded,
        selectedColors,
        selectedSizes,
        selectedStyle,
        minPrice,
        maxPrice,
        sortBy,
        searchTerm,
        currentPage,
        filterCategory,
    ]);

    // Reset to first page when filters change.
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedColors, selectedSizes, selectedStyle, minPrice, maxPrice, searchTerm, filterCategory]);

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
        setMinPrice(0);
        setMaxPrice(1000);
        setSearchTerm("");
        setFilterCategory("");
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
                    // Pass the fetched categories and loading state
                    dbCategories={dbCategories}
                    filterCategory={filterCategory}
                    setFilterCategory={setFilterCategory}
                    isLoadingCategories={isLoadingCategories}
                />

                {/* Main Content */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">Products</h1>
                        <SortMenu sortBy={sortBy} handleSortChange={handleSortChange} />
                    </div>

                    <ProductGrid products={products} />

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

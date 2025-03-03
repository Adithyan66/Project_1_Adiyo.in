



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
    // const [searchTerm, setSearchTerm] = useState("");

    const [sortBy, setSortBy] = useState("most-popular");

    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;


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
                sort: mapSortValue(sortBy)
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


            if (selectedStyle !== "All") {
                params.dressStyle = selectedStyle;
            }


            if (minPrice) {
                params.minPrice = minPrice;
            }
            if (maxPrice) {
                params.maxPrice = maxPrice;
            }

            // Example: If you have a category filter, add it similarly:
            // if(category !== 'All') { params.category = category; }

            const { data } = await axios.get("http://localhost:3333/user/product-list", { params });

            setProducts(data.products);

            setTotalPages(data.totalPages);

        } catch (err) {
            console.error("Failed to fetch products:", err);
        }
    };


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
        currentPage
    ]);

    // When any filter changes, reset currentPage to 1
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
        // setCurrentPage(1);
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
                        <h1 className="text-2xl font-bold">Casual</h1>
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


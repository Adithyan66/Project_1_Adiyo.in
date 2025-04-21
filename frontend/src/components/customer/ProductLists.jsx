

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import FilterSidebar from "../customer/productlist/FilterSidebar";
import SortMenu from "./productlist/SortMenu";
import ProductGrid from "./productlist/ProductGrid";
import Pagination from "./productlist/Pagination";
import { getProductList } from "../../services/productService";
import { getCategoryList } from "../../services/categoryService";
import { FilterIcon, SortDescIcon } from "lucide-react";

function ProductLists({ searchTerm, setSearchTerm }) {
    const location = useLocation();

    const [products, setProducts] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedStyle, setSelectedStyle] = useState("All");
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1000);
    const [sortBy, setSortBy] = useState("most-popular");
    const [filterCategory, setFilterCategory] = useState("");
    const [filtersLoaded, setFiltersLoaded] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [dbCategories, setDbCategories] = useState([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false); // Mobile filter sidebar state
    const [isSortModalOpen, setIsSortModalOpen] = useState(false); // Mobile sort modal state

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

    const fetchProducts = async () => {
        try {
            const params = {
                page: currentPage,
                limit: itemsPerPage,
                sort: mapSortValue(sortBy),
            };
            if (searchTerm.trim() !== "") params.search = searchTerm.trim();
            if (selectedColors.length > 0) params.color = selectedColors.join(",");
            if (selectedSizes.length > 0) params.size = selectedSizes.join(",");
            if (selectedStyle && selectedStyle !== "All") params.subCategory = selectedStyle;
            if (minPrice) params.minPrice = minPrice;
            if (maxPrice) params.maxPrice = maxPrice;
            if (filterCategory) params.category = filterCategory;

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

    useEffect(() => {
        if (filtersLoaded) fetchProducts();
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

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedColors, selectedSizes, selectedStyle, minPrice, maxPrice, searchTerm, filterCategory]);

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
        setCurrentPage(1);
        setIsSortModalOpen(false); // Close sort modal on selection
    };

    const handleApplyFilter = () => {
        setCurrentPage(1);
        fetchProducts();
        setIsFilterSidebarOpen(false); // Close filter sidebar on apply
    };

    const handleResetFilter = () => {
        setSelectedColors([]);
        setSelectedSizes([]);
        setSelectedStyle("All");
        setMinPrice(0);
        setMaxPrice(1000);
        setSearchTerm("");
        setFilterCategory("");
        setIsFilterSidebarOpen(false); // Close filter sidebar on reset
    };

    const goToPreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const goToNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const toggleFilterSidebar = () => {
        setIsFilterSidebarOpen(!isFilterSidebarOpen);
    };

    const toggleSortModal = () => {
        setIsSortModalOpen(!isSortModalOpen);
    };

    return (
        <div className="min-h-[90vh] bg-gray-50 ">
            <div className="max-w-11/12 mx-auto">

                <FilterSortBar toggleFilterSidebar={toggleFilterSidebar} toggleSortModal={toggleSortModal} />

                <div className="flex gap-6">
                    {/* Filter Sidebar - Desktop (unchanged) */}
                    <div className="hidden md:block">
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
                            dbCategories={dbCategories}
                            filterCategory={filterCategory}
                            setFilterCategory={setFilterCategory}
                            isLoadingCategories={isLoadingCategories}
                        />
                    </div>

                    {/* Filter Sidebar - Mobile (Slide-in, Scrollable) */}
                    <div
                        className={`md:hidden fixed inset-y-0 left-0 z-50 w-3/4 max-w-xs bg-white transform ${isFilterSidebarOpen ? "translate-x-0" : "-translate-x-full"
                            } transition-transform duration-300 ease-in-out`}
                    >
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-xl font-bold">Filters</h2>
                            <button
                                onClick={toggleFilterSidebar}
                                className="text-gray-600 hover:text-black"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="overflow-y-auto h-[calc(100vh-64px)] scrollbar-hidden">
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
                                dbCategories={dbCategories}
                                filterCategory={filterCategory}
                                setFilterCategory={setFilterCategory}
                                isLoadingCategories={isLoadingCategories}
                            />
                        </div>
                    </div>

                    {/* Overlay for Mobile Filter Sidebar */}
                    {isFilterSidebarOpen && (
                        <div
                            className="md:hidden fixed inset-0  bg-opacity-50 z-40"
                            onClick={toggleFilterSidebar}
                        ></div>
                    )}

                    {/* Sort Modal - Mobile */}
                    {isSortModalOpen && (
                        <div className="md:hidden fixed inset-0 z-50 flex items-end">
                            <div
                                className=" bg-opacity-50 w-full h-full absolute"
                                onClick={toggleSortModal}
                            ></div>
                            <div className="bg-white w-full p-4 rounded-t-lg animate-slide-up">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold">Sort By</h2>
                                    <button
                                        onClick={toggleSortModal}
                                        className="text-gray-600 hover:text-black"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <SortMenu sortBy={sortBy} handleSortChange={handleSortChange} />
                            </div>
                        </div>
                    )}

                    {/* Main Content */}
                    <div className="flex-1  md:pt-0">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-2xl font-bold"></h1>
                            <div className="hidden md:block">
                                <SortMenu sortBy={sortBy} handleSortChange={handleSortChange} />
                            </div>
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
        </div>
    );
}

export default ProductLists;





const FilterSortBar = ({ toggleFilterSidebar, toggleSortModal }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <div
            className={`md:hidden fixed z-50 left-0 right-0 bg-white shadow-md transition-transform duration-300 ${isVisible ? 'translate-y-0' : 'translate-y-full'
                }`}
            style={{ bottom: "25px" }}
        >
            <div className="flex items-center justify-between px-4 py-3">
                <button
                    onClick={toggleFilterSidebar}
                    className="flex-1 flex items-center justify-center bg-gray-50 text-gray-800 px-4 py-2.5 rounded-md font-medium text-sm"
                    aria-label="Open filter sidebar"
                >
                    <FilterIcon className="mr-2 h-4 w-4" />
                    Filter
                </button>
                <div className="mx-2 h-6 border-r border-gray-200"></div>
                <button
                    onClick={toggleSortModal}
                    className="flex-1 flex items-center justify-center bg-gray-50 text-gray-800 px-4 py-2.5 rounded-md font-medium text-sm"
                    aria-label="Open sort options"
                >
                    <SortDescIcon className="mr-2 h-4 w-4" />
                    Sort
                </button>
            </div>
        </div>
    );
};


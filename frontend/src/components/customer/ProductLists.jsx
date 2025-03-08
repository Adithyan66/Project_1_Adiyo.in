

// // // import React, { useEffect, useState } from "react";
// // // import axios from "axios";

// // // import FilterSidebar from "../customer/productlist/FilterSidebar";
// // // import SortMenu from "./productlist/SortMenu";
// // // import ProductGrid from "./productlist/ProductGrid";
// // // import Pagination from "./productlist/Pagination";

// // // function ProductLists({ searchTerm, setSearchTerm }) {


// // //     const [products, setProducts] = useState([]);
// // //     const [selectedColors, setSelectedColors] = useState([]);
// // //     const [selectedSizes, setSelectedSizes] = useState([]);
// // //     const [selectedStyle, setSelectedStyle] = useState("All");
// // //     const [minPrice, setMinPrice] = useState(0);
// // //     const [maxPrice, setMaxPrice] = useState(1000);
// // //     const [sortBy, setSortBy] = useState("most-popular");

// // //     const [totalPages, setTotalPages] = useState(1);
// // //     const [currentPage, setCurrentPage] = useState(1);
// // //     const itemsPerPage = 10;


// // //     const mapSortValue = (value) => {
// // //         switch (value) {
// // //             case "lowest-price":
// // //                 return "price_low_high";
// // //             case "highest-price":
// // //                 return "price_high_low";
// // //             case "name-asc":
// // //                 return "name_a_z";
// // //             case "name-desc":
// // //                 return "name_z_a";
// // //             default:
// // //                 return "";
// // //         }
// // //     };

// // //     const fetchProducts = async () => {
// // //         try {
// // //             const params = {
// // //                 page: currentPage,
// // //                 limit: itemsPerPage,
// // //                 sort: mapSortValue(sortBy),
// // //             };

// // //             if (searchTerm.trim() !== "") {
// // //                 params.search = searchTerm.trim();
// // //             }

// // //             if (selectedColors.length > 0) {
// // //                 params.color = selectedColors.join(",");
// // //             }
// // //             if (selectedSizes.length > 0) {
// // //                 params.size = selectedSizes.join(",");
// // //             }

// // //             if (selectedStyle !== "All") {
// // //                 params.dressStyle = selectedStyle;
// // //             }

// // //             if (minPrice) {
// // //                 params.minPrice = minPrice;
// // //             }
// // //             if (maxPrice) {
// // //                 params.maxPrice = maxPrice;
// // //             }



// // //             const { data } = await axios.get(
// // //                 "http://localhost:3333/user/product-list",
// // //                 { params }
// // //             );

// // //             console.log("data is ", data);
// // //             setProducts(data.products);
// // //             setTotalPages(data.totalPages);

// // //         } catch (err) {
// // //             console.error("Failed to fetch products:", err);
// // //         }
// // //     };

// // //     useEffect(() => {
// // //         fetchProducts();

// // //     }, [
// // //         selectedColors,
// // //         selectedSizes,
// // //         selectedStyle,
// // //         minPrice,
// // //         maxPrice,
// // //         sortBy,
// // //         searchTerm,
// // //         currentPage,
// // //     ]);


// // //     useEffect(() => {

// // //         setCurrentPage(1);

// // //     }, [selectedColors, selectedSizes, selectedStyle, minPrice, maxPrice, searchTerm]);



// // //     const handleSortChange = (e) => {
// // //         setSortBy(e.target.value);
// // //         setCurrentPage(1);
// // //     };

// // //     const handleApplyFilter = () => {
// // //         setCurrentPage(1);
// // //         fetchProducts();
// // //     };

// // //     const handleResetFilter = () => {
// // //         setSelectedColors([]);
// // //         setSelectedSizes([]);
// // //         setSelectedStyle("All");
// // //         setMinPrice("");
// // //         setMaxPrice("");
// // //         setSearchTerm("");
// // //     };

// // //     const goToPreviousPage = () => {
// // //         setCurrentPage((prev) => Math.max(prev - 1, 1));
// // //     };

// // //     const goToNextPage = () => {
// // //         setCurrentPage((prev) => Math.min(prev + 1, totalPages));
// // //     };

// // //     return (
// // //         <div className="min-h-[90%] bg-gray-50 p-4">
// // //             <div className="max-w-11/12 mx-auto flex gap-6">
// // //                 <FilterSidebar
// // //                     selectedColors={selectedColors}
// // //                     setSelectedColors={setSelectedColors}
// // //                     selectedSizes={selectedSizes}
// // //                     setSelectedSizes={setSelectedSizes}
// // //                     selectedStyle={selectedStyle}
// // //                     setSelectedStyle={setSelectedStyle}
// // //                     minPrice={minPrice}
// // //                     setMinPrice={setMinPrice}
// // //                     maxPrice={maxPrice}
// // //                     setMaxPrice={setMaxPrice}
// // //                     searchTerm={searchTerm}
// // //                     setSearchTerm={setSearchTerm}
// // //                     handleApplyFilter={handleApplyFilter}
// // //                     handleResetFilter={handleResetFilter}
// // //                 />

// // //                 {/* Main Content */}
// // //                 <div className="flex-1">
// // //                     {/* Top Bar: Title + Sort */}
// // //                     <div className="flex justify-between items-center mb-4">
// // //                         <h1 className="text-2xl font-bold">Products</h1>
// // //                         <SortMenu sortBy={sortBy} handleSortChange={handleSortChange} />
// // //                     </div>

// // //                     {/* Product Grid */}
// // //                     <ProductGrid products={products} />

// // //                     {/* Pagination Controls */}
// // //                     <Pagination
// // //                         currentPage={currentPage}
// // //                         totalPages={totalPages}
// // //                         goToPreviousPage={goToPreviousPage}
// // //                         goToNextPage={goToNextPage}
// // //                     />
// // //                 </div>
// // //             </div>
// // //         </div>
// // //     );
// // // }

// // // export default ProductLists;







// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import { useLocation } from "react-router-dom";

// // import FilterSidebar from "../customer/productlist/FilterSidebar";
// // import SortMenu from "./productlist/SortMenu";
// // import ProductGrid from "./productlist/ProductGrid";
// // import Pagination from "./productlist/Pagination";

// // function ProductLists({ searchTerm, setSearchTerm }) {

// //     const location = useLocation();

// //     // Existing filter states
// //     const [products, setProducts] = useState([]);
// //     const [selectedColors, setSelectedColors] = useState([]);
// //     const [selectedSizes, setSelectedSizes] = useState([]);
// //     const [selectedStyle, setSelectedStyle] = useState("All");
// //     const [minPrice, setMinPrice] = useState(0);
// //     const [maxPrice, setMaxPrice] = useState(1000);
// //     const [sortBy, setSortBy] = useState("most-popular");

// //     // New states for category filters from breadcrumbs
// //     const [filterCategory, setFilterCategory] = useState("");
// //     const [filterSubCategory, setFilterSubCategory] = useState("");

// //     const [totalPages, setTotalPages] = useState(1);
// //     const [currentPage, setCurrentPage] = useState(1);
// //     const itemsPerPage = 10;

// //     // Map sort value if needed
// //     const mapSortValue = (value) => {
// //         switch (value) {
// //             case "lowest-price":
// //                 return "price_low_high";
// //             case "highest-price":
// //                 return "price_high_low";
// //             case "name-asc":
// //                 return "name_a_z";
// //             case "name-desc":
// //                 return "name_z_a";
// //             default:
// //                 return "";
// //         }
// //     };

// //     // Parse query parameters on mount or when location.search changes
// //     useEffect(() => {
// //         const queryParams = new URLSearchParams(location.search);
// //         const category = queryParams.get("category") || "";
// //         const subCategory = queryParams.get("subCategory") || "";
// //         setFilterCategory(category);
// //         setFilterSubCategory(subCategory);
// //         // Optionally, update the local filter (selectedStyle) if subCategory is provided
// //         if (subCategory) {
// //             setSelectedStyle(subCategory);
// //         }
// //     }, [location.search]);
// //     const fetchProducts = async () => {
// //         try {
// //             const params = {
// //                 page: currentPage,
// //                 limit: itemsPerPage,
// //                 sort: mapSortValue(sortBy),
// //             };

// //             if (searchTerm.trim() !== "") {
// //                 params.search = searchTerm.trim();
// //             }

// //             if (selectedColors.length > 0) {
// //                 params.color = selectedColors.join(",");
// //             }
// //             if (selectedSizes.length > 0) {
// //                 params.size = selectedSizes.join(",");
// //             }

// //             // Use the breadcrumb filter if provided and not "All"
// //             if (filterSubCategory && filterSubCategory !== "All") {
// //                 params.subCategory = filterSubCategory;
// //             } else if (selectedStyle && selectedStyle !== "All") {
// //                 params.subCategory = selectedStyle;
// //             }

// //             if (minPrice) {
// //                 params.minPrice = minPrice;
// //             }
// //             if (maxPrice) {
// //                 params.maxPrice = maxPrice;
// //             }

// //             if (filterCategory) {
// //                 params.category = filterCategory;
// //             }

// //             console.log("Fetch parameters:", params); // Verify the filter values

// //             const { data } = await axios.get("http://localhost:3333/user/product-list", { params });
// //             setProducts(data.products);
// //             setTotalPages(data.totalPages);
// //         } catch (err) {
// //             console.error("Failed to fetch products:", err);
// //         }
// //     };


// //     useEffect(() => {
// //         fetchProducts();
// //     }, [
// //         selectedColors,
// //         selectedSizes,
// //         selectedStyle,
// //         minPrice,
// //         maxPrice,
// //         sortBy,
// //         searchTerm,
// //         currentPage,
// //         filterCategory,
// //         filterSubCategory,
// //     ]);

// //     // Reset to first page when filters change
// //     useEffect(() => {
// //         setCurrentPage(1);
// //     }, [selectedColors, selectedSizes, selectedStyle, minPrice, maxPrice, searchTerm, filterCategory, filterSubCategory]);

// //     const handleSortChange = (e) => {
// //         setSortBy(e.target.value);
// //         setCurrentPage(1);
// //     };

// //     const handleApplyFilter = () => {
// //         setCurrentPage(1);
// //         fetchProducts();
// //     };

// //     const handleResetFilter = () => {
// //         setSelectedColors([]);
// //         setSelectedSizes([]);
// //         setSelectedStyle("All");
// //         setMinPrice("");
// //         setMaxPrice("");
// //         setSearchTerm("");
// //         // Optionally reset breadcrumb filters as well
// //         setFilterCategory("");
// //         setFilterSubCategory("");
// //     };

// //     const goToPreviousPage = () => {
// //         setCurrentPage((prev) => Math.max(prev - 1, 1));
// //     };

// //     const goToNextPage = () => {
// //         setCurrentPage((prev) => Math.min(prev + 1, totalPages));
// //     };

// //     return (
// //         <div className="min-h-[90%] bg-gray-50 p-4">
// //             <div className="max-w-11/12 mx-auto flex gap-6">
// //                 <FilterSidebar
// //                     selectedColors={selectedColors}
// //                     setSelectedColors={setSelectedColors}
// //                     selectedSizes={selectedSizes}
// //                     setSelectedSizes={setSelectedSizes}
// //                     selectedStyle={selectedStyle}
// //                     setSelectedStyle={setSelectedStyle}
// //                     minPrice={minPrice}
// //                     setMinPrice={setMinPrice}
// //                     maxPrice={maxPrice}
// //                     setMaxPrice={setMaxPrice}
// //                     searchTerm={searchTerm}
// //                     setSearchTerm={setSearchTerm}
// //                     handleApplyFilter={handleApplyFilter}
// //                     handleResetFilter={handleResetFilter}
// //                 />

// //                 {/* Main Content */}
// //                 <div className="flex-1">
// //                     {/* Top Bar: Title + Sort */}
// //                     <div className="flex justify-between items-center mb-4">
// //                         <h1 className="text-2xl font-bold">Products</h1>
// //                         <SortMenu sortBy={sortBy} handleSortChange={handleSortChange} />
// //                     </div>

// //                     {/* Product Grid */}
// //                     <ProductGrid products={products} />

// //                     {/* Pagination Controls */}
// //                     <Pagination
// //                         currentPage={currentPage}
// //                         totalPages={totalPages}
// //                         goToPreviousPage={goToPreviousPage}
// //                         goToNextPage={goToNextPage}
// //                     />
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }

// // export default ProductLists;



// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useLocation } from "react-router-dom";

// import FilterSidebar from "../customer/productlist/FilterSidebar";
// import SortMenu from "./productlist/SortMenu";
// import ProductGrid from "./productlist/ProductGrid";
// import Pagination from "./productlist/Pagination";

// function ProductLists({ searchTerm, setSearchTerm }) {
//     const location = useLocation();

//     // Existing filter states
//     const [products, setProducts] = useState([]);
//     const [selectedColors, setSelectedColors] = useState([]);
//     const [selectedSizes, setSelectedSizes] = useState([]);
//     const [selectedStyle, setSelectedStyle] = useState("All");
//     const [minPrice, setMinPrice] = useState(0);
//     const [maxPrice, setMaxPrice] = useState(1000);
//     const [sortBy, setSortBy] = useState("most-popular");

//     // New states for category filters from breadcrumbs
//     const [filterCategory, setFilterCategory] = useState("");
//     const [filterSubCategory, setFilterSubCategory] = useState("");

//     // New state to ensure filters from URL are loaded before fetching
//     const [filtersLoaded, setFiltersLoaded] = useState(false);

//     const [totalPages, setTotalPages] = useState(1);
//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 10;

//     // Map sort value if needed
//     const mapSortValue = (value) => {
//         switch (value) {
//             case "lowest-price":
//                 return "price_low_high";
//             case "highest-price":
//                 return "price_high_low";
//             case "name-asc":
//                 return "name_a_z";
//             case "name-desc":
//                 return "name_z_a";
//             default:
//                 return "";
//         }
//     };

//     // Parse query parameters on mount or when location.search changes
//     useEffect(() => {
//         const queryParams = new URLSearchParams(location.search);
//         const category = queryParams.get("category") || "";
//         const subCategory = queryParams.get("subCategory") || "";
//         setFilterCategory(category);
//         setFilterSubCategory(subCategory);
//         // Update local filter (selectedStyle) if subCategory exists
//         if (subCategory) {
//             setSelectedStyle(subCategory);
//         }
//         // Mark filters as loaded so fetching can proceed
//         setFiltersLoaded(true);
//     }, [location.search]);

//     const fetchProducts = async () => {
//         try {
//             const params = {
//                 page: currentPage,
//                 limit: itemsPerPage,
//                 sort: mapSortValue(sortBy),
//             };

//             if (searchTerm.trim() !== "") {
//                 params.search = searchTerm.trim();
//             }

//             if (selectedColors.length > 0) {
//                 params.color = selectedColors.join(",");
//             }
//             if (selectedSizes.length > 0) {
//                 params.size = selectedSizes.join(",");
//             }

//             // Use only one sub-category filter when not "All"
//             if (filterSubCategory && filterSubCategory !== "All") {
//                 params.subCategory = filterSubCategory;
//             } else if (selectedStyle && selectedStyle !== "All") {
//                 params.subCategory = selectedStyle;
//             }

//             if (minPrice) {
//                 params.minPrice = minPrice;
//             }
//             if (maxPrice) {
//                 params.maxPrice = maxPrice;
//             }
//             if (filterCategory) {
//                 params.category = filterCategory;
//             }

//             console.log("Fetch parameters:", params);

//             const { data } = await axios.get("http://localhost:3333/user/product-list", { params });
//             setProducts(data.products);
//             setTotalPages(data.totalPages);
//         } catch (err) {
//             console.error("Failed to fetch products:", err);
//         }
//     };

//     // Only fetch products after filters are loaded
//     useEffect(() => {
//         if (filtersLoaded) {
//             fetchProducts();
//         }
//     }, [
//         filtersLoaded,
//         selectedColors,
//         selectedSizes,
//         selectedStyle,
//         minPrice,
//         maxPrice,
//         sortBy,
//         searchTerm,
//         currentPage,
//         filterCategory,
//         filterSubCategory,
//     ]);

//     // Reset to first page when filters change
//     useEffect(() => {
//         setCurrentPage(1);
//     }, [selectedColors, selectedSizes, selectedStyle, minPrice, maxPrice, searchTerm, filterCategory, filterSubCategory]);

//     const handleSortChange = (e) => {
//         setSortBy(e.target.value);
//         setCurrentPage(1);
//     };

//     const handleApplyFilter = () => {
//         setCurrentPage(1);
//         fetchProducts();
//     };

//     const handleResetFilter = () => {
//         setSelectedColors([]);
//         setSelectedSizes([]);
//         setSelectedStyle("All");
//         setMinPrice("");
//         setMaxPrice("");
//         setSearchTerm("");
//         // Optionally, reset breadcrumb filters too if needed
//         setFilterCategory("");
//         setFilterSubCategory("");
//     };

//     const goToPreviousPage = () => {
//         setCurrentPage((prev) => Math.max(prev - 1, 1));
//     };

//     const goToNextPage = () => {
//         setCurrentPage((prev) => Math.min(prev + 1, totalPages));
//     };

//     return (
//         <div className="min-h-[90%] bg-gray-50 p-4">
//             <div className="max-w-11/12 mx-auto flex gap-6">
//                 <FilterSidebar
//                     selectedColors={selectedColors}
//                     setSelectedColors={setSelectedColors}
//                     selectedSizes={selectedSizes}
//                     setSelectedSizes={setSelectedSizes}
//                     selectedStyle={selectedStyle}
//                     setSelectedStyle={setSelectedStyle}
//                     minPrice={minPrice}
//                     setMinPrice={setMinPrice}
//                     maxPrice={maxPrice}
//                     setMaxPrice={setMaxPrice}
//                     searchTerm={searchTerm}
//                     setSearchTerm={setSearchTerm}
//                     handleApplyFilter={handleApplyFilter}
//                     handleResetFilter={handleResetFilter}
//                 />

//                 {/* Main Content */}
//                 <div className="flex-1">
//                     {/* Top Bar: Title + Sort */}
//                     <div className="flex justify-between items-center mb-4">
//                         <h1 className="text-2xl font-bold">Products</h1>
//                         <SortMenu sortBy={sortBy} handleSortChange={handleSortChange} />
//                     </div>

//                     {/* Product Grid */}
//                     <ProductGrid products={products} />

//                     {/* Pagination Controls */}
//                     <Pagination
//                         currentPage={currentPage}
//                         totalPages={totalPages}
//                         goToPreviousPage={goToPreviousPage}
//                         goToNextPage={goToNextPage}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default ProductLists;




import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

import FilterSidebar from "../customer/productlist/FilterSidebar";
import SortMenu from "./productlist/SortMenu";
import ProductGrid from "./productlist/ProductGrid";
import Pagination from "./productlist/Pagination";

function ProductLists({ searchTerm, setSearchTerm }) {
    const location = useLocation();

    // Filter and sorting states
    const [products, setProducts] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    // This state represents the sub-category filter.
    // It is initially set from the URL if provided.
    const [selectedStyle, setSelectedStyle] = useState("All");

    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1000);
    const [sortBy, setSortBy] = useState("most-popular");

    // New state for category filter from breadcrumbs
    const [filterCategory, setFilterCategory] = useState("");

    // A flag to wait for URL filters to load before fetching
    const [filtersLoaded, setFiltersLoaded] = useState(false);

    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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
        // If a sub-category is provided from breadcrumbs, set it as the initial filter.
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

            const { data } = await axios.get("http://localhost:3333/user/product-list", { params });
            setProducts(data.products);
            setTotalPages(data.totalPages);
        } catch (err) {
            console.error("Failed to fetch products:", err);
        }
    };

    // Only fetch after filters are loaded
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

    // Reset to first page when filters change
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
        setMinPrice("");
        setMaxPrice("");
        setSearchTerm("");
        // Optionally reset the category filter if needed.
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

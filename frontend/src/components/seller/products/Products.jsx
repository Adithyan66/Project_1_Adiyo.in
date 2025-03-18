


// import React, { useEffect, useState } from "react";
// import { FiSearch } from "react-icons/fi";
// import plus from "../../../assets/images/Plus.svg";
// import editicon from "../../../assets/images/edit.png";
// import deleteicon from "../../../assets/images/delete.png";
// import axios from "axios";

// const API_BASE_URL = import.meta.env.VITE_API_URL;

// import { setEditProductID } from '../../../store/slices/sellerSideSelectedSlice';
// import { useDispatch } from "react-redux";

// const Products = ({ setSelectedSection }) => {

//     const dispatch = useDispatch();

//     const [initialProductsData, setInitialProductsData] = useState([]);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [currentPage, setCurrentPage] = useState(1);
//     const [pageSize, setPageSize] = useState(10);

//     // State for custom delete modal
//     const [deleteModal, setDeleteModal] = useState({
//         open: false,
//         productId: null,
//     });

//     const filteredProducts = initialProductsData.filter((product) =>
//         product.name.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     const totalItems = filteredProducts.length;
//     const totalPages = Math.ceil(totalItems / pageSize);
//     const indexOfLastItem = currentPage * pageSize;
//     const indexOfFirstItem = indexOfLastItem - pageSize;
//     const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

//     const getPageNumbers = () => {
//         let startPage, endPage;
//         if (totalPages <= 5) {
//             startPage = 1;
//             endPage = totalPages;
//         } else {
//             if (currentPage <= 3) {
//                 startPage = 1;
//                 endPage = 5;
//             } else if (currentPage + 2 >= totalPages) {
//                 startPage = totalPages - 4;
//                 endPage = totalPages;
//             } else {
//                 startPage = currentPage - 2;
//                 endPage = currentPage + 2;
//             }
//         }
//         return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
//     };

//     const handleSearchChange = (e) => {
//         setSearchQuery(e.target.value);
//         setCurrentPage(1);
//     };

//     const handlePageSizeChange = (e) => {
//         setPageSize(Number(e.target.value));
//         setCurrentPage(1);
//     };

//     const goToPage = (page) => {
//         setCurrentPage(page);
//     };

//     useEffect(() => {
//         fetchProducts();
//     }, []);


//     const fetchProducts = async () => {
//         try {
//             const response = await axios.get(`${API_BASE_URL}/seller/products`);
//             setInitialProductsData(response.data.products);
//         } catch (error) {
//             console.error("Error fetching products:", error);
//         }
//     };


//     function formatedDate(dateString) {
//         const dateObj = new Date(dateString);
//         return dateObj.toLocaleDateString("en-GB");
//     }

//     // Open modal with product id to delete
//     const handleOpenDeleteModal = (id) => {
//         setDeleteModal({ open: true, productId: id });
//     };

//     // Close modal without action
//     const handleCloseDeleteModal = () => {
//         setDeleteModal({ open: false, productId: null });
//     };

//     // Confirm deletion from modal
//     const confirmDelete = async (id) => {
//         try {
//             const response = await axios.delete(`${API_BASE_URL}/seller/delete-product/${id}`);

//             console.log(response.data);

//             fetchProducts()

//         } catch (error) {

//             console.error("Error deleting product:", error);
//         } finally {

//             handleCloseDeleteModal();
//         }
//     };

//     if (initialProductsData.length < 1) {
//         return (
//             <div>
//                 <button
//                     className="border bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 flex"
//                     onClick={() => setSelectedSection("addProduct")}
//                 >
//                     <img className="w-4 h-4 mr-3 mt-1" src={plus} alt="plus icon" />
//                     New
//                 </button>
//                 <h1>loading.....</h1>
//             </div>
//         );
//     }

//     return (
//         <div className="w-full min-h-[800px]">
//             {/* Top Bar */}
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
//                 <h2 className="text-2xl font-bold mb-2 sm:mb-0">Products Management</h2>
//                 <div className="flex flex-wrap items-center gap-2">
//                     <div className="relative">
//                         <input
//                             type="text"
//                             placeholder="Search..."
//                             className="pl-8 pr-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-black"
//                             value={searchQuery}
//                             onChange={handleSearchChange}
//                         />
//                         <FiSearch className="absolute left-2 top-2 text-gray-400" />
//                     </div>

//                     <button
//                         className="border bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 flex"
//                         onClick={() => setSelectedSection("addProduct")}
//                     >
//                         <img className="w-4 h-4 mr-3 mt-1" src={plus} alt="plus icon" />
//                         New
//                     </button>
//                     <button className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100">
//                         Filters
//                     </button>
//                 </div>
//             </div>

//             {/* Table */}
//             <div className="overflow-x-auto w-full">
//                 <table className="w-full text-left border-collapse">
//                     <thead>
//                         <tr className="bg-black text-white">
//                             <th className="py-3 px-4">Products</th>
//                             <th className="py-3 px-4">Product ID</th>
//                             <th className="py-3 px-4">Added on</th>
//                             <th className="py-3 px-4">Base Price</th>
//                             <th className="py-3 px-4">Discount Price</th>
//                             <th className="py-3 px-4">Category</th>
//                             <th className="py-3 px-4">Stock</th>
//                             <th className="py-3 px-4">Varients</th>
//                             <th className="py-3 px-4"></th>
//                         </tr>
//                     </thead>
//                     <tbody className="bg-white">
//                         {currentProducts.length > 0 ? (
//                             currentProducts.map((product) => (
//                                 <tr key={product._id} className="border-4 border-white bg-gray-200 hover:bg-gray-300">
//                                     <td className="py-3 px-4 flex items-center space-x-2">
//                                         <img
//                                             src={`https://i.pravatar.cc/40?u=${product.id}`}
//                                             alt="product"
//                                             className="w-8 h-8 rounded-full"
//                                         />
//                                         <span>{product.name}</span>
//                                     </td>
//                                     <td className="py-3 px-4 ">{product.sku}</td>
//                                     <td className="py-3 px-4 ">{formatedDate(product.createdAt)}</td>
//                                     <td className="py-3 px-4 text-center">₹ {product.colors[0].basePrice.toLocaleString()}</td>
//                                     <td className="py-3 px-4 text-center">₹ {product.colors[0].discountPrice.toLocaleString()}</td>
//                                     <td className="py-3 px-4 text-center">{product?.category?.name}</td>
//                                     <td className="py-3 px-4 text-center">{product.colors[0].totalStock}</td>
//                                     <td className="py-3 px-4 text-center">{product.colors.length}</td>
//                                     <td className="py-3 px-4">
//                                         <button
//                                             className="text-black px-3 py-1 rounded hover:bg-gray-200"
//                                             onClick={() => {
//                                                 setSelectedSection("editProduct");
//                                                 dispatch(setEditProductID(product._id));
//                                             }}
//                                         >
//                                             <img src={editicon} alt="edit" />
//                                         </button>
//                                         <button
//                                             className="text-black px-3 py-1 rounded hover:bg-gray-200"
//                                             onClick={() => handleOpenDeleteModal(product._id)}
//                                         >
//                                             <img src={deleteicon} alt="delete" />
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan="7" className="py-4 text-center">
//                                     No products found.
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Pagination & Page Size */}
//             <div className="flex flex-col sm:flex-row sm:justify-between items-center mt-4 gap-2">
//                 <div className="text-sm">
//                     <label htmlFor="pageSizeSelect" className="mr-2">
//                         Show results:
//                     </label>
//                     <select
//                         id="pageSizeSelect"
//                         value={pageSize}
//                         onChange={handlePageSizeChange}
//                         className="border rounded p-1"
//                     >
//                         <option value={2}>2</option>
//                         <option value={5}>5</option>
//                         <option value={10}>10</option>
//                     </select>
//                 </div>
//                 <div className="flex items-center space-x-1">
//                     {/* Previous button */}
//                     <button
//                         onClick={() => goToPage(currentPage - 1)}
//                         disabled={currentPage === 1}
//                         className="px-3 py-1 rounded disabled:opacity-50"
//                     >
//                         &lt;
//                     </button>
//                     {/* Page numbers */}
//                     {getPageNumbers().map((pageNum) => (
//                         <button
//                             key={pageNum}
//                             onClick={() => goToPage(pageNum)}
//                             className={`px-3 py-1 rounded-full ${currentPage === pageNum ? "bg-gray-900 text-white" : ""
//                                 }`}
//                         >
//                             {pageNum}
//                         </button>
//                     ))}
//                     {/* Next button */}
//                     <button
//                         onClick={() => goToPage(currentPage + 1)}
//                         disabled={currentPage === totalPages || totalPages === 0}
//                         className="px-3 py-1 rounded disabled:opacity-50"
//                     >
//                         &gt;
//                     </button>
//                 </div>
//             </div>

//             {deleteModal.open && (
//                 <div className="fixed inset-0 flex items-center justify-center z-50">
//                     <div className="bg-white rounded p-6 w-100 shadow-2xl border-4 border-black">
//                         <h2 className="text-xl font-bold mb-4 text-center">Confirm Deletion</h2>
//                         <p className="mb-6 text-center">
//                             Are you sure you want to delete this product?
//                         </p>
//                         <div className="flex justify-center gap-4">
//                             <button
//                                 className="bg-gray-300 text-black px-4 py-2 rounded"
//                                 onClick={handleCloseDeleteModal}
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 className="bg-black text-white px-4 py-2 rounded"
//                                 onClick={() => confirmDelete(deleteModal.productId)}
//                             >
//                                 Delete
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//         </div>
//     );
// };

// export default Products;







import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import plus from "../../../assets/images/Plus.svg";
import editIcon from "../../../assets/images/edit.png";
import deleteIcon from "../../../assets/images/delete.png";
import { setEditProductID } from '../../../store/slices/sellerSideSelectedSlice';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const Products = ({ setSelectedSection }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalProducts, setTotalProducts] = useState(0);

    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");
    const [categoryFilter, setCategoryFilter] = useState("all");

    // State for custom delete modal
    const [deleteModal, setDeleteModal] = useState({
        open: false,
        productId: null,
    });

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [currentPage, pageSize, searchTerm, sortBy, sortOrder, categoryFilter]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/categories`);
            setCategories(response.data.categories || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage,
                limit: pageSize,
                sortBy,
                sortOrder,
                ...(searchTerm && { search: searchTerm }),
                ...(categoryFilter !== "all" && { category: categoryFilter })
            });

            const response = await axios.get(`${API_BASE_URL}/seller/products?${params}`);
            setProducts(response.data.products || []);
            setTotalProducts(response.data.totalProducts || response.data.products.length);
            setError(null);
        } catch (error) {
            console.error("Error fetching products:", error);
            setError("Failed to fetch products. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
    };

    const clearSearch = () => {
        setSearchTerm("");
        setCurrentPage(1);
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("desc");
        }
        setCurrentPage(1);
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
    };

    const formatedDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    // Open modal with product id to delete
    const handleOpenDeleteModal = (id) => {
        setDeleteModal({ open: true, productId: id });
    };

    // Close modal without action
    const handleCloseDeleteModal = () => {
        setDeleteModal({ open: false, productId: null });
    };

    // Confirm deletion from modal
    const confirmDelete = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/seller/delete-product/${id}`);
            fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
        } finally {
            handleCloseDeleteModal();
        }
    };

    if (loading && products.length === 0) {
        return (
            <div className="w-full min-h-[800px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
            </div>
        );
    }

    if (error && products.length === 0) {
        return (
            <div className="w-full min-h-[800px] flex items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    const totalPages = Math.ceil(totalProducts / pageSize);

    return (
        <div className="p-4 md:p-6 bg-gray-50 w-full min-h-[800px]">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                <h1 className="text-2xl font-bold mb-4 md:mb-0">Products Management</h1>

                {/* Search and filters */}
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
                    <form onSubmit={handleSearch} className="flex">
                        <input
                            type="text"
                            placeholder="Search by Name, SKU..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-black"
                        />
                        <button
                            type="submit"
                            className="bg-black text-white px-4 py-2"
                        >
                            Search
                        </button>
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="bg-gray-200 px-4 py-2 rounded-r hover:bg-gray-300"
                            >
                                Clear
                            </button>
                        )}
                    </form>

                    <select
                        value={categoryFilter}
                        onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                    >
                        <option value="all">All Categories</option>
                        {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>

                    <button
                        className="border bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 flex items-center"
                        onClick={() => setSelectedSection("addProduct")}
                    >
                        <img className="w-4 h-4 mr-3" src={plus} alt="plus icon" />
                        New
                    </button>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Products
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort("sku")}
                            >
                                Product ID
                                {sortBy === "sku" && (
                                    <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                                )}
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort("createdAt")}
                            >
                                Added On
                                {sortBy === "createdAt" && (
                                    <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                                )}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Base Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Discount Price
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort("category")}
                            >
                                Category
                                {sortBy === "category" && (
                                    <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                                )}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Stock
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Variants
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={`https://i.pravatar.cc/40?u=${product._id}`}
                                                alt="product"
                                                className="w-8 h-8 rounded-full"
                                            />
                                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{product.sku}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{formatedDate(product.createdAt)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            ₹{product.colors[0]?.basePrice?.toLocaleString("en-IN") || 0}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            ₹{product.colors[0]?.discountPrice?.toLocaleString("en-IN") || 0}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{product?.category?.name || "N/A"}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="text-sm text-gray-900">{product.colors[0]?.totalStock || 0}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="text-sm text-gray-900">{product.colors?.length || 0}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            className="text-black px-2 py-1 rounded hover:bg-gray-200 mr-2"
                                            onClick={() => {
                                                setSelectedSection("editProduct");
                                                dispatch(setEditProductID(product._id));
                                            }}
                                        >
                                            <img src={editIcon} alt="edit" className="w-5 h-5" />
                                        </button>
                                        <button
                                            className="text-black px-2 py-1 rounded hover:bg-gray-200"
                                            onClick={() => handleOpenDeleteModal(product._id)}
                                        >
                                            <img src={deleteIcon} alt="delete" className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500">
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row sm:justify-between items-center mt-4 gap-2">
                <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{" "}
                    <span className="font-medium">
                        {Math.min(currentPage * pageSize, totalProducts)}
                    </span>{" "}
                    of <span className="font-medium">{totalProducts}</span> results
                </div>
                <div className="flex items-center space-x-2">
                    <select
                        value={pageSize}
                        onChange={handlePageSizeChange}
                        className="border rounded p-1 text-sm"
                    >
                        <option value={10}>10 per page</option>
                        <option value={20}>20 per page</option>
                        <option value={50}>50 per page</option>
                    </select>

                    <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded disabled:opacity-50"
                    >
                        &lt;
                    </button>

                    {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                        // Logic for displaying page numbers around current page
                        let pageNumber;
                        if (totalPages <= 5) {
                            pageNumber = idx + 1;
                        } else if (currentPage <= 3) {
                            pageNumber = idx + 1;
                        } else if (currentPage >= totalPages - 2) {
                            pageNumber = totalPages - 4 + idx;
                        } else {
                            pageNumber = currentPage - 2 + idx;
                        }

                        if (pageNumber <= totalPages) {
                            return (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentPage(pageNumber)}
                                    className={`px-3 py-1 rounded ${currentPage === pageNumber ? "bg-black text-white" : "bg-gray-100"
                                        }`}
                                >
                                    {pageNumber}
                                </button>
                            );
                        }
                        return null;
                    })}

                    <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded disabled:opacity-50"
                    >
                        &gt;
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModal.open && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-80 md:w-96 shadow-2xl">
                        <h2 className="text-xl font-bold mb-4 text-center">Confirm Deletion</h2>
                        <p className="mb-6 text-center">
                            Are you sure you want to delete this product?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                                onClick={handleCloseDeleteModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                                onClick={() => confirmDelete(deleteModal.productId)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
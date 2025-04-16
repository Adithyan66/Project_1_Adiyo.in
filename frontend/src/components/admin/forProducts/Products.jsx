


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { useDispatch } from "react-redux";
import axios from "axios";

import filterIcon from "../../../assets/images/filterIcon.png";
import editIcon from "../../../assets/images/edit.png";
import deleteIcon from "../../../assets/images/delete.png";
import { setEditProductID } from '../../../store/slices/sellerSideSelectedSlice';
import { getCategoryList } from "../../../services/categoryService";
import { adminDeleteProduct, getProducts } from "../../../services/productService";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const Products = () => {
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
            const response = await getCategoryList()
            //axios.get(`${API_BASE_URL}/admin/categories`);
            setCategories(response.data.categories || []);


        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };
    useEffect(() => {
        console.log(categories);
    }, [categories])

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

            // const response = await axios.get(`${API_BASE_URL}/admin/products?${params}`);

            const response = await getProducts(params)

            setProducts(response.data.products);
            setTotalProducts(response.data.totalProducts || response.data.products.length);
            setError(null);
        } catch (error) {
            console.error("Error fetching product data:", error);
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

    const handleOpenDeleteModal = (id) => {
        setDeleteModal({ open: true, productId: id });
    };

    const handleCloseDeleteModal = () => {
        setDeleteModal({ open: false, productId: null });
    };

    const confirmDelete = async (id) => {
        try {
            // await axios.delete(`${API_BASE_URL}/admin/delete-product/${id}`);
            await adminDeleteProduct(id)

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
                                                navigate(`/admin/edit-product/${product._id}`);
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
                <div className="fixed inset-0 flex items-center justify-center z-50  bg-opacity-50">
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
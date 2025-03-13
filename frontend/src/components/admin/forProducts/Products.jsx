


import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router";


import filterIcon from "../../../assets/images/filterIcon.png";
import editicon from "../../../assets/images/edit.png";
import deleteicon from "../../../assets/images/delete.png";
import axios from "axios";


const API_BASE_URL = import.meta.env.VITE_API_URL;


import { setEditProductID } from '../../../store/slices/sellerSideSelectedSlice';
import { useDispatch } from "react-redux";



const Products = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();


    const [initialProductsData, setInitialProductsData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);


    const [deleteModal, setDeleteModal] = useState({
        open: false,
        productId: null,
    });

    // console.log("profilterIconducts", initialProductsData);


    const filteredProducts = initialProductsData.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalItems = filteredProducts.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const indexOfLastItem = currentPage * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    const getPageNumbers = () => {
        let startPage, endPage;
        if (totalPages <= 5) {
            startPage = 1;
            endPage = totalPages;
        } else {
            if (currentPage <= 3) {
                startPage = 1;
                endPage = 5;
            } else if (currentPage + 2 >= totalPages) {
                startPage = totalPages - 4;
                endPage = totalPages;
            } else {
                startPage = currentPage - 2;
                endPage = currentPage + 2;
            }
        }
        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
    };

    const goToPage = (page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        fetchProducts();
    }, []);


    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/products`);
            setInitialProductsData(response.data.products);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };


    function formatedDate(dateString) {
        const dateObj = new Date(dateString);
        return dateObj.toLocaleDateString("en-GB");
    }


    const handleOpenDeleteModal = (id) => {
        setDeleteModal({ open: true, productId: id });
    };


    const handleCloseDeleteModal = () => {
        setDeleteModal({ open: false, productId: null });
    };

    const confirmDelete = async (id) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/admin/delete-product/${id}`);

            console.log(response.data);

            fetchProducts()

        } catch (error) {

            console.error("Error deleting product:", error);
        } finally {

            handleCloseDeleteModal();
        }
    };

    if (initialProductsData.length < 1) {
        return (
            <div>

                <h1>loading.....</h1>
            </div>
        );
    }

    return (
        <div className="w-full min-h-[800px] p-10">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                <h2 className="text-2xl font-bold mb-2 sm:mb-0">Products Management</h2>
                <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="pl-8 pr-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-black"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <FiSearch className="absolute left-2 top-2 text-gray-400" />
                    </div>
                    <button className=" flex border border-gray-300 px-4 py-2 rounded hover:bg-gray-100">
                        <img src={filterIcon} className="mr-3" alt="" />
                        Filters
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-black text-white">
                            <th className="py-3 px-4">Products</th>
                            <th className="py-3 px-4">Product ID</th>
                            <th className="py-3 px-4">Added on</th>
                            <th className="py-3 px-4">Base Price</th>
                            <th className="py-3 px-4">Discount Price</th>
                            <th className="py-3 px-4">Category</th>
                            <th className="py-3 px-4">Stock</th>
                            <th className="py-3 px-4">Varients</th>
                            <th className="py-3 px-4"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {currentProducts.length > 0 ? (
                            currentProducts.map((product) => (
                                <tr key={product._id} className="border-4 border-white bg-gray-200 hover:bg-gray-300">
                                    <td className="py-3 px-4 flex items-center space-x-2">
                                        <img
                                            src={`https://i.pravatar.cc/40?u=${product.id}`}
                                            alt="product"
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <span>{product.name}</span>
                                    </td>
                                    <td className="py-3 px-4 ">{product.sku}</td>
                                    <td className="py-3 px-4 ">{formatedDate(product.createdAt)}</td>
                                    <td className="py-3 px-4 text-center">₹ {product.colors[0].basePrice.toLocaleString()}</td>
                                    <td className="py-3 px-4 text-center">₹ {product.colors[0].discountPrice.toLocaleString()}</td>
                                    <td className="py-3 px-4 text-center">{product?.category?.name}</td>
                                    <td className="py-3 px-4 text-center">{product.colors[0].totalStock}</td>
                                    <td className="py-3 px-4 text-center">{product.colors.length}</td>
                                    <td className="py-3 px-4">
                                        <button
                                            className="text-black px-3 py-1 rounded hover:bg-gray-200"
                                            onClick={() => {
                                                navigate(`/admin/edit-product/${product._id}`)
                                                dispatch(setEditProductID(product._id));
                                            }}
                                        >
                                            <img src={editicon} alt="edit" />
                                        </button>
                                        <button
                                            className="text-black px-3 py-1 rounded hover:bg-gray-200"
                                            onClick={() => handleOpenDeleteModal(product._id)}
                                        >
                                            <img src={deleteicon} alt="delete" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="py-4 text-center">
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination & Page Size */}
            <div className="flex flex-col sm:flex-row sm:justify-between items-center mt-4 gap-2">
                <div className="text-sm">
                    <label htmlFor="pageSizeSelect" className="mr-2">
                        Show results:
                    </label>
                    <select
                        id="pageSizeSelect"
                        value={pageSize}
                        onChange={handlePageSizeChange}
                        className="border rounded p-1"
                    >
                        <option value={2}>2</option>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                    </select>
                </div>
                <div className="flex items-center space-x-1">
                    {/* Previous button */}
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded disabled:opacity-50"
                    >
                        &lt;
                    </button>
                    {/* Page numbers */}
                    {getPageNumbers().map((pageNum) => (
                        <button
                            key={pageNum}
                            onClick={() => goToPage(pageNum)}
                            className={`px-3 py-1 rounded-full ${currentPage === pageNum ? "bg-gray-900 text-white" : ""
                                }`}
                        >
                            {pageNum}
                        </button>
                    ))}
                    {/* Next button */}
                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="px-3 py-1 rounded disabled:opacity-50"
                    >
                        &gt;
                    </button>
                </div>
            </div>

            {deleteModal.open && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white rounded p-6 w-100 shadow-2xl border-4 border-black">
                        <h2 className="text-xl font-bold mb-4 text-center">Confirm Deletion</h2>
                        <p className="mb-6 text-center">
                            Are you sure you want to delete this product?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                className="bg-gray-300 text-black px-4 py-2 rounded"
                                onClick={handleCloseDeleteModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-black text-white px-4 py-2 rounded"
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

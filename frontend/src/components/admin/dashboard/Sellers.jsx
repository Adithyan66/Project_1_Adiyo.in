import React, { useState } from "react";
import { FiSearch } from "react-icons/fi"; // Optional: using react-icons for search icon

const initialSellersData = [
    { id: 1, name: "Joyal Kuriakose", sellerID: "110564", products: 73, sales: 7306, status: "Active" },
    { id: 2, name: "Achu K Mohanan", sellerID: "110564", products: 289, sales: 7306, status: "Blocked" },
    { id: 3, name: "Abhinav K", sellerID: "110564", products: 23, sales: 7306, status: "Active" },
    { id: 4, name: "Abu K M", sellerID: "110564", products: 56, sales: 7306, status: "Blocked" },
    { id: 5, name: "John Doe", sellerID: "110564", products: 189, sales: 7306, status: "Active" },
    { id: 6, name: "Jane Doe", sellerID: "110564", products: 45, sales: 7306, status: "Active" },
    { id: 7, name: "Alice", sellerID: "110564", products: 312, sales: 7306, status: "Blocked" },
    { id: 8, name: "Bob", sellerID: "110564", products: 78, sales: 7306, status: "Active" },
    { id: 9, name: "Charlie", sellerID: "110564", products: 59, sales: 7306, status: "Active" },
    { id: 10, name: "David", sellerID: "110564", products: 99, sales: 7306, status: "Blocked" },
    // ... (additional data can be added to create more pages)
    { id: 11, name: "Joyal Kuriakose", sellerID: "110564", products: 73, sales: 7306, status: "Active" },
    { id: 12, name: "Achu K Mohanan", sellerID: "110564", products: 289, sales: 7306, status: "Blocked" },
    { id: 13, name: "Abhinav K", sellerID: "110564", products: 23, sales: 7306, status: "Active" },
    { id: 14, name: "Abu K M", sellerID: "110564", products: 56, sales: 7306, status: "Blocked" },
    { id: 15, name: "John Doe", sellerID: "110564", products: 189, sales: 7306, status: "Active" },
];

const Sellers = () => {
    // State for sellers, search query, pagination, and page size
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Filter sellers based on search query
    const filteredSellers = initialSellersData.filter((seller) =>
        seller.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate pagination values
    const totalItems = filteredSellers.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const indexOfLastItem = currentPage * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    const currentSellers = filteredSellers.slice(indexOfFirstItem, indexOfLastItem);

    // Helper function to get a dynamic range of page numbers
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

    // Handlers
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page on new search
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1); // Reset to first page when page size changes
    };

    const goToPage = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="w-full">
            {/* Top bar: Title, Search, Requests, Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                <h2 className="text-2xl font-bold mb-2 sm:mb-0">Sellers</h2>
                <div className="flex flex-wrap items-center gap-2">
                    {/* Search box */}
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
                    <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                        Requests
                    </button>
                    <button className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100">
                        Filters
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-black text-white">
                            <th className="py-3 px-4">Name</th>
                            <th className="py-3 px-4">Seller ID</th>
                            <th className="py-3 px-4">Products</th>
                            <th className="py-3 px-4">Sales</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {currentSellers.length > 0 ? (
                            currentSellers.map((seller) => (
                                <tr key={seller.id} className="border-b hover:bg-gray-50">
                                    {/* Name + avatar */}
                                    <td className="py-3 px-4 flex items-center space-x-2">
                                        <img
                                            src={`https://i.pravatar.cc/40?u=${seller.id}`}
                                            alt="avatar"
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <span>{seller.name}</span>
                                    </td>
                                    <td className="py-3 px-4">{seller.sellerID}</td>
                                    <td className="py-3 px-4">{seller.products}</td>
                                    <td className="py-3 px-4">₹ {seller.sales.toLocaleString()}</td>
                                    <td className="py-3 px-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${seller.status === "Active"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {seller.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <button className="bg-gray-200 text-black px-3 py-1 rounded hover:bg-gray-300">
                                            More
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="py-4 text-center">
                                    No sellers found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination & Page Size */}
            <div className="flex flex-col sm:flex-row sm:justify-between items-center mt-4 gap-2">
                {/* Show results dropdown */}
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

                {/* Pagination controls */}
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
                            className={`px-3 py-1 rounded-xl ${currentPage === pageNum ? "bg-black text-white" : ""
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
        </div>
    );
};

export default Sellers;

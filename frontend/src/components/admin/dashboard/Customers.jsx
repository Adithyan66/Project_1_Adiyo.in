

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi"; // Optional: using react-icons for search icon

const API_BASE_URL = import.meta.env.VITE_API_URL;

const Customers = () => {
    // State for customers, search query, pagination, and page size
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [customers, setCustomers] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/admin/customers-list`);
                console.log("Customer data:", response.data);
                setCustomers(response.data.customers);
            } catch (error) {
                console.error("Error fetching customer data:", error);
            }
        };

        fetchCustomerData();
    }, []);

    useEffect(() => {
        if (customers.length > 0) {
            console.log(customers[0]._id);
        }
    }, [customers]);

    // Filter customers based on search query
    const filteredCustomers = customers.filter((customer) =>
        customer.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate pagination values
    const totalItems = filteredCustomers.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const indexOfLastItem = currentPage * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    const currentCustomers = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);

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

    function formatedDate(dateString) {
        const dateObj = new Date(dateString);
        return dateObj.toLocaleDateString("en-GB");
    }

    return (
        <div className="w-full p-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                <h2 className="text-2xl font-bold mb-2 sm:mb-0">Customers</h2>
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

                    <button className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100">
                        Filters
                    </button>
                </div>
            </div>

            <div className="min-h-[700px] justify-center items-center">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-black text-white">
                            <th className="py-3 px-4 text-center">Name</th>
                            <th className="py-3 px-4 text-center">Customer ID</th>
                            <th className="py-3 px-4 text-center">Registration Date</th>
                            <th className="py-3 px-4 text-center">Total Orders</th>
                            <th className="py-3 px-4 text-center">Total Amount Spent</th>
                            <th className="py-3 px-4 text-center">Status</th>
                            <th className="py-3 px-4"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-100 ">
                        {currentCustomers.length > 0 ? (
                            currentCustomers.map((customer) => (
                                <tr key={customer._id} className="border-4 border-white hover:bg-gray-200">
                                    <td className="py-3 px-4 flex items-center space-x-2">
                                        <img
                                            src={`https://i.pravatar.cc/40?u=${customer._id}`}
                                            alt="avatar"
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <span>{customer.username}</span>
                                    </td>
                                    <td className="py-3 px-4">{customer.userId}</td>
                                    <td className="py-3 px-4 text-center">{formatedDate(customer.registrationDate)}</td>
                                    <td className="py-3 px-4 text-center">{customer.products}</td>
                                    <td className="py-3 px-4 text-center">
                                        ₹ {customer.sales ? customer.sales.toLocaleString() : 0}
                                    </td>
                                    <td className="py-3 px-4 ">
                                        <span
                                            className={`flex items-center justify-center w-24 h-7 rounded-full text-sm font-medium text-center border ${customer.isActive
                                                ? "bg-green-50 text-green-700 border-green-900"
                                                : "bg-red-50 text-red-700 border-red-700"
                                                }`}
                                        >
                                            {customer.isActive ? "Active" : "Blocked"}
                                        </span>

                                    </td>
                                    <td className="py-3 px-4">
                                        <button
                                            className="bg-black  text-white px-3 py-1 rounded hover:bg-gray-800 hover:cursor-pointer"
                                            onClick={() => navigate(`/admin/${customer._id}/customer-details/`)}
                                        >
                                            More
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="py-4 text-center">
                                    No customers found.
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

export default Customers;

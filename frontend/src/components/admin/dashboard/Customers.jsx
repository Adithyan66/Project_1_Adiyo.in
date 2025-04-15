

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import filterIcon from "../../../assets/images/filterIcon.png";
import { getCustomersList } from "../../../services/adminCustomerServiced";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const Customers = () => {


    // State for customers data
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCustomers, setTotalCustomers] = useState(0);

    // Filtering and sorting state
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("registrationDate");
    const [sortOrder, setSortOrder] = useState("desc");
    const [statusFilter, setStatusFilter] = useState("all");

    const navigate = useNavigate();

    useEffect(() => {
        fetchCustomers();
    }, [currentPage, pageSize, searchTerm, sortBy, sortOrder, statusFilter]);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            // Build query parameters
            const params = new URLSearchParams({
                page: currentPage,
                limit: pageSize,
                sortBy,
                sortOrder,
                ...(searchTerm && { search: searchTerm }),
                ...(statusFilter !== "all" && { status: statusFilter === "active" })
            });

            // const response = await axios.get(`${API_BASE_URL}/admin/customers-list?${params}`);
            const response = await getCustomersList(params)

            setCustomers(response.data.customers);
            setTotalCustomers(response.data.totalCustomers || response.data.customers.length);
            setError(null);

        } catch (error) {

            console.error("Error fetching customer data:", error);
            setError("Failed to fetch customers. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        // Search is triggered by the useEffect based on searchTerm state
    };

    const clearSearch = () => {
        setSearchTerm("");
        setCurrentPage(1);
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            // Toggle sort order if same field is clicked
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("desc"); // Default to descending when changing fields
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

    if (loading && customers.length === 0) {
        return (
            <div className="w-full min-h-[800px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
            </div>
        );
    }

    if (error && customers.length === 0) {
        return (
            <div className="w-full min-h-[800px] flex items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    const totalPages = Math.ceil(totalCustomers / pageSize);

    return (
        <div className="p-4 md:p-6 bg-gray-50 w-full min-h-[800px]">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                <h1 className="text-2xl font-bold mb-4 md:mb-0">Customers</h1>

                {/* Search and filters */}
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
                    <form onSubmit={handleSearch} className="flex">
                        <input
                            type="text"
                            placeholder="Search by Name, ID..."
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
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="blocked">Blocked</option>
                    </select>
                </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Name
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort("userId")}
                            >
                                Customer ID
                                {sortBy === "userId" && (
                                    <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                                )}
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort("registrationDate")}
                            >
                                Registration Date
                                {sortBy === "registrationDate" && (
                                    <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                                )}
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort("products")}
                            >
                                Total Orders
                                {sortBy === "products" && (
                                    <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                                )}
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort("sales")}
                            >
                                Total Amount Spent
                                {sortBy === "sales" && (
                                    <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                                )}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {customers.length > 0 ? (
                            customers.map((customer) => (
                                <tr key={customer._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={`https://i.pravatar.cc/40?u=${customer._id}`}
                                                alt="avatar"
                                                className="w-8 h-8 rounded-full"
                                            />
                                            <div className="text-sm font-medium text-gray-900">{customer.username}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{customer.userId}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{formatedDate(customer.registrationDate)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="text-sm text-gray-900">{customer.products}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="text-sm text-gray-900">
                                            ₹{customer.sales ? customer.sales.toLocaleString("en-IN") : 0}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${customer.isActive
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {customer.isActive ? "Active" : "Blocked"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
                                            onClick={() => navigate(`/admin/${customer._id}/customer-details/`)}
                                        >
                                            More
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                                    No customers found.
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
                        {Math.min(currentPage * pageSize, totalCustomers)}
                    </span>{" "}
                    of <span className="font-medium">{totalCustomers}</span> results
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
        </div>
    );
};

export default Customers;
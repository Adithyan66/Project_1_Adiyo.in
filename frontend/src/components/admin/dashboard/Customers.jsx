import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";

const initialCustomersData = [
    // First group (IDs 1-10)
    { id: 1, name: "Joyal Kuriakose", customerID: "110564", products: 73, sales: 7306, status: "Active", registrationDate: "2023-01-01" },
    { id: 2, name: "Achu K Mohanan", customerID: "110564", products: 289, sales: 7306, status: "Blocked", registrationDate: "2023-01-02" },
    { id: 3, name: "Abhinav K", customerID: "110564", products: 23, sales: 7306, status: "Active", registrationDate: "2023-01-03" },
    { id: 4, name: "Abu K M", customerID: "110564", products: 56, sales: 7306, status: "Blocked", registrationDate: "2023-01-04" },
    { id: 5, name: "John Doe", customerID: "110564", products: 189, sales: 7306, status: "Active", registrationDate: "2023-01-05" },
    { id: 6, name: "Jane Doe", customerID: "110564", products: 45, sales: 7306, status: "Active", registrationDate: "2023-01-06" },
    { id: 7, name: "Alice", customerID: "110564", products: 312, sales: 7306, status: "Blocked", registrationDate: "2023-01-07" },
    { id: 8, name: "Bob", customerID: "110564", products: 78, sales: 7306, status: "Active", registrationDate: "2023-01-08" },
    { id: 9, name: "Charlie", customerID: "110564", products: 59, sales: 7306, status: "Active", registrationDate: "2023-01-09" },
    { id: 10, name: "David", customerID: "110564", products: 99, sales: 7306, status: "Blocked", registrationDate: "2023-01-10" },
    // Second group (IDs 11-20)
    { id: 11, name: "Joyal Kuriakose", customerID: "110565", products: 73, sales: 7306, status: "Active", registrationDate: "2023-01-11" },
    { id: 12, name: "Achu K Mohanan", customerID: "110565", products: 289, sales: 7306, status: "Blocked", registrationDate: "2023-01-12" },
    { id: 13, name: "Abhinav K", customerID: "110565", products: 23, sales: 7306, status: "Active", registrationDate: "2023-01-13" },
    { id: 14, name: "Abu K M", customerID: "110565", products: 56, sales: 7306, status: "Blocked", registrationDate: "2023-01-14" },
    { id: 15, name: "John Doe", customerID: "110565", products: 189, sales: 7306, status: "Active", registrationDate: "2023-01-15" },
    { id: 16, name: "Jane Doe", customerID: "110565", products: 45, sales: 7306, status: "Active", registrationDate: "2023-01-16" },
    { id: 17, name: "Alice", customerID: "110565", products: 312, sales: 7306, status: "Blocked", registrationDate: "2023-01-17" },
    { id: 18, name: "Bob", customerID: "110565", products: 78, sales: 7306, status: "Active", registrationDate: "2023-01-18" },
    { id: 19, name: "Charlie", customerID: "110565", products: 59, sales: 7306, status: "Active", registrationDate: "2023-01-19" },
    { id: 20, name: "David", customerID: "110565", products: 99, sales: 7306, status: "Blocked", registrationDate: "2023-01-20" },
    // Third group (repeat for multiple pages)
    { id: 21, name: "Joyal Kuriakose", customerID: "110565", products: 73, sales: 7306, status: "Active", registrationDate: "2023-01-21" },
    { id: 22, name: "Achu K Mohanan", customerID: "110565", products: 289, sales: 7306, status: "Blocked", registrationDate: "2023-01-22" },
    { id: 23, name: "Abhinav K", customerID: "110565", products: 23, sales: 7306, status: "Active", registrationDate: "2023-01-23" },
    { id: 24, name: "Abu K M", customerID: "110565", products: 56, sales: 7306, status: "Blocked", registrationDate: "2023-01-24" },
    { id: 25, name: "John Doe", customerID: "110565", products: 189, sales: 7306, status: "Active", registrationDate: "2023-01-25" },
    { id: 26, name: "Jane Doe", customerID: "110565", products: 45, sales: 7306, status: "Active", registrationDate: "2023-01-26" },
    { id: 27, name: "Alice", customerID: "110565", products: 312, sales: 7306, status: "Blocked", registrationDate: "2023-01-27" },
    { id: 28, name: "Bob", customerID: "110565", products: 78, sales: 7306, status: "Active", registrationDate: "2023-01-28" },
    { id: 29, name: "Charlie", customerID: "110565", products: 59, sales: 7306, status: "Active", registrationDate: "2023-01-29" },
    { id: 30, name: "David", customerID: "110565", products: 99, sales: 7306, status: "Blocked", registrationDate: "2023-01-30" },
    // (You can add more objects similarly to simulate additional pages)
];

const Customers = ({ setSelectedSection }) => {



    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Filter customers based on search query
    const filteredCustomers = initialCustomersData.filter((customer) =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase())
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
        setCurrentPage(1);
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
    };

    const goToPage = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="w-full">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                <h2 className="text-2xl font-bold mb-2 sm:mb-0">Customers</h2>
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

                    <button
                        className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100">
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
                            <th className="py-3 px-4">Customer ID</th>
                            <th className="py-3 px-4">Registration Date</th>

                            <th className="py-3 px-4">Total Orders Placed</th>
                            <th className="py-3 px-4">Total Amount Spent</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {currentCustomers.length > 0 ? (
                            currentCustomers.map((customer) => (
                                <tr key={customer.id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4 flex items-center space-x-2">
                                        <img
                                            src={`https://i.pravatar.cc/40?u=${customer.id}`}
                                            alt="avatar"
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <span>{customer.name}</span>
                                    </td>
                                    <td className="py-3 px-4">{customer.customerID}</td>
                                    <td className="py-3 px-4">{customer.registrationDate}</td>

                                    <td className="py-3 px-4">{customer.products}</td>
                                    <td className="py-3 px-4">₹ {customer.sales.toLocaleString()}</td>
                                    <td className="py-3 px-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${customer.status === "Active"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {customer.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <button className="bg-gray-200 text-black px-3 py-1 rounded hover:bg-gray-300"
                                            onClick={() => setSelectedSection("CustomerDetails")}
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
                            className={`px-3 py-1 rounded ${currentPage === pageNum ? "bg-black text-white" : ""
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



import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import debounce from 'lodash.debounce';

import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const SalesReport = () => {
    const navigate = useNavigate();

    // Local state for input value
    const [inputValue, setInputValue] = useState('');
    // Actual search term used for filtering (updated after debounce)
    const [searchTerm, setSearchTerm] = useState('');

    // Other filter and pagination states
    const [dateRange, setDateRange] = useState('all');
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');

    // API response states
    const [reportData, setReportData] = useState({
        summary: { totalSales: 0, overallDiscount: 0, totalOrders: 0 },
        data: [],
        pagination: { totalItems: 0, totalPages: 0, currentPage: 1, pageSize: 10 }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Debounce the search update so state changes less frequently.
    const debouncedUpdateSearch = useMemo(
        () =>
            debounce((value) => {
                setSearchTerm(value);
                setCurrentPage(1);
            }, 2000),
        []
    );

    // Handle input change: update local state immediately and debounce search update.
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        debouncedUpdateSearch(e.target.value);
    };

    // Fetch report data from API
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const params = {
                    searchTerm,
                    dateRange,
                    customStartDate,
                    customEndDate,
                    page: currentPage,
                    pageSize,
                    sortBy,
                    sortOrder
                };
                const response = await axios.get(`${API_BASE_URL}/admin/sales-report`, { params });
                setReportData(response.data);
            } catch (err) {
                console.error('Error fetching sales report:', err);
                setError('Failed to load sales report.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchTerm, dateRange, customStartDate, customEndDate, currentPage, pageSize, sortBy, sortOrder]);

    // Sorting handler
    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const downloadExcel = async (params) => {
        try {
            // Fetch full dataset without pagination
            const fullParams = { ...params, page: 1, pageSize: 10000 };
            const response = await axios.get(`${API_BASE_URL}/admin/sales-report`, { params: fullParams });

            const salesData = response.data.data.map(sale => ({
                'Order ID': sale.orderId,
                'Date': new Date(sale.date).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                }),
                'Total Amount': `₹${sale.totalAmount}`,
                'Discounts': `₹${sale.discount}`,
                'Coupon Deduction': `₹${sale.couponCode || 0}`,
                'Status': sale.orderStatus
            }));

            const summary = response.data.summary;
            const summaryData = [
                { 'Metric': 'Total Sales', 'Value': `₹${summary.totalSales.toLocaleString('en-IN')}` },
                { 'Metric': 'Total Orders', 'Value': summary.totalOrders },
                { 'Metric': 'Overall Discounts', 'Value': `₹${summary.overallDiscount.toLocaleString('en-IN')}` }
            ];

            const workbook = XLSX.utils.book_new();
            const salesWorksheet = XLSX.utils.json_to_sheet(salesData);
            const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);

            XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Summary');
            XLSX.utils.book_append_sheet(workbook, salesWorksheet, 'Sales Details');

            const filename = `sales_report_${new Date().toISOString().split('T')[0]}.xlsx`;
            XLSX.writeFile(workbook, filename);
        } catch (error) {
            console.error('Error downloading Excel:', error);
            alert('Failed to download report');
        }
    };

    const downloadPDF = async (params) => {
        try {
            // Fetch full dataset without pagination
            const fullParams = { ...params, page: 1, pageSize: 10000 };
            const response = await axios.get(`${API_BASE_URL}/admin/sales-report`, { params: fullParams });

            const doc = new jsPDF('landscape');

            // Add report title
            doc.setFontSize(18);
            doc.text('Sales Report', 14, 22);

            // Add summary section
            const summary = response.data.summary;
            doc.setFontSize(10);
            doc.text(`Total Sales: ₹${summary.totalSales.toLocaleString('en-IN')}`, 14, 30);
            doc.text(`Total Orders: ${summary.totalOrders}`, 14, 36);
            doc.text(`Overall Discounts: ₹${summary.overallDiscount.toLocaleString('en-IN')}`, 14, 42);

            // Prepare sales data for table
            const tableColumn = ['Order ID', 'Date', 'Total Amount', 'Discounts', 'Coupon Deduction', 'Status'];
            const tableRows = response.data.data.map(sale => [
                sale.orderId,
                new Date(sale.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                }),
                `₹${sale.totalAmount}`,
                `₹${sale.discount}`,
                `₹${sale.couponCode || 0}`,
                sale.orderStatus
            ]);

            // Use autoTable to create the table
            autoTable(doc, {
                startY: 50,
                head: [tableColumn],
                body: tableRows,
                theme: 'striped',
                styles: { fontSize: 8 },
                headStyles: { fillColor: [22, 22, 22], textColor: 255 }
            });

            doc.text('Adiyo.in', 14, 202);
            const filename = `sales_report_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(filename);
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert('Failed to download report');
        }
    };

    // Status badge class
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="p-4 md:p-6 bg-gray-50 w-full min-h-[800px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
            </div>
        );
    }


    if (error) {
        return (
            <div className="p-4 md:p-6 bg-gray-50 w-full min-h-[800px] flex items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    const { summary, data: salesRecords, pagination } = reportData;
    const { totalItems, totalPages } = pagination;

    return (
        <div className="p-4 md:p-6 bg-gray-50 w-full min-h-[800px]">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                <h1 className="text-2xl font-bold mb-4 md:mb-0">Sales Report</h1>



                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
                    {/* Search Input */}
                    <div className="flex">
                        <input
                            type="text"
                            placeholder="Search by Order ID, Amount..."
                            value={inputValue}
                            onChange={handleInputChange}
                            className="px-3 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-black"
                        />
                        {inputValue && (
                            <button
                                type="button"
                                onClick={() => {
                                    setInputValue('');
                                    setSearchTerm('');
                                    setCurrentPage(1);
                                }}
                                className="bg-gray-200 px-4 py-2 rounded-r hover:bg-gray-300"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Date Range Filter */}
                    <select
                        value={dateRange}
                        onChange={(e) => {
                            setDateRange(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                    >
                        <option value="all">All Dates</option>
                        <option value="today">1 Day</option>
                        <option value="last7days">1 Week</option>
                        <option value="thisMonth">1 Month</option>
                        <option value="custom">Custom Date Range</option>
                    </select>
                </div>


            </div>

            {/* Custom Date Range Inputs */}
            {dateRange === 'custom' && (
                <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                    <div>
                        <label className="block text-sm text-gray-700">Start Date</label>
                        <input
                            type="date"
                            value={customStartDate}
                            onChange={(e) => {
                                setCustomStartDate(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="mt-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700">End Date</label>
                        <input
                            type="date"
                            value={customEndDate}
                            onChange={(e) => {
                                setCustomEndDate(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="mt-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                        />
                    </div>
                </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded shadow p-4">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Total Sales</h3>
                    <p className="text-2xl font-bold">₹{summary.totalSales.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-white rounded shadow p-4">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Total Orders</h3>
                    <p className="text-2xl font-bold">{summary.totalOrders}</p>
                </div>
                <div className="bg-white rounded shadow p-4">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Overall Discounts</h3>
                    <p className="text-2xl font-bold">₹{summary.overallDiscount.toLocaleString('en-IN')}</p>
                </div>
            </div>

            {/* Sales Table */}
            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('orderId')}
                            >
                                Order ID
                                {sortBy === 'orderId' && <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('date')}
                            >
                                Date
                                {sortBy === 'date' && <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('totalAmount')}
                            >
                                Total Amount
                                {sortBy === 'totalAmount' && <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('discounts')}
                            >
                                Discounts
                                {sortBy === 'discounts' && <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('couponsDeduction')}
                            >
                                Coupons Deduction
                                {sortBy === 'couponsDeduction' && <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('status')}
                            >
                                Status
                                {sortBy === 'status' && <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {salesRecords && salesRecords.length > 0 ? (
                            salesRecords.map(sale => (
                                <tr key={sale._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{sale.orderId}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{formatDate(sale.date)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">₹{sale.totalAmount}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">₹{sale.discount}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{(sale.couponCode ? sale.couponCode : "No Coupon")}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(sale.status)}`}>
                                            {sale.orderStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            className="text-indigo-600 hover:text-indigo-900"
                                            onClick={() => navigate(`/admin/sales-details/${sale._id}`)}
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                                    No sales records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row sm:justify-between items-center mt-4 gap-2">
                <div className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                    <span className="font-medium">
                        {Math.min(currentPage * pageSize, totalItems)}
                    </span>{' '}
                    of <span className="font-medium">{totalItems}</span> results
                </div>
                <div className="flex items-center space-x-2">
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setCurrentPage(1);
                        }}
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

                    {[...Array(totalPages)].map((_, idx) => {
                        const pageNumber = idx + 1;
                        if (
                            (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2) ||
                            totalPages <= 5
                        ) {
                            return (
                                <button
                                    key={pageNumber}
                                    onClick={() => setCurrentPage(pageNumber)}
                                    className={`px-3 py-1 rounded ${currentPage === pageNumber ? 'bg-black text-white' : 'bg-gray-100'
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

            {/* Download buttons */}

            {reportData.data.length > 0 && (<>

                <div className="flex space-x-2">
                    <button
                        onClick={() => downloadExcel({
                            searchTerm,
                            dateRange,
                            customStartDate,
                            customEndDate,
                            sortBy,
                            sortOrder
                        })}
                        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-9.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Excel
                    </button>
                    <button
                        onClick={() => downloadPDF({
                            searchTerm,
                            dateRange,
                            customStartDate,
                            customEndDate,
                            sortBy,
                            sortOrder
                        })}
                        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-9.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        PDF
                    </button>
                </div>

            </>)}




        </div>
    );
};

export default SalesReport;
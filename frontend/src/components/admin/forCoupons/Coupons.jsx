

import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router";
import axios from "axios";

import filterIcon from "../../../assets/images/filterIcon.png";
import editicon from "../../../assets/images/edit.png";
import deleteicon from "../../../assets/images/delete.png";
import { Coupen } from "../../../icons/icons";

import { setEditProductID } from "../../../store/slices/sellerSideSelectedSlice";
import { useDispatch } from "react-redux";

import AddCouponModal from "./AddCouponModal";
import EditCouponModal from "./EditCouponModal";
import { deleteCoupon, getCouponList } from "../../../services/couponService";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const Coupons = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [initialCouponData, setInitialCouponData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [deleteModal, setDeleteModal] = useState({
        open: false,
        couponId: null,
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);

    const handleOpenEditModal = (coupon) => {
        setEditingCoupon(coupon);
        setEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setEditModalOpen(false);
        setEditingCoupon(null);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const filteredCoupons = (initialCouponData || []).filter((coupon) =>
        coupon.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalItems = filteredCoupons.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const indexOfLastItem = currentPage * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    const currentCoupons = filteredCoupons.slice(indexOfFirstItem, indexOfLastItem);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // Search is already handled by the filter function
    };

    const clearSearch = () => {
        setSearchQuery("");
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
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        console.log("started");

        try {
            const response = await getCouponList()
            // axios.get(`${API_BASE_URL}/admin/coupons`);
            console.log(response.data);
            setInitialCouponData(response.data.coupons);
        } catch (error) {
            console.error("Error fetching coupons:", error);
        }
    };

    function formattedDate(dateString) {
        const dateObj = new Date(dateString);
        return dateObj.toLocaleDateString("en-GB");
    }

    const handleOpenDeleteModal = (id, e) => {
        e.stopPropagation();
        setDeleteModal({ open: true, couponId: id });
    };

    const handleCloseDeleteModal = () => {
        setDeleteModal({ open: false, couponId: null });
    };

    const confirmDelete = async (id) => {
        try {
            const response = await deleteCoupon(id)
            // axios.delete(`${API_BASE_URL}/admin/delete-coupon/${id}`);
            console.log(response.data);
            fetchCoupons();
        } catch (error) {
            console.error("Error deleting coupon:", error);
        } finally {
            handleCloseDeleteModal();
        }
    };

    if ((initialCouponData || []).length < 1) {
        return (
            <div className="p-4 md:p-6 bg-gray-50 w-full min-h-[800px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 bg-gray-50 w-full min-h-[800px]">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                <h1 className="text-2xl font-bold mb-4 md:mb-0">Coupons Management</h1>

                {/* Search and filters */}
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
                    <form onSubmit={handleSearch} className="flex">
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="px-3 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-black"
                        />
                        <button
                            type="submit"
                            className="bg-black text-white px-4 py-2"
                        >
                            Search
                        </button>
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="bg-gray-200 px-4 py-2 rounded-r hover:bg-gray-300"
                            >
                                Clear
                            </button>
                        )}
                    </form>
                    <button
                        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                        onClick={handleOpenModal}
                    >
                        Add Coupon
                    </button>
                    <button className="flex border border-gray-300 px-4 py-2 rounded hover:bg-gray-100">
                        <img src={filterIcon} className="mr-3" alt="" />
                        Filters
                    </button>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"></th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Coupon Code</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Discount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Active From</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Active To</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Limit</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Used</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Categories</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentCoupons.length > 0 ? (
                            currentCoupons.map((coupon) => (
                                <tr key={coupon._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Coupen />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{coupon.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{coupon.code}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {coupon.discountType === "percentage"
                                                ? `${coupon.discountValue}%`
                                                : `₹ ${coupon.discountValue}`}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{formattedDate(coupon.activeFrom)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{formattedDate(coupon.expiresAt)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="text-sm text-gray-900">{coupon.maxUsage}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="text-sm text-gray-900">{coupon.usedCount}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="text-sm text-gray-900">
                                            {coupon.applicableCategories.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button
                                            className="text-blue-600 hover:text-blue-900"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenEditModal(coupon);
                                            }}
                                        >
                                            <img src={editicon} alt="edit" className="inline mr-1" />
                                            {/* Edit */}
                                        </button>
                                        <button
                                            className="text-red-600 hover:text-red-900 ml-2"
                                            onClick={(e) => handleOpenDeleteModal(coupon._id, e)}
                                        >
                                            <img src={deleteicon} alt="delete" className="inline mr-1" />
                                            {/* Delete */}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10" className="px-6 py-4 text-center text-sm text-gray-500">
                                    No coupons found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row sm:justify-between items-center mt-4 gap-2">
                <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{Math.min(totalItems, 1 + (currentPage - 1) * pageSize)}</span> to{" "}
                    <span className="font-medium">
                        {Math.min(currentPage * pageSize, totalItems)}
                    </span>{" "}
                    of <span className="font-medium">{totalItems}</span> results
                </div>
                <div className="flex items-center space-x-2">
                    <select
                        value={pageSize}
                        onChange={handlePageSizeChange}
                        className="border rounded p-1 text-sm"
                    >
                        <option value={2}>2 per page</option>
                        <option value={5}>5 per page</option>
                        <option value={10}>10 per page</option>
                    </select>

                    <button
                        onClick={() => goToPage(Math.max(1, currentPage - 1))}
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
                                    onClick={() => goToPage(pageNumber)}
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
                        onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
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
                    <div className="bg-white rounded p-6 w-100 shadow-2xl border border-gray-300">
                        <h2 className="text-xl font-bold mb-4 text-center">Confirm Deletion</h2>
                        <p className="mb-6 text-center">
                            Are you sure you want to delete this coupon?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                                onClick={handleCloseDeleteModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                                onClick={() => confirmDelete(deleteModal.couponId)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Coupon Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-opacity-50  z-50">
                    <AddCouponModal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        fetchCoupons={fetchCoupons}
                    />
                </div>
            )}

            {/* Edit Coupon Modal */}
            {isEditModalOpen && editingCoupon && (
                <div className="fixed inset-0  bg-opacity-50 z-50">
                    <EditCouponModal
                        coupon={editingCoupon}
                        handleOpenEditModal={handleOpenEditModal}
                        handleCloseEditModal={handleCloseEditModal}
                        fetchCoupons={fetchCoupons}
                    />
                </div>
            )}
        </div>
    );
};

export default Coupons;




// import React, { useEffect, useState } from "react";
// import { FiSearch, FiFilter, FiPlus, FiEdit2, FiTrash2, FiAlertCircle } from "react-icons/fi";
// import { useNavigate } from "react-router";
// import axios from "axios";
// import { useDispatch } from "react-redux";

// import { setEditProductID } from "../../../store/slices/sellerSideSelectedSlice";
// import { Coupen } from "../../../icons/icons";

// import AddCouponModal from "./AddCouponModal";
// import EditCouponModal from "./EditCouponModal";

// const API_BASE_URL = import.meta.env.VITE_API_URL;

// const Coupons = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     // States
//     const [coupons, setCoupons] = useState([]);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [currentPage, setCurrentPage] = useState(1);
//     const [pageSize, setPageSize] = useState(10);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // Modal states
//     const [deleteModal, setDeleteModal] = useState({
//         open: false,
//         couponId: null,
//         couponName: null
//     });
//     const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [editingCoupon, setEditingCoupon] = useState(null);

//     // Handlers for modals
//     const handleOpenEditModal = (coupon) => {
//         setEditingCoupon(coupon);
//         setIsEditModalOpen(true);
//     };

//     const handleCloseEditModal = () => {
//         setIsEditModalOpen(false);
//         setEditingCoupon(null);
//     };

//     const handleOpenAddModal = () => {
//         setIsAddModalOpen(true);
//     };

//     const handleCloseAddModal = () => {
//         setIsAddModalOpen(false);
//     };

//     // Filter coupons based on search query
//     const filteredCoupons = (coupons || []).filter((coupon) =>
//         coupon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         coupon.code.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     // Pagination calculations
//     const totalItems = filteredCoupons.length;
//     const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
//     const indexOfLastItem = currentPage * pageSize;
//     const indexOfFirstItem = indexOfLastItem - pageSize;
//     const currentCoupons = filteredCoupons.slice(indexOfFirstItem, indexOfLastItem);

//     // Search handlers
//     const handleSearchChange = (e) => {
//         setSearchQuery(e.target.value);
//         setCurrentPage(1);
//     };

//     const handleSearch = (e) => {
//         e.preventDefault();
//         // Search is already handled by the filter function
//     };

//     const clearSearch = () => {
//         setSearchQuery("");
//         setCurrentPage(1);
//     };

//     // Pagination handlers
//     const handlePageSizeChange = (e) => {
//         setPageSize(Number(e.target.value));
//         setCurrentPage(1);
//     };

//     const goToPage = (page) => {
//         setCurrentPage(Math.max(1, Math.min(page, totalPages)));
//     };

//     // Data fetching
//     useEffect(() => {
//         fetchCoupons();
//     }, []);

//     const fetchCoupons = async () => {
//         setIsLoading(true);
//         setError(null);

//         try {
//             const response = await axios.get(`${API_BASE_URL}/admin/coupons`);
//             setCoupons(response.data.coupons || []);
//         } catch (error) {
//             console.error("Error fetching coupons:", error);
//             setError(error.response?.data?.message || "Failed to load coupons. Please try again.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // Format date to DD/MM/YYYY
//     const formattedDate = (dateString) => {
//         try {
//             const dateObj = new Date(dateString);
//             return dateObj.toLocaleDateString("en-GB");
//         } catch (error) {
//             return "Invalid date";
//         }
//     };

//     // Delete modal handlers
//     const handleOpenDeleteModal = (id, name, e) => {
//         e.stopPropagation();
//         setDeleteModal({ open: true, couponId: id, couponName: name });
//     };

//     const handleCloseDeleteModal = () => {
//         setDeleteModal({ open: false, couponId: null, couponName: null });
//     };

//     const confirmDelete = async () => {
//         try {
//             await axios.delete(`${API_BASE_URL}/admin/delete-coupon/${deleteModal.couponId}`);
//             fetchCoupons();
//         } catch (error) {
//             setError(error.response?.data?.message || "Failed to delete coupon. Please try again.");
//         } finally {
//             handleCloseDeleteModal();
//         }
//     };

//     // Render loading state
//     if (isLoading) {
//         return (
//             <div className="p-4 md:p-6 bg-gray-50 w-full min-h-[600px] flex flex-col items-center justify-center">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
//                 <p className="text-gray-600">Loading coupons...</p>
//             </div>
//         );
//     }

//     // Render error state
//     if (error && !coupons.length) {
//         return (
//             <div className="p-4 md:p-6 bg-gray-50 w-full min-h-[600px]">
//                 <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
//                     <div className="flex flex-col items-center text-center">
//                         <FiAlertCircle className="text-red-500 text-5xl mb-4" />
//                         <h2 className="text-2xl font-bold mb-2">Unable to Load Coupons</h2>
//                         <p className="text-gray-600 mb-6">{error}</p>
//                         <button
//                             onClick={fetchCoupons}
//                             className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
//                         >
//                             Try Again
//                         </button>
//                         <button
//                             onClick={handleOpenAddModal}
//                             className="mt-3 border border-black px-6 py-2 rounded hover:bg-gray-100 transition-colors"
//                         >
//                             Add New Coupon
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="p-4 md:p-6 bg-gray-50 w-full min-h-[800px]">
//             {/* Header with breadcrumbs */}
//             <div className="mb-6">
//                 <div className="text-sm breadcrumbs mb-2">
//                     <ul className="flex space-x-2 text-gray-500">
//                         <li>Dashboard</li>
//                         <li className="before:content-['>'] before:mx-2">Coupons</li>
//                     </ul>
//                 </div>
//                 <h1 className="text-2xl font-bold">Coupons Management</h1>
//             </div>

//             {/* Search, filter and actions bar */}
//             <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
//                 <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
//                     <form onSubmit={handleSearch} className="flex w-full md:w-auto">
//                         <div className="relative flex-grow">
//                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                 <FiSearch className="text-gray-400" />
//                             </div>
//                             <input
//                                 type="text"
//                                 placeholder="Search coupons..."
//                                 value={searchQuery}
//                                 onChange={handleSearchChange}
//                                 className="pl-10 pr-3 py-2 w-full md:w-64 lg:w-80 border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-black"
//                             />
//                         </div>
//                         <button
//                             type="submit"
//                             className="bg-black text-white px-4 py-2 rounded-r hover:bg-gray-800 transition-colors"
//                         >
//                             Search
//                         </button>
//                         {searchQuery && (
//                             <button
//                                 type="button"
//                                 onClick={clearSearch}
//                                 className="ml-2 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
//                             >
//                                 Clear
//                             </button>
//                         )}
//                     </form>

//                     <div className="flex flex-wrap gap-2 w-full md:w-auto">
//                         <button
//                             className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors flex items-center"
//                             onClick={handleOpenAddModal}
//                         >
//                             <FiPlus className="mr-2" />
//                             Add Coupon
//                         </button>
//                         <button className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 transition-colors flex items-center">
//                             <FiFilter className="mr-2" />
//                             Filters
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Status message when relevant */}
//             {error && (
//                 <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded flex items-center">
//                     <FiAlertCircle className="mr-2" /> {error}
//                     <button
//                         onClick={() => setError(null)}
//                         className="ml-auto text-red-700 hover:text-red-900"
//                     >
//                         ✕
//                     </button>
//                 </div>
//             )}

//             {/* Empty state for no coupons */}
//             {!isLoading && filteredCoupons.length === 0 && (
//                 <div className="bg-white rounded-lg shadow-md p-12 text-center">
//                     <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
//                         <Coupen className="w-8 h-8 text-gray-400" />
//                     </div>
//                     <h3 className="text-xl font-semibold mb-2">No coupons found</h3>
//                     <p className="text-gray-500 mb-6">
//                         {searchQuery ?
//                             `No coupons match the search "${searchQuery}"` :
//                             "You haven't created any coupons yet"}
//                     </p>
//                     <button
//                         onClick={handleOpenAddModal}
//                         className="bg-black text-white px-6 py-2.5 rounded hover:bg-gray-800 transition-colors inline-flex items-center"
//                     >
//                         <FiPlus className="mr-2" />
//                         Create Your First Coupon
//                     </button>
//                 </div>
//             )}

//             {/* Coupons Table */}
//             {filteredCoupons.length > 0 && (
//                 <div className="bg-white rounded-lg shadow-md overflow-hidden">
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-50">
//                                 <tr>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
//                                     <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Limit</th>
//                                     <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Used</th>
//                                     <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                                     <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                                 {currentCoupons.map((coupon) => {
//                                     const isExpired = new Date(coupon.expiresAt) < new Date();
//                                     const isActive = new Date(coupon.activeFrom) <= new Date() && new Date(coupon.expiresAt) >= new Date();
//                                     const isUsedUp = coupon.usedCount >= coupon.maxUsage;

//                                     return (
//                                         <tr key={coupon._id} className="hover:bg-gray-50">
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <div className="flex justify-center">
//                                                     <Coupen />
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <div className="text-sm font-medium text-gray-900">{coupon.name}</div>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <div className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">{coupon.code}</div>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <div className="text-sm text-gray-900 font-medium">
//                                                     {coupon.discountType === "percentage"
//                                                         ? `${coupon.discountValue}%`
//                                                         : `₹${coupon.discountValue}`}
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <div className="text-sm text-gray-900">{formattedDate(coupon.activeFrom)}</div>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <div className="text-sm text-gray-900">{formattedDate(coupon.expiresAt)}</div>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-center">
//                                                 <div className="text-sm text-gray-900">{coupon.maxUsage}</div>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-center">
//                                                 <div className="text-sm text-gray-900">
//                                                     {coupon.usedCount}
//                                                     {isUsedUp && <span className="ml-1 text-red-500">(Full)</span>}
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-center">
//                                                 <span className={`px-2 py-1 text-xs rounded-full ${isExpired ? 'bg-red-100 text-red-800' :
//                                                         !isActive ? 'bg-yellow-100 text-yellow-800' :
//                                                             isUsedUp ? 'bg-orange-100 text-orange-800' :
//                                                                 'bg-green-100 text-green-800'
//                                                     }`}>
//                                                     {isExpired ? 'Expired' :
//                                                         !isActive ? 'Upcoming' :
//                                                             isUsedUp ? 'Fully Used' :
//                                                                 'Active'}
//                                                 </span>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                                                 <div className="flex justify-end space-x-2">
//                                                     <button
//                                                         className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
//                                                         onClick={(e) => {
//                                                             e.stopPropagation();
//                                                             handleOpenEditModal(coupon);
//                                                         }}
//                                                         title="Edit coupon"
//                                                     >
//                                                         <FiEdit2 size={18} />
//                                                     </button>
//                                                     <button
//                                                         className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
//                                                         onClick={(e) => handleOpenDeleteModal(coupon._id, coupon.name, e)}
//                                                         title="Delete coupon"
//                                                     >
//                                                         <FiTrash2 size={18} />
//                                                     </button>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     );
//                                 })}
//                             </tbody>
//                         </table>
//                     </div>

//                     {/* Pagination Controls */}
//                     <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
//                         <div className="flex flex-col md:flex-row justify-between items-center">
//                             <div className="text-sm text-gray-700 mb-4 md:mb-0">
//                                 Showing <span className="font-medium">{Math.min(totalItems, 1 + (currentPage - 1) * pageSize)}</span> to{" "}
//                                 <span className="font-medium">{Math.min(currentPage * pageSize, totalItems)}</span>{" "}
//                                 of <span className="font-medium">{totalItems}</span> results
//                             </div>
//                             <div className="flex items-center space-x-2">
//                                 <select
//                                     value={pageSize}
//                                     onChange={handlePageSizeChange}
//                                     className="border rounded p-1.5 text-sm bg-white"
//                                     aria-label="Items per page"
//                                 >
//                                     <option value={5}>5 per page</option>
//                                     <option value={10}>10 per page</option>
//                                     <option value={25}>25 per page</option>
//                                     <option value={50}>50 per page</option>
//                                 </select>

//                                 <button
//                                     onClick={() => goToPage(1)}
//                                     disabled={currentPage === 1}
//                                     className="px-2 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white"
//                                     aria-label="First page"
//                                 >
//                                     &laquo;
//                                 </button>

//                                 <button
//                                     onClick={() => goToPage(currentPage - 1)}
//                                     disabled={currentPage === 1}
//                                     className="px-2 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white"
//                                     aria-label="Previous page"
//                                 >
//                                     &lsaquo;
//                                 </button>

//                                 <div className="flex items-center space-x-1">
//                                     {[...Array(Math.min(5, totalPages))].map((_, idx) => {
//                                         // Logic for displaying page numbers around current page
//                                         let pageNumber;
//                                         if (totalPages <= 5) {
//                                             pageNumber = idx + 1;
//                                         } else if (currentPage <= 3) {
//                                             pageNumber = idx + 1;
//                                         } else if (currentPage >= totalPages - 2) {
//                                             pageNumber = totalPages - 4 + idx;
//                                         } else {
//                                             pageNumber = currentPage - 2 + idx;
//                                         }

//                                         if (pageNumber <= totalPages) {
//                                             return (
//                                                 <button
//                                                     key={idx}
//                                                     onClick={() => goToPage(pageNumber)}
//                                                     aria-current={currentPage === pageNumber ? "page" : undefined}
//                                                     className={`w-8 h-8 flex items-center justify-center rounded ${currentPage === pageNumber
//                                                             ? "bg-black text-white"
//                                                             : "bg-white border hover:bg-gray-100"
//                                                         }`}
//                                                 >
//                                                     {pageNumber}
//                                                 </button>
//                                             );
//                                         }
//                                         return null;
//                                     })}
//                                 </div>

//                                 <button
//                                     onClick={() => goToPage(currentPage + 1)}
//                                     disabled={currentPage === totalPages}
//                                     className="px-2 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white"
//                                     aria-label="Next page"
//                                 >
//                                     &rsaquo;
//                                 </button>

//                                 <button
//                                     onClick={() => goToPage(totalPages)}
//                                     disabled={currentPage === totalPages}
//                                     className="px-2 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white"
//                                     aria-label="Last page"
//                                 >
//                                     &raquo;
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Delete Confirmation Modal */}
//             {deleteModal.open && (
//                 <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
//                     <div className="bg-white rounded-lg p-6 w-11/12 max-w-md shadow-2xl border border-gray-200">
//                         <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
//                         <p className="mb-6 text-gray-600">
//                             Are you sure you want to delete the coupon <span className="font-semibold">{deleteModal.couponName}</span>? This action cannot be undone.
//                         </p>
//                         <div className="flex justify-end gap-4">
//                             <button
//                                 className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
//                                 onClick={handleCloseDeleteModal}
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
//                                 onClick={confirmDelete}
//                             >
//                                 Delete
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Add Coupon Modal */}
//             {isAddModalOpen && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
//                     <AddCouponModal
//                         isOpen={isAddModalOpen}
//                         onClose={handleCloseAddModal}
//                         fetchCoupons={fetchCoupons}
//                     />
//                 </div>
//             )}

//             {/* Edit Coupon Modal */}
//             {isEditModalOpen && editingCoupon && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
//                     <EditCouponModal
//                         coupon={editingCoupon}
//                         handleCloseEditModal={handleCloseEditModal}
//                         fetchCoupons={fetchCoupons}
//                     />
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Coupons;
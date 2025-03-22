


// import React, { useEffect, useState } from "react";
// import { FiSearch } from "react-icons/fi";
// import { useNavigate } from "react-router";
// import axios from "axios";

// import filterIcon from "../../../assets/images/filterIcon.png";
// import editicon from "../../../assets/images/edit.png";
// import deleteicon from "../../../assets/images/delete.png";
// import { Coupen } from "../../../icons/icons"

// import { setEditProductID } from "../../../store/slices/sellerSideSelectedSlice";
// import { useDispatch } from "react-redux";

// import AddCouponModal from "./AddCouponModal";
// import EditCouponModal from "./EditCouponModal";



// const API_BASE_URL = import.meta.env.VITE_API_URL;

// const Coupons = () => {


//     const dispatch = useDispatch();
//     const navigate = useNavigate();


//     const [initialCouponData, setInitialCouponData] = useState([]);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [currentPage, setCurrentPage] = useState(1);
//     const [pageSize, setPageSize] = useState(10);

//     const [deleteModal, setDeleteModal] = useState({
//         open: false,
//         couponId: null,
//     });

//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [isEditModalOpen, setEditModalOpen] = useState(false)

//     const handleOpenEditModal = () => {
//         setEditModalOpen(true);
//     }

//     const handleCloseEditModal = () => {
//         setEditModalOpen(false)
//     }

//     const handleOpenModal = () => {
//         setIsModalOpen(true);
//     };

//     const handleCloseModal = () => {
//         setIsModalOpen(false);
//     };

//     const filteredCoupons = (initialCouponData || []).filter((coupon) =>
//         coupon.name.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     const totalItems = filteredCoupons.length;
//     const totalPages = Math.ceil(totalItems / pageSize);
//     const indexOfLastItem = currentPage * pageSize;
//     const indexOfFirstItem = indexOfLastItem - pageSize;
//     const currentCoupons = filteredCoupons.slice(indexOfFirstItem, indexOfLastItem);

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
//         fetchCoupons();
//     }, []);

//     const fetchCoupons = async () => {
//         console.log("started");

//         try {
//             const response = await axios.get(`${API_BASE_URL}/admin/coupons`);

//             console.log(response.data);


//             setInitialCouponData(response.data.coupons);

//         } catch (error) {

//             console.error("Error fetching coupons:", error);
//         }
//     };

//     function formattedDate(dateString) {
//         const dateObj = new Date(dateString);
//         return dateObj.toLocaleDateString("en-GB");
//     }

//     const handleOpenDeleteModal = (id) => {
//         setDeleteModal({ open: true, couponId: id });
//     };

//     const handleCloseDeleteModal = () => {
//         setDeleteModal({ open: false, couponId: null });
//     };


//     const confirmDelete = async (id) => {

//         try {

//             const response = await axios.delete(`${API_BASE_URL}/admin/delete-coupon/${id}`);

//             console.log(response.data);

//             fetchCoupons();

//         } catch (error) {

//             console.error("Error deleting coupon:", error);

//         } finally {

//             handleCloseDeleteModal();
//         }
//     };


//     if ((initialCouponData || []).length < 1) {
//         return (
//             <div>
//                 <h1>Loading...</h1>
//             </div>
//         );
//     }

//     return (
//         <div className="w-full min-h-[800px] p-10">
//             {/* Top Bar */}
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
//                 <h2 className="text-2xl font-bold mb-2 sm:mb-0">Coupons Management</h2>
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
//                     <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
//                         onClick={handleOpenModal}>
//                         Add Coupon
//                     </button>
//                     <button className=" flex border border-gray-300 px-4 py-2 rounded hover:bg-gray-100">
//                         <img src={filterIcon} className="mr-3" alt="" />
//                         Filters
//                     </button>
//                 </div>
//             </div>

//             {/* Table */}
//             <div className="overflow-x-auto w-full">
//                 <table className="w-full text-left border-collapse">
//                     <thead>
//                         <tr className="bg-black text-white">
//                             <th className="py-3 px-4"></th>
//                             <th className="py-3 px-4">Name</th>
//                             <th className="py-3 px-4">Coupon Code</th>
//                             <th className="py-3 px-4">Discount</th>
//                             <th className="py-3 px-4">Active From</th>
//                             <th className="py-3 px-4">Active To</th>
//                             <th className="py-3 px-4 text-center">Limit</th>
//                             <th className="py-3 px-4 text-center">Used</th>
//                             <th className="py-3 px-4 text-center">Categories</th>
//                             <th className="py-3 px-4"></th>
//                         </tr>
//                     </thead>
//                     <tbody className="bg-white">
//                         {currentCoupons.length > 0 ? (
//                             currentCoupons.map((coupon) => (
//                                 <tr key={coupon._id} className="border-4 border-white bg-gray-200 hover:bg-gray-300">
//                                     <td className="py-3 px-4"> <Coupen /></td>
//                                     <td className="py-3 px-4">{coupon.name}</td>
//                                     <td className="py-3 px-4">{coupon.code}</td>
//                                     <td className="py-3 px-4 text-center">
//                                         {coupon.discountType === "percentage"
//                                             ? `${coupon.discountValue}%`
//                                             : `₹ ${coupon.discountValue}`}
//                                     </td>
//                                     <td className="py-3 px-4">{formattedDate(coupon.activeFrom)}</td>
//                                     <td className="py-3 px-4">{formattedDate(coupon.expiresAt)}</td>
//                                     <td className="py-3 px-4 text-center">{coupon.maxUsage}</td>
//                                     <td className="py-3 px-4 text-center">{coupon.usedCount}</td>
//                                     <td className="py-3 px-4 text-center">
//                                         {coupon.applicableCategories.join(", ")}
//                                     </td>
//                                     <td className="py-3 px-4">
//                                         <button
//                                             className="text-black px-3 py-1 rounded hover:bg-gray-200"
//                                             onClick={() => {
//                                                 handleOpenEditModal()
//                                             }}
//                                         >
//                                             <img src={editicon} alt="edit" />
//                                         </button>
//                                         {isEditModalOpen && (
//                                             <EditCouponModal
//                                                 coupon={coupon}
//                                                 handleOpenEditModal={handleOpenEditModal}
//                                                 handleCloseEditModal={handleCloseEditModal}
//                                             />
//                                         )}
//                                         <button
//                                             className="text-black px-3 py-1 rounded hover:bg-gray-200"
//                                             onClick={() => handleOpenDeleteModal(coupon._id)}
//                                         >
//                                             <img src={deleteicon} alt="delete" />
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan="9" className="py-4 text-center">
//                                     No coupons found.
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
//                     <button
//                         onClick={() => goToPage(currentPage - 1)}
//                         disabled={currentPage === 1}
//                         className="px-3 py-1 rounded disabled:opacity-50"
//                     >
//                         &lt;
//                     </button>
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
//                     <button
//                         onClick={() => goToPage(currentPage + 1)}
//                         disabled={currentPage === totalPages || totalPages === 0}
//                         className="px-3 py-1 rounded disabled:opacity-50"
//                     >
//                         &gt;
//                     </button>
//                 </div>
//             </div>

//             {/* Delete Confirmation Modal */}
//             {deleteModal.open && (
//                 <div className="fixed inset-0 flex items-center justify-center z-50">
//                     <div className="bg-white rounded p-6 w-100 shadow-2xl border-4 border-black">
//                         <h2 className="text-xl font-bold mb-4 text-center">Confirm Deletion</h2>
//                         <p className="mb-6 text-center">
//                             Are you sure you want to delete this coupon?
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
//                                 onClick={() => confirmDelete(deleteModal.couponId)}
//                             >
//                                 Delete
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//             {/* The Modal */}
//             <AddCouponModal
//                 isOpen={isModalOpen}
//                 onClose={handleCloseModal}
//                 fetchCoupons={fetchCoupons}
//             />


//         </div>
//     );
// };

// export default Coupons;



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
            const response = await axios.get(`${API_BASE_URL}/admin/coupons`);
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
            const response = await axios.delete(`${API_BASE_URL}/admin/delete-coupon/${id}`);
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
                                            {coupon.applicableCategories.join(", ")}
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
                    />
                </div>
            )}
        </div>
    );
};

export default Coupons;
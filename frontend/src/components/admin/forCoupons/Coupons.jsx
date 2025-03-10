


import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router";
import axios from "axios";

import filterIcon from "../../../assets/images/filterIcon.png";
import editicon from "../../../assets/images/edit.png";
import deleteicon from "../../../assets/images/delete.png";
import { Coupen } from "../../../icons/icons"

import { setEditProductID } from "../../../store/slices/sellerSideSelectedSlice";
import { useDispatch } from "react-redux";

import AddCouponModal from "./AddCouponModal";



const API_BASE_URL = import.meta.env.VITE_API_URL;

const Coupons = () => {


    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Use consistent variable name
    const [initialCouponData, setInitialCouponData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [deleteModal, setDeleteModal] = useState({
        open: false,
        couponId: null,
    });

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Filter coupons based on searchQuery
    const filteredCoupons = (initialCouponData || []).filter((coupon) =>
        coupon.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalItems = filteredCoupons.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const indexOfLastItem = currentPage * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    const currentCoupons = filteredCoupons.slice(indexOfFirstItem, indexOfLastItem);

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

    const handleOpenDeleteModal = (id) => {
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
            <div>
                <h1>Loading...</h1>
            </div>
        );
    }

    return (
        <div className="w-full min-h-[800px] p-10">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                <h2 className="text-2xl font-bold mb-2 sm:mb-0">Coupons Management</h2>
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
                    <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                        onClick={handleOpenModal}>
                        Add Coupon
                    </button>
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
                            <th className="py-3 px-4"></th>
                            <th className="py-3 px-4">Name</th>
                            <th className="py-3 px-4">Coupon Code</th>
                            <th className="py-3 px-4">Discount</th>
                            <th className="py-3 px-4">Active From</th>
                            <th className="py-3 px-4">Active To</th>
                            <th className="py-3 px-4 text-center">Limit</th>
                            <th className="py-3 px-4 text-center">Used</th>
                            <th className="py-3 px-4 text-center">Categories</th>
                            <th className="py-3 px-4"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {currentCoupons.length > 0 ? (
                            currentCoupons.map((coupon) => (
                                <tr key={coupon._id} className="border-4 border-white bg-gray-200 hover:bg-gray-300">
                                    <td className="py-3 px-4"> <Coupen /></td>
                                    <td className="py-3 px-4">{coupon.name}</td>
                                    <td className="py-3 px-4">{coupon.code}</td>
                                    <td className="py-3 px-4 text-center">
                                        {coupon.discountType === "percentage"
                                            ? `${coupon.discountValue}%`
                                            : `₹ ${coupon.discountValue}`}
                                    </td>
                                    <td className="py-3 px-4">{formattedDate(coupon.activeFrom)}</td>
                                    <td className="py-3 px-4">{formattedDate(coupon.expiresAt)}</td>
                                    <td className="py-3 px-4 text-center">{coupon.maxUsage}</td>
                                    <td className="py-3 px-4 text-center">{coupon.usedCount}</td>
                                    <td className="py-3 px-4 text-center">
                                        {coupon.applicableCategories.join(", ")}
                                    </td>
                                    <td className="py-3 px-4">
                                        <button
                                            className="text-black px-3 py-1 rounded hover:bg-gray-200"
                                            onClick={() => {
                                                navigate(`/admin/edit-coupon/${coupon._id}`);
                                                dispatch(setEditProductID(coupon._id));
                                            }}
                                        >
                                            <img src={editicon} alt="edit" />
                                        </button>
                                        <button
                                            className="text-black px-3 py-1 rounded hover:bg-gray-200"
                                            onClick={() => handleOpenDeleteModal(coupon._id)}
                                        >
                                            <img src={deleteicon} alt="delete" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="py-4 text-center">
                                    No coupons found.
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
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded disabled:opacity-50"
                    >
                        &lt;
                    </button>
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
                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="px-3 py-1 rounded disabled:opacity-50"
                    >
                        &gt;
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModal.open && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white rounded p-6 w-100 shadow-2xl border-4 border-black">
                        <h2 className="text-xl font-bold mb-4 text-center">Confirm Deletion</h2>
                        <p className="mb-6 text-center">
                            Are you sure you want to delete this coupon?
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
                                onClick={() => confirmDelete(deleteModal.couponId)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* The Modal */}
            <AddCouponModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                fetchCoupons={fetchCoupons}

            />
        </div>
    );
};

export default Coupons;

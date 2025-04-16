



import React, { useEffect, useState } from "react";
import axios from "axios";

import customerID from "../../../assets/images/customerID.png";
import email from "../../../assets/images/email.png";
import address from "../../../assets/images/address.png";
import phone from "../../../assets/images/phone.png";
import lastonline from "../../../assets/images/lastonline.png";
import LastTransaction from "../../../assets/images/Last Transaction.png";
import { toggleUserBlockStatus } from "../../../services/adminCustomerServiced";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function CustomerRightSection({ customer }) {


    const [isActive, setIsActive] = useState(customer.isActive);
    const [blockLoading, setBlockLoading] = useState(false);

    const [blockModal, setBlockModal] = useState({
        open: false,
        customerId: null,
        isActive: null,
    });

    useEffect(() => {
        setIsActive(customer.isActive);
    }, [customer.isActive]);

    const totalOrders = 2400;
    const totalOrdersGrowth = 23;
    const totalBalance = 10000;
    const totalBalanceGrowth = 10;

    const transactions = [];

    const statusColorMap = {
        Processing: "text-yellow-600",
        Shipped: "text-blue-600",
        Delivered: "text-green-600",
    };

    const [currentTxPage, setCurrentTxPage] = useState(1);
    const [txPageSize, setTxPageSize] = useState(5);

    const totalTx = transactions.length;
    const totalTxPages = Math.ceil(totalTx / txPageSize);
    const indexOfLastTx = currentTxPage * txPageSize;
    const indexOfFirstTx = indexOfLastTx - txPageSize;
    const currentTx = transactions.slice(indexOfFirstTx, indexOfLastTx);

    const handleTxPageSizeChange = (e) => {
        setTxPageSize(Number(e.target.value));
        setCurrentTxPage(1);
    };

    const date = new Date(customer.registrationDate);
    const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const handleBlockModal = (id, currentStatus) => {
        setBlockModal({
            open: true,
            customerId: id,
            isActive: currentStatus,
        });
    };

    const handleCloseBlockModal = () => {
        setBlockModal({
            open: false,
            customerId: null,
            isActive: null,
        });
    };

    const handleBlock = async (id, currentStatus) => {
        // Optimistic UI update: flip the active state immediately.
        setIsActive(!currentStatus);
        setBlockLoading(true);

        try {
            const response = await toggleUserBlockStatus(id, currentStatus)
            //  axios.patch(
            //     `${API_BASE_URL}/admin/block-user/${id}?isActive=${!currentStatus}`
            // );
            // Optionally, if your API returns the updated status:
            if (response.data && typeof response.data.isActive === "boolean") {
                setIsActive(response.data.isActive);
            }
        } catch (error) {
            console.error("Error updating status:", error);
            // Revert the change if there's an error
            setIsActive(currentStatus);
        } finally {
            setBlockLoading(false);
            handleCloseBlockModal();
        }
    };

    return (
        <div className="p-4 md:p-6 bg-gray-50 w-full min-h-[850px]">
            {/* Top bar: "Customer Details" + "Block"/"UnBlock" button */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Customer Details</h1>
                <button
                    className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 flex items-center justify-center hover:cursor-pointer"
                    onClick={() => handleBlockModal(customer._id, isActive)}
                    disabled={blockLoading}
                >
                    {blockLoading ? (
                        <div className="flex items-center">
                            <svg
                                className="animate-spin h-5 w-5 mr-2 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                ></path>
                            </svg>
                            Updating...
                        </div>
                    ) : (
                        isActive ? "Block" : "UnBlock"
                    )}
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Left Column: Customer Info Card */}
                <div className="w-full md:w-1/3 bg-white rounded shadow">
                    <div className="relative">
                        <div className="h-40 bg-black rounded-t"></div>
                        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-40 h-40 rounded-full overflow-hidden border-4 border-white">
                            <img
                                src="https://m.media-amazon.com/images/I/71Zg6RRQzsL._SY741_.jpg"
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="px-4 pt-12 pb-4 text-center">
                        <h2 className="text-lg font-medium">{customer.username}</h2>
                        <span
                            className={`inline-block mt-1 text-sm px-2 py-1 rounded-full ${customer.status === "Active"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                                }`}
                        >
                            {customer.status}
                        </span>

                        {/* Details List */}
                        <div className="mt-6 space-y-4 text-sm text-left">
                            {/* Customer ID */}
                            <div className="flex">
                                <img
                                    src={customerID}
                                    alt="Customer ID icon"
                                    className="h-8 w-8 mt-1"
                                />
                                <div className="ml-4">
                                    <p className="font-semibold">Customer ID:</p>
                                    <p className="text-gray-700 ml-2">{customer.userId}</p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex">
                                <img
                                    src={email}
                                    alt="Email icon"
                                    className="h-8 w-8 mt-1"
                                />
                                <div className="ml-4">
                                    <p className="font-semibold">Email:</p>
                                    <p className="text-gray-700 ml-2">{customer.email}</p>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="flex">
                                <img
                                    src={address}
                                    alt="Address icon"
                                    className="h-8 w-8 mt-1"
                                />
                                <div className="ml-4">
                                    <p className="font-semibold">Address:</p>
                                    <p className="text-gray-700 ml-2">{customer.address}</p>
                                </div>
                            </div>

                            {/* Phone Number */}
                            <div className="flex">
                                <img
                                    src={phone}
                                    alt="Phone icon"
                                    className="h-8 w-8 mt-1"
                                />
                                <div className="ml-4">
                                    <p className="font-semibold">Phone Number:</p>
                                    <p className="text-gray-700 ml-2">{customer.phone}</p>
                                </div>
                            </div>

                            {/* Registration Date */}
                            <div className="flex">
                                <img
                                    src={LastTransaction}
                                    alt="Registration icon"
                                    className="h-8 w-8 mt-1"
                                />
                                <div className="ml-4">
                                    <p className="font-semibold">Registration Date:</p>
                                    <p className="text-gray-700 ml-2">{formattedDate}</p>
                                </div>
                            </div>

                            {/* Last Transaction */}
                            <div className="flex">
                                <img
                                    src={LastTransaction}
                                    alt="Transaction icon"
                                    className="h-8 w-8 mt-1"
                                />
                                <div className="ml-4">
                                    <p className="font-semibold">Last Transaction:</p>
                                    <p className="text-gray-700 ml-2">{customer.lastTransaction}</p>
                                </div>
                            </div>

                            {/* Last Online */}
                            <div className="flex">
                                <img
                                    src={lastonline}
                                    alt="Last online icon"
                                    className="h-8 w-8 mt-1"
                                />
                                <div className="ml-4">
                                    <p className="font-semibold">Last online:</p>
                                    <p className="text-gray-700 ml-2">{customer.lastonline}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Stats + Transaction History */}
                <div className="w-full md:w-2/3 flex flex-col gap-6">
                    {/* Stats Boxes */}
                    <div className="flex flex-col sm:flex-row gap-6">
                        {/* Total Orders */}
                        <div className="flex-1 bg-white rounded shadow p-4">
                            <h3 className="text-sm font-medium text-gray-600">Total Orders</h3>
                            <p className="text-2xl font-bold">{totalOrders.toLocaleString()}</p>
                            <p className="text-xs text-green-600 mt-1">+{totalOrdersGrowth}% this month</p>
                        </div>

                        {/* Total Balance */}
                        <div className="flex-1 bg-white rounded shadow p-4">
                            <h3 className="text-sm font-medium text-gray-600">Total Balance</h3>
                            <p className="text-2xl font-bold">
                                ₹
                                {totalBalance.toLocaleString("en-IN", {
                                    minimumFractionDigits: 2,
                                })}
                            </p>
                            <p className="text-xs text-green-600 mt-1">+{totalBalanceGrowth}% vs last month</p>
                            <button className="mt-3 px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                                Settle Today
                            </button>
                        </div>
                    </div>

                    {/* Transaction History */}
                    <div className="bg-white rounded shadow">
                        {/* Table Header */}
                        <div className="p-4 flex items-center justify-between">
                            <h3 className="text-lg font-medium">Transaction History</h3>
                            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                                Filters
                            </button>
                        </div>
                        {/* Transaction Table */}
                        <table className="w-full text-left">
                            <thead className="bg-gray-100 text-gray-700">
                                <tr>
                                    <th className="py-3 px-4">Order ID</th>
                                    <th className="py-3 px-4">Product</th>
                                    <th className="py-3 px-4">Amount</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4">Date</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700">
                                {currentTx.map((tx) => (
                                    <tr
                                        key={tx.orderId}
                                        className="border-b hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="py-3 px-4">{tx.orderId}</td>
                                        <td className="py-3 px-4">{tx.product}</td>
                                        <td className="py-3 px-4">
                                            ₹
                                            {tx.amount.toLocaleString("en-IN", {
                                                minimumFractionDigits: 2,
                                            })}
                                        </td>
                                        <td
                                            className={`py-3 px-4 ${statusColorMap[tx.status] || ""}`}
                                        >
                                            {tx.status}
                                        </td>
                                        <td className="py-3 px-4">{tx.date}</td>
                                    </tr>
                                ))}
                                {currentTx.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="py-4 text-center">
                                            No transactions found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Pagination Controls */}
                        <div className="flex flex-col sm:flex-row sm:justify-between items-center mt-4 gap-2 px-4 pb-4">
                            <div className="text-sm">
                                <label htmlFor="txPageSizeSelect" className="mr-2">
                                    Show results:
                                </label>
                                <select
                                    id="txPageSizeSelect"
                                    value={txPageSize}
                                    onChange={handleTxPageSizeChange}
                                    className="border rounded p-1"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                </select>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setCurrentTxPage(currentTxPage - 1)}
                                    disabled={currentTxPage === 1}
                                    className="px-3 py-1 rounded disabled:opacity-50"
                                >
                                    &lt;
                                </button>
                                {Array.from({ length: totalTxPages }, (_, i) => i + 1).map(
                                    (pageNum) => (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentTxPage(pageNum)}
                                            className={`px-3 py-1 rounded ${currentTxPage === pageNum
                                                ? "bg-black text-white"
                                                : "bg-gray-100"
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    )
                                )}
                                <button
                                    onClick={() => setCurrentTxPage(currentTxPage + 1)}
                                    disabled={currentTxPage === totalTxPages || totalTxPages === 0}
                                    className="px-3 py-1 rounded disabled:opacity-50"
                                >
                                    &gt;
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {blockModal.open && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white rounded p-6 w-100 shadow-2xl border-4 border-black">
                        <h2 className="text-xl font-bold mb-4 text-center">
                            Confirm to {isActive ? "Block" : "UnBlock"} !!!
                        </h2>
                        <p className="mb-6 text-center">
                            Are you sure you want to {isActive ? "Block" : "UnBlock"} this user?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                className="bg-gray-300 text-black px-4 py-2 rounded"
                                onClick={handleCloseBlockModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-black text-white px-4 py-2 rounded flex items-center justify-center"
                                disabled={blockLoading}
                                onClick={() => handleBlock(customer._id, isActive)}
                            >
                                {blockLoading ? (
                                    <div className="flex items-center">
                                        <svg
                                            className="animate-spin h-5 w-5 mr-2 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                            ></path>
                                        </svg>
                                        Updating...
                                    </div>
                                ) : (
                                    isActive ? "Block" : "UnBlock"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}



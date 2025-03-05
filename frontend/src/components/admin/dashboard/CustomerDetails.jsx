import React, { useState } from "react";
import customerID from "../../../assets/images/customerID.png";
import email from "../../../assets/images/email.png";
import address from "../../../assets/images/address.png";
import phone from "../../../assets/images/phone.png";
import lastonline from "../../../assets/images/lastonline.png";
import LastTransaction from "../../../assets/images/Last Transaction.png";


export default function CustomerDetails() {
    // Example customer data
    const customer = {
        name: "Adithyan Binu",
        id: "ID-07221",
        status: "Active",
        avatar: "https://assets.gqindia.com/photos/653a68cf4233545fe8acb9b4/4:3/w_1440,h_1080,c_limit/Movies-turned-down-by-Leo-star-Vijay.jpg",
        email: "joyalkurikose7@gmail.com",
        address: "Thekkathasammoottil, Kizhathade, Karcha, India, 673571",
        phone: "+91 7026660287",
        lastTransaction: "07 Dec 2023",
        lastonline: "07 Dec 2023",
    };

    // Example stats
    const totalOrders = 2400;
    const totalOrdersGrowth = 23; // +23% this month
    const totalBalance = 10000;
    const totalBalanceGrowth = 10; // +10% vs last month

    // Example transactions (could be longer)
    const transactions = [
        {
            orderId: "30020",
            product: "t shirt",
            amount: 321,
            status: "Processing",
            date: "12 Dec 2023",
        },

    ];

    // Map statuses to color classes for the transaction table
    const statusColorMap = {
        Processing: "text-yellow-600",
        Shipped: "text-blue-600",
        Delivered: "text-green-600",
    };

    // Pagination state for transaction history
    const [currentTxPage, setCurrentTxPage] = useState(1);
    const [txPageSize, setTxPageSize] = useState(5);

    // Calculate pagination values for transactions
    const totalTx = transactions.length;
    const totalTxPages = Math.ceil(totalTx / txPageSize);
    const indexOfLastTx = currentTxPage * txPageSize;
    const indexOfFirstTx = indexOfLastTx - txPageSize;
    const currentTx = transactions.slice(indexOfFirstTx, indexOfLastTx);

    // Handler for transaction page size change
    const handleTxPageSizeChange = (e) => {
        setTxPageSize(Number(e.target.value));
        setCurrentTxPage(1); // Reset to first page
    };

    return (
        <div className="p-4 md:p-6 bg-gray-50 ">
            {/* Top bar: "Customer Details" + "Block" button */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Customer Details</h1>
                <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                    Block
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Left Column: Customer Info Card */}
                <div className="w-full md:w-1/3 bg-white rounded shadow">
                    {/* Black header + profile picture */}
                    <div className="relative">
                        {/* Black rectangle at the top */}
                        <div className="h-20 bg-black rounded-t"></div>
                        {/* Circular frame for the avatar, overlapping the black area */}
                        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full overflow-hidden border-4 border-white">
                            <img
                                src={customer.avatar}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Card content below the black header */}
                    <div className="px-4 pt-12 pb-4 text-center">
                        <h2 className="text-lg font-medium">{customer.name}</h2>
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
                                    <p>{customer.id}</p>
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
                                    <p>{customer.email}</p>
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
                                    <p>{customer.address}</p>
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
                                    <p>{customer.phone}</p>
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
                                    <p>{customer.lastTransaction}</p>
                                </div>
                            </div>
                            <div className="flex">
                                <img
                                    src={lastonline}
                                    alt="Transaction icon"
                                    className="h-8 w-8 mt-1"
                                />
                                <div className="ml-4">
                                    <p className="font-semibold">Last online:</p>
                                    <p>{customer.lastonline}</p>
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
                            <p className="text-xs text-green-600 mt-1">
                                +{totalOrdersGrowth}% this month
                            </p>
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
                            <p className="text-xs text-green-600 mt-1">
                                +{totalBalanceGrowth}% vs last month
                            </p>
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
                                        <td className={`py-3 px-4 ${statusColorMap[tx.status] || ""}`}>
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

                        {/* Pagination Controls for Transaction History */}
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
        </div>
    );
}

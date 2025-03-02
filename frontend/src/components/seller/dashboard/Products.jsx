import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import plus from "../../../assets/images/Plus.svg";
import editicon from "../../../assets/images/edit.png";
import deleteicon from "../../../assets/images/delete.png";

const initialProductsData = [
    // First group (IDs 1-10)
    { id: 1, productName: "Apple iPhone 13", productId: "IP13", addedOn: "2023-01-01", price: 999, category: "Electronics", stock: 50 },
    { id: 2, productName: "Samsung Galaxy S21", productId: "SGS21", addedOn: "2023-01-02", price: 899, category: "Electronics", stock: 30 },
    { id: 3, productName: "Sony WH-1000XM4", productId: "SONYWH", addedOn: "2023-01-03", price: 349, category: "Audio", stock: 20 },
    { id: 4, productName: "Dell XPS 13", productId: "XPS13", addedOn: "2023-01-04", price: 1199, category: "Computers", stock: 15 },
    { id: 5, productName: "HP Spectre x360", productId: "HPSX360", addedOn: "2023-01-05", price: 1299, category: "Computers", stock: 10 },
    { id: 6, productName: "Apple AirPods Pro", productId: "AAPP", addedOn: "2023-01-06", price: 249, category: "Audio", stock: 100 },
    { id: 7, productName: "Google Pixel 6", productId: "PIX6", addedOn: "2023-01-07", price: 699, category: "Electronics", stock: 40 },
    { id: 8, productName: "Amazon Echo Dot", productId: "ECHO", addedOn: "2023-01-08", price: 49, category: "Smart Home", stock: 200 },
    { id: 9, productName: "Fitbit Versa 3", productId: "FITV3", addedOn: "2023-01-09", price: 229, category: "Wearables", stock: 70 },
    { id: 10, productName: "Nintendo Switch", productId: "NSWITCH", addedOn: "2023-01-10", price: 299, category: "Gaming", stock: 60 },
    // Second group (IDs 11-20)
    { id: 11, productName: "Apple MacBook Pro", productId: "MBP", addedOn: "2023-01-11", price: 1999, category: "Computers", stock: 25 },
    { id: 12, productName: "Sony PlayStation 5", productId: "PS5", addedOn: "2023-01-12", price: 499, category: "Gaming", stock: 5 },
    { id: 13, productName: "Microsoft Xbox Series X", productId: "XBSX", addedOn: "2023-01-13", price: 499, category: "Gaming", stock: 8 },
    { id: 14, productName: "Bose QuietComfort 35", productId: "BOSEQC35", addedOn: "2023-01-14", price: 299, category: "Audio", stock: 30 },
    { id: 15, productName: "Lenovo ThinkPad X1", productId: "TPX1", addedOn: "2023-01-15", price: 1399, category: "Computers", stock: 18 },
    { id: 16, productName: "Canon EOS R5", productId: "EOSR5", addedOn: "2023-01-16", price: 3899, category: "Cameras", stock: 12 },
    { id: 17, productName: "DJI Mavic Air 2", productId: "DJI2", addedOn: "2023-01-17", price: 799, category: "Drones", stock: 22 },
    { id: 18, productName: "GoPro HERO9", productId: "HERO9", addedOn: "2023-01-18", price: 399, category: "Cameras", stock: 35 },
    { id: 19, productName: "Apple iPad Pro", productId: "IPADPRO", addedOn: "2023-01-19", price: 1099, category: "Tablets", stock: 28 },
    { id: 20, productName: "Samsung Galaxy Tab S7", productId: "GTS7", addedOn: "2023-01-20", price: 649, category: "Tablets", stock: 33 },
    // Third group (IDs 21-30)
    { id: 21, productName: "Logitech MX Master 3", productId: "MXM3", addedOn: "2023-01-21", price: 99, category: "Accessories", stock: 80 },
    { id: 22, productName: "Razer BlackWidow", productId: "RBW", addedOn: "2023-01-22", price: 129, category: "Accessories", stock: 50 },
    { id: 23, productName: "Asus ROG Strix", productId: "ROGSTRIX", addedOn: "2023-01-23", price: 1499, category: "Computers", stock: 14 },
    { id: 24, productName: "Dell UltraSharp Monitor", productId: "DUM", addedOn: "2023-01-24", price: 399, category: "Accessories", stock: 40 },
    { id: 25, productName: "JBL Charge 4", productId: "JBLCH4", addedOn: "2023-01-25", price: 179, category: "Audio", stock: 65 },
    { id: 26, productName: "Anker PowerCore", productId: "APC", addedOn: "2023-01-26", price: 49, category: "Accessories", stock: 150 },
    { id: 27, productName: "Fitbit Charge 5", productId: "FC5", addedOn: "2023-01-27", price: 129, category: "Wearables", stock: 45 },
    { id: 28, productName: "Google Nest Hub", productId: "GNH", addedOn: "2023-01-28", price: 89, category: "Smart Home", stock: 75 },
    { id: 29, productName: "Apple Watch Series 7", productId: "AWS7", addedOn: "2023-01-29", price: 399, category: "Wearables", stock: 55 },
    { id: 30, productName: "OnePlus 9 Pro", productId: "OP9P", addedOn: "2023-01-30", price: 969, category: "Electronics", stock: 37 },
];

const Products = ({ setSelectedSection }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Filter products based on search query
    const filteredProducts = initialProductsData.filter((product) =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate pagination values
    const totalItems = filteredProducts.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const indexOfLastItem = currentPage * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

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
                <h2 className="text-2xl font-bold mb-2 sm:mb-0">Products Management</h2>
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
                        className="border bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 flex"
                        onClick={() => setSelectedSection('addProduct')}
                    >
                        <img className="w-4 h-4 mr-3 mt-1" src={plus} alt="plus icon" />
                        New
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
                            <th className="py-3 px-4">Products</th>
                            <th className="py-3 px-4">Product ID</th>
                            <th className="py-3 px-4">Added on</th>
                            <th className="py-3 px-4">Price</th>
                            <th className="py-3 px-4">Category</th>
                            <th className="py-3 px-4">Stock</th>
                            <th className="py-3 px-4"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {currentProducts.length > 0 ? (
                            currentProducts.map((product) => (
                                <tr key={product.id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4 flex items-center space-x-2">
                                        <img
                                            src={`https://i.pravatar.cc/40?u=${product.id}`}
                                            alt="product"
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <span>{product.productName}</span>
                                    </td>
                                    <td className="py-3 px-4">{product.productId}</td>
                                    <td className="py-3 px-4">{product.addedOn}</td>
                                    <td className="py-3 px-4">₹ {product.price.toLocaleString()}</td>
                                    <td className="py-3 px-4">{product.category}</td>
                                    <td className="py-3 px-4">{product.stock}</td>
                                    <td className="py-3 px-4">
                                        <button className="text-black px-3 py-1 rounded hover:bg-gray-200">
                                            <img src={editicon} alt="edit" />
                                        </button>
                                        <button className="text-black px-3 py-1 rounded hover:bg-gray-200">
                                            <img src={deleteicon} alt="delete" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="py-4 text-center">
                                    No products found.
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
                            className={`px-3 py-1 rounded ${currentPage === pageNum ? "bg-black text-white" : ""}`}
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

export default Products;

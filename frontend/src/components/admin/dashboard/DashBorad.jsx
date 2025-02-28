import React from "react";
// If using Font Awesome, make sure it's included in your index.html or via npm packages.



function AdminDashboard() {



    return (



        <div className="bg-gray-100 min-h-screen">

            {/* Navbar */}
            <nav className="navbar flex items-center justify-between bg-white px-4 py-3 shadow-sm">
                <div className="flex items-center">
                    {/* Brand */}
                    <a
                        href="#"
                        className="font-bold text-2xl"
                        style={{ color: "#3e29a8" }}
                    >
                        FitBazar
                    </a>
                </div>

                {/* Search Bar */}
                <div className="hidden md:flex items-center space-x-2 mx-auto w-1/2">
                    <input
                        type="search"
                        placeholder="Search"
                        className="flex-grow border border-gray-300 rounded-l px-3 py-2 focus:outline-none"
                    />
                    <button
                        className="px-4 py-2 rounded-r"
                        style={{ backgroundColor: "#3e29a8" }}
                    >
                        <i className="fas fa-search text-white" />
                    </button>
                </div>

                {/* Right Icons */}
                <div className="flex items-center space-x-4">
                    <a href="#" className="relative">
                        <i
                            className="fa-regular fa-bell fa-lg"
                            style={{ color: "#3e29a8" }}
                        />
                    </a>
                    <a href="#" className="text-[#493cd0]">
                        <i className="fa-light fa-circle-user fa-2xl" />
                    </a>
                </div>
            </nav>

            {/* Container: Sidebar + Main Content */}
            <div className="flex">
                {/* Sidebar */}
                <aside
                    className="hidden md:block w-64 bg-white shadow-sm pt-2 h-[90.5vh]"
                    style={{ minWidth: "240px" }}
                >
                    <ul className="mt-3 space-y-2 px-2">
                        <li>
                            <a
                                href="/admin/dashboard"
                                className="block px-4 py-2 text-white rounded admin-btns"
                                style={{
                                    backgroundColor: "#3e29a8",
                                }}
                            >
                                <i className="fas fa-tachometer-alt mr-2" />
                                Dashboard
                            </a>
                        </li>
                        <li>
                            <a href="/admin/orders" className="block px-4 py-2 text-gray-700">
                                <i className="fas fa-box mr-2" />
                                Orders
                            </a>
                        </li>
                        <li>
                            <a href="/admin/products" className="block px-4 py-2 text-gray-700">
                                <i className="fas fa-tags mr-2" />
                                Products
                            </a>
                        </li>
                        <li>
                            <a href="#" className="block px-4 py-2 text-gray-700">
                                <i className="fas fa-user mr-2" />
                                Customers
                            </a>
                        </li>
                        <li>
                            <a href="#" className="block px-4 py-2 text-gray-700">
                                <i className="fas fa-percent mr-2" />
                                Coupons
                            </a>
                        </li>
                        <li>
                            <a href="#" className="block px-4 py-2 text-gray-700">
                                <i className="fas fa-boxes mr-2" />
                                Categories
                            </a>
                        </li>
                        <li>
                            <a href="#" className="block px-4 py-2 text-gray-700">
                                <i className="fas fa-undo mr-2" />
                                Refund/Return
                            </a>
                        </li>
                        <li>
                            <a href="#" className="block px-4 py-2 text-gray-700">
                                <i className="fas fa-chart-line mr-2" />
                                Sales Report
                            </a>
                        </li>
                        <li>
                            <a href="#" className="block px-4 py-2 text-gray-700">
                                <i className="fas fa-sign-out-alt mr-2" />
                                Sign Out
                            </a>
                        </li>
                    </ul>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-8">
                    {/* Cards Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Card 1 */}
                        <div className="bg-white shadow-sm p-3 flex items-center">
                            <div className="p-3 bg-yellow-400 text-white rounded-full">
                                <i className="fas fa-users fa-lg" />
                            </div>
                            <div className="ml-3">
                                <p className="text-gray-500 mb-1 text-sm">Total Clients</p>
                                <h5 className="text-lg font-semibold">6389</h5>
                            </div>
                        </div>
                        {/* Card 2 */}
                        <div className="bg-white shadow-sm p-3 flex items-center">
                            <div className="p-3 bg-green-500 text-white rounded-full">
                                <i className="fas fa-wallet fa-lg" />
                            </div>
                            <div className="ml-3">
                                <p className="text-gray-500 mb-1 text-sm">Account Balance</p>
                                <h5 className="text-lg font-semibold">$46,760.89</h5>
                            </div>
                        </div>
                        {/* Card 3 (duplicate for example) */}
                        <div className="bg-white shadow-sm p-3 flex items-center">
                            <div className="p-3 bg-yellow-400 text-white rounded-full">
                                <i className="fas fa-users fa-lg" />
                            </div>
                            <div className="ml-3">
                                <p className="text-gray-500 mb-1 text-sm">Total Clients</p>
                                <h5 className="text-lg font-semibold">6389</h5>
                            </div>
                        </div>
                        {/* Card 4 (duplicate for example) */}
                        <div className="bg-white shadow-sm p-3 flex items-center">
                            <div className="p-3 bg-green-500 text-white rounded-full">
                                <i className="fas fa-wallet fa-lg" />
                            </div>
                            <div className="ml-3">
                                <p className="text-gray-500 mb-1 text-sm">Account Balance</p>
                                <h5 className="text-lg font-semibold">$46,760.89</h5>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <h4 className="mt-6 text-xl font-semibold">Recent Orders</h4>
                    <div className="bg-white shadow-sm mt-4">
                        <table className="min-w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#3e29a8] text-white">
                                    <th className="px-4 py-3">Order ID</th>
                                    <th className="px-4 py-3">Customer</th>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Amount</th>
                                    <th className="px-4 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-[#f0f8ff] hover:bg-[#e0f0ff]">
                                    <td className="px-4 py-3">#12345</td>
                                    <td className="px-4 py-3">John Doe</td>
                                    <td className="px-4 py-3">2023-10-01</td>
                                    <td className="px-4 py-3">₹1,200</td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm text-white bg-green-500 px-2 py-1 rounded">
                                            Completed
                                        </span>
                                    </td>
                                </tr>
                                <tr className="bg-[#f0f8ff] hover:bg-[#e0f0ff]">
                                    <td className="px-4 py-3">#12346</td>
                                    <td className="px-4 py-3">Jane Smith</td>
                                    <td className="px-4 py-3">2023-10-02</td>
                                    <td className="px-4 py-3">₹2,500</td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm text-white bg-yellow-500 px-2 py-1 rounded">
                                            Pending
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AdminDashboard;

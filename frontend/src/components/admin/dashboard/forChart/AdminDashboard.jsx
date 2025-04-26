

// import React from 'react';
// import { toast } from 'react-toastify';
// import OverviewSection from './OverviewSection';
// import OrdersSection from './OrdersSection';
// import UsersSection from './UsersSection';
// import AnalysisSection from './AnalysisSection';
// import useDashboard from '../../../../hooks/admin/useDashboard';
// import { LoadingDots, LoadingSpinner, PulseRingLoader } from '../../../common/loading/Spinner';

// // Main Dashboard Component
// const Dashboard = () => {

//     const {
//         dashboardData,
//         timeFilter,
//         setTimeFilter,
//         yearFilter,
//         setYearFilter,
//         monthFilter,
//         setMonthFilter,
//         customDateRange,
//         handleDateRangeChange,
//         fetchDashboardData,
//         loading,
//         error,
//         activeSection,
//         setActiveSection,
//         formatCurrency,
//         years,
//         months
//     } = useDashboard();

//     if (loading) {
//         return <PulseRingLoader />;
//     }

//     if (error && !dashboardData.charts.orders.length) {
//         return <div className="p-6 bg-gray-50 w-full min-h-screen flex items-center justify-center text-red-500">{error}</div>;
//     }

//     return (
//         <div className="p-4 md:p-6 bg-gray-50 w-full min-h-screen">
//             <div className="flex flex-col mb-6">
//                 <h1 className="text-xl md:text-2xl font-bold mb-4">Admin Dashboard</h1>
//                 <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:flex-wrap md:gap-2">
//                     <select
//                         value={timeFilter}
//                         onChange={(e) => setTimeFilter(e.target.value)}
//                         className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black w-full md:w-auto"
//                     >
//                         <option value="yearly">Yearly</option>
//                         <option value="monthly">Monthly</option>
//                         <option value="weekly">Weekly</option>
//                         <option value="custom">Custom Range</option>
//                     </select>
//                     {timeFilter === 'yearly' && (
//                         <select
//                             value={yearFilter}
//                             onChange={(e) => setYearFilter(e.target.value)}
//                             className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black w-full md:w-auto"
//                         >
//                             {years.map(year => <option key={year} value={year}>{year}</option>)}
//                         </select>
//                     )}
//                     {timeFilter === 'monthly' && (
//                         <>
//                             <select
//                                 value={monthFilter}
//                                 onChange={(e) => setMonthFilter(e.target.value)}
//                                 className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black w-full md:w-auto"
//                             >
//                                 {months.map((month, index) => <option key={month} value={index + 1}>{month}</option>)}
//                             </select>
//                             <select
//                                 value={yearFilter}
//                                 onChange={(e) => setYearFilter(e.target.value)}
//                                 className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black w-full md:w-auto"
//                             >
//                                 {years.map(year => <option key={year} value={year}>{year}</option>)}
//                             </select>
//                         </>
//                     )}
//                     {timeFilter === 'custom' && (
//                         <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
//                             <input
//                                 type="date"
//                                 name="start"
//                                 value={customDateRange.start}
//                                 onChange={handleDateRangeChange}
//                                 className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
//                             />
//                             <span className="self-center text-center">to</span>
//                             <input
//                                 type="date"
//                                 name="end"
//                                 value={customDateRange.end}
//                                 onChange={handleDateRangeChange}
//                                 className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
//                             />
//                             <button
//                                 onClick={fetchDashboardData}
//                                 className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
//                             >
//                                 Apply
//                             </button>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {dashboardData && (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-6">
//                     <div className="bg-white rounded-lg shadow p-4 md:p-6">
//                         <div className="text-sm font-medium text-gray-500 mb-1">Total Orders</div>
//                         <div className="text-xl md:text-2xl font-bold">{dashboardData.summary.totalOrders.toLocaleString()}</div>
//                         <div className="text-sm text-green-600 mt-2">↑ 12% from previous period</div>
//                     </div>
//                     <div className="bg-white rounded-lg shadow p-4 md:p-6">
//                         <div className="text-sm font-medium text-gray-500 mb-1">Total Revenue</div>
//                         <div className="text-xl md:text-2xl font-bold">{formatCurrency(dashboardData.summary.totalRevenue)}</div>
//                         <div className="text-sm text-green-600 mt-2">↑ 8% from previous period</div>
//                     </div>
//                     <div className="bg-white rounded-lg shadow p-4 md:p-6">
//                         <div className="text-sm font-medium text-gray-500 mb-1">Total Users</div>
//                         <div className="text-xl md:text-2xl font-bold">{dashboardData.summary.totalUsers.toLocaleString()}</div>
//                         <div className="text-sm text-green-600 mt-2">↑ 15% from previous period</div>
//                     </div>
//                     <div className="bg-white rounded-lg shadow p-4 md:p-6">
//                         <div className="text-sm font-medium text-gray-500 mb-1">Total Sellers</div>
//                         <div className="text-xl md:text-2xl font-bold">{dashboardData.summary.totalSellers.toLocaleString()}</div>
//                         <div className="text-sm text-green-600 mt-2">↑ 5% from previous period</div>
//                     </div>
//                     <div className="bg-white rounded-lg shadow p-4 md:p-6">
//                         <div className="text-sm font-medium text-gray-500 mb-1">Pending Orders</div>
//                         <div className="text-xl md:text-2xl font-bold">{dashboardData.summary.pendingOrders.toLocaleString()}</div>
//                         <div className="text-sm text-yellow-600 mt-2">↑ 3% from previous period</div>
//                     </div>
//                 </div>
//             )}

//             <div className="flex overflow-x-auto border-b border-gray-200 mb-6 pb-1">
//                 <button
//                     className={`py-2 md:py-3 px-3 md:px-6 whitespace-nowrap ${activeSection === 'overview' ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
//                     onClick={() => setActiveSection('overview')}
//                 >
//                     Overview
//                 </button>
//                 <button
//                     className={`py-2 md:py-3 px-3 md:px-6 whitespace-nowrap ${activeSection === 'orders' ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
//                     onClick={() => setActiveSection('orders')}
//                 >
//                     Orders
//                 </button>
//                 <button
//                     className={`py-2 md:py-3 px-3 md:px-6 whitespace-nowrap ${activeSection === 'users' ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
//                     onClick={() => toast.error("Currently not working")}
//                 >
//                     Users & Sellers
//                 </button>
//                 <button
//                     className={`py-2 md:py-3 px-3 md:px-6 whitespace-nowrap ${activeSection === 'products' ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
//                     onClick={() => setActiveSection('products')}
//                 >
//                     Products
//                 </button>
//                 <button
//                     className={`py-2 md:py-3 px-3 md:px-6 whitespace-nowrap ${activeSection === 'category' ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
//                     onClick={() => setActiveSection('category')}
//                 >
//                     Categories
//                 </button>
//             </div>

//             {activeSection === 'overview' && dashboardData && <OverviewSection dashboardData={dashboardData} formatCurrency={formatCurrency} />}
//             {activeSection === 'orders' && dashboardData && <OrdersSection dashboardData={dashboardData} formatCurrency={formatCurrency} />}
//             {activeSection === 'users' && dashboardData && <UsersSection dashboardData={dashboardData} />}
//             {activeSection === 'products' && dashboardData && (
//                 <AnalysisSection
//                     title="Products Analysis"
//                     data={dashboardData.topProducts}
//                     entityName="Product"
//                     formatCurrency={formatCurrency}
//                 />
//             )}
//             {activeSection === 'category' && dashboardData && (
//                 <AnalysisSection
//                     title="Category Analysis"
//                     data={dashboardData.topCategorys}
//                     entityName="Category"
//                     formatCurrency={formatCurrency}
//                 />
//             )}

//             <div className="mt-6 text-center text-sm text-gray-500">
//                 <div>Last updated: {new Date().toLocaleString()}</div>
//             </div>
//         </div>
//     );
// };

// export default Dashboard;








import React from 'react';
import { toast } from 'react-toastify';
import OverviewSection from './OverviewSection';
import OrdersSection from './OrdersSection';
import UsersSection from './UsersSection';
import AnalysisSection from './AnalysisSection';
import useDashboard from '../../../../hooks/admin/useDashboard';
import { LoadingDots, LoadingSpinner, PulseRingLoader } from '../../../common/loading/Spinner';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parseISO, format, isValid } from 'date-fns';

// Main Dashboard Component
const Dashboard = () => {
    const {
        dashboardData,
        timeFilter,
        setTimeFilter,
        yearFilter,
        setYearFilter,
        monthFilter,
        setMonthFilter,
        customDateRange,
        setCustomDateRange,
        fetchDashboardData,
        loading,
        error,
        activeSection,
        setActiveSection,
        formatCurrency,
        years,
        months,
    } = useDashboard();

    // Get today's date
    const today = new Date();

    // Convert string dates to Date objects for DatePicker
    const startDate = customDateRange.start ? parseISO(customDateRange.start) : null;
    const endDate = customDateRange.end ? parseISO(customDateRange.end) : null;

    // Handle start date change
    const handleStartDateChange = (date) => {
        if (isValid(date)) {
            const formattedDate = format(date, 'yyyy-MM-dd');
            setCustomDateRange((prev) => ({
                ...prev,
                start: formattedDate,
                end: endDate && date > endDate ? '' : prev.end, // Reset end date if it's before the new start date
            }));
        } else {
            setCustomDateRange((prev) => ({ ...prev, start: '' }));
        }
    };

    // Handle end date change
    const handleEndDateChange = (date) => {
        if (isValid(date)) {
            const formattedDate = format(date, 'yyyy-MM-dd');
            setCustomDateRange((prev) => ({ ...prev, end: formattedDate }));
        } else {
            setCustomDateRange((prev) => ({ ...prev, end: '' }));
        }
    };

    if (loading) {
        return <PulseRingLoader />;
    }

    if (error && !dashboardData.charts.orders.length) {
        return <div className="p-6 bg-gray-50 w-full min-h-screen flex items-center justify-center text-red-500">{error}</div>;
    }

    return (
        <div className="p-4 md:p-6 bg-gray-50 w-full min-h-screen">
            <div className="flex flex-col mb-6">
                <h1 className="text-xl md:text-2xl font-bold mb-4">Admin Dashboard</h1>
                <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:flex-wrap md:gap-2">
                    <select
                        value={timeFilter}
                        onChange={(e) => setTimeFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black w-full md:w-auto"
                    >
                        <option value="yearly">Yearly</option>
                        <option value="monthly">Monthly</option>
                        <option value="weekly">Weekly</option>
                        <option value="custom">Custom Range</option>
                    </select>
                    {timeFilter === 'yearly' && (
                        <select
                            value={yearFilter}
                            onChange={(e) => setYearFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black w-full md:w-auto"
                        >
                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    )}
                    {timeFilter === 'monthly' && (
                        <>
                            <select
                                value={monthFilter}
                                onChange={(e) => setMonthFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black w-full md:w-auto"
                            >
                                {months.map((month, index) => (
                                    <option key={month} value={index + 1}>
                                        {month}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={yearFilter}
                                onChange={(e) => setYearFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black w-full md:w-auto"
                            >
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}
                    {timeFilter === 'custom' && (
                        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto items-center">
                            <div>
                                <label className="block text-sm text-gray-700">Start Date</label>
                                <DatePicker
                                    selected={startDate}
                                    onChange={handleStartDateChange}
                                    maxDate={today} // Restrict to today or earlier
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText="Select start date"
                                    className="mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black w-full"
                                    isClearable
                                />
                            </div>
                            <span className="self-center text-center">to</span>
                            <div>
                                <label className="block text-sm text-gray-700">End Date</label>
                                <DatePicker
                                    selected={endDate}
                                    onChange={handleEndDateChange}
                                    minDate={startDate} // Restrict to start date or later
                                    maxDate={today} // Restrict to today or earlier
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText="Select end date"
                                    className="mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black w-full"
                                    disabled={!startDate} // Disable until start date is selected
                                    isClearable
                                />
                            </div>
                            <button
                                onClick={fetchDashboardData}
                                className="mt-6 md:mt-0 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                                disabled={!customDateRange.start || !customDateRange.end} // Disable until both dates are selected
                            >
                                Apply
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {dashboardData && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow p-4 md:p-6">
                        <div className="text-sm font-medium text-gray-500 mb-1">Total Orders</div>
                        <div className="text-xl md:text-2xl font-bold">{dashboardData.summary.totalOrders.toLocaleString()}</div>
                        <div className="text-sm text-green-600 mt-2">↑ 12% from previous period</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 md:p-6">
                        <div className="text-sm font-medium text-gray-500 mb-1">Total Revenue</div>
                        <div className="text-xl md:text-2xl font-bold">{formatCurrency(dashboardData.summary.totalRevenue)}</div>
                        <div className="text-sm text-green-600 mt-2">↑ 8% from previous period</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 md:p-6">
                        <div className="text-sm font-medium text-gray-500 mb-1">Total Users</div>
                        <div className="text-xl md:text-2xl font-bold">{dashboardData.summary.totalUsers.toLocaleString()}</div>
                        <div className="text-sm text-green-600 mt-2">↑ 15% from previous period</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 md:p-6">
                        <div className="text-sm font-medium text-gray-500 mb-1">Total Sellers</div>
                        <div className="text-xl md:text-2xl font-bold">{dashboardData.summary.totalSellers.toLocaleString()}</div>
                        <div className="text-sm text-green-600 mt-2">↑ 5% from previous period</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 md:p-6">
                        <div className="text-sm font-medium text-gray-500 mb-1">Pending Orders</div>
                        <div className="text-xl md:text-2xl font-bold">{dashboardData.summary.pendingOrders.toLocaleString()}</div>
                        <div className="text-sm text-yellow-600 mt-2">↑ 3% from previous period</div>
                    </div>
                </div>
            )}

            <div className="flex overflow-x-auto border-b border-gray-200 mb-6 pb-1">
                <button
                    className={`py-2 md:py-3 px-3 md:px-6 whitespace-nowrap ${activeSection === 'overview' ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
                    onClick={() => setActiveSection('overview')}
                >
                    Overview
                </button>
                <button
                    className={`py-2 md:py-3 px-3 md:px-6 whitespace-nowrap ${activeSection === 'orders' ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
                    onClick={() => setActiveSection('orders')}
                >
                    Orders
                </button>
                <button
                    className={`py-2 md:py-3 px-3 md:px-6 whitespace-nowrap ${activeSection === 'users' ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
                    onClick={() => toast.error('Currently not working')}
                >
                    Users & Sellers
                </button>
                <button
                    className={`py-2 md:py-3 px-3 md:px-6 whitespace-nowrap ${activeSection === 'products' ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
                    onClick={() => setActiveSection('products')}
                >
                    Products
                </button>
                <button
                    className={`py-2 md:py-3 px-3 md:px-6 whitespace-nowrap ${activeSection === 'category' ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
                    onClick={() => setActiveSection('category')}
                >
                    Categories
                </button>
            </div>

            {activeSection === 'overview' && dashboardData && <OverviewSection dashboardData={dashboardData} formatCurrency={formatCurrency} />}
            {activeSection === 'orders' && dashboardData && <OrdersSection dashboardData={dashboardData} formatCurrency={formatCurrency} />}
            {activeSection === 'users' && dashboardData && <UsersSection dashboardData={dashboardData} />}
            {activeSection === 'products' && dashboardData && (
                <AnalysisSection
                    title="Products Analysis"
                    data={dashboardData.topProducts}
                    entityName="Product"
                    formatCurrency={formatCurrency}
                />
            )}
            {activeSection === 'category' && dashboardData && (
                <AnalysisSection
                    title="Category Analysis"
                    data={dashboardData.topCategorys}
                    entityName="Category"
                    formatCurrency={formatCurrency}
                />
            )}

            <div className="mt-6 text-center text-sm text-gray-500">
                <div>Last updated: {new Date().toLocaleString()}</div>
            </div>
        </div>
    );
};

export default Dashboard;




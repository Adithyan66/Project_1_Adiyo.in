


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ResponsiveLine } from '@nivo/line';
import {
    ResponsiveContainer,
    LineChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell
} from 'recharts';

import httpClient from '../../../../services/httpClient';
import NavbarTwo from '../../../common/NavbarTwo';
import Footer from '../../../common/Footer';
import CustomerRightSection from '../../forCustomers/CustomerRightSection';
import DashBoard from '../../DashBorad';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { toast } from 'react-toastify';
import { getDashboartData } from '../../../../services/adminDashboardServices';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const OrdersTrendChart = ({ ordersData }) => (
    <div style={{ height: 300 }}>
        <ResponsiveLine
            data={ordersData}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{
                type: 'linear',
                min: 'auto',
                max: 'auto',
                stacked: true,
                reverse: false
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                orient: 'bottom',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Time Period',
                legendOffset: 36,
                legendPosition: 'middle'
            }}
            axisLeft={{
                orient: 'left',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Orders',
                legendOffset: -40,
                legendPosition: 'middle'
            }}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabel="y"
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
                {
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: 'left-to-right',
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: 'circle',
                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemBackground: 'rgba(0, 0, 0, .03)',
                                itemOpacity: 1
                            }
                        }
                    ]
                }
            ]}
        />
    </div>
);


const Dashboard = () => {


    const [dashboardData, setDashboardData] = useState({
        summary: {
            totalOrders: 0,
            totalRevenue: 0,
            totalUsers: 0,
            totalSellers: 0,
            pendingOrders: 0
        },
        charts: {
            orders: [],
            revenue: [],
            users: [],
            sellers: []
        },
        topProducts: [],
        topCategorys: [],
        orderStatuses: [],
        geoDistribution: []
    });

    const [timeFilter, setTimeFilter] = useState('monthly');
    const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
    const [monthFilter, setMonthFilter] = useState(new Date().getMonth() + 1);
    const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState('overview');

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
    const months = [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
    ];

    useEffect(() => {
        fetchDashboardData();
    }, [timeFilter, yearFilter, monthFilter, customDateRange]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                timeFilter,
                year: yearFilter,
                ...(timeFilter === 'monthly' && { month: monthFilter }),
                ...(timeFilter === 'custom' && {
                    startDate: customDateRange.start,
                    endDate: customDateRange.end
                })
            });
            console.log("Fetching dashboard data with params:", params.toString());

            // const response = await httpClient.get(`admin/dashboard?${params}`)
            // const response = await axios.get(`${API_BASE_URL}/admin/dashboard?${params}`, { withCredentials: true });
            const response = await getDashboartData(params)
            console.log("Dashboard Data:", response.data);

            setDashboardData(response.data.data);
            setError(null);

        } catch (err) {

            console.error("Error fetching dashboard data:", err);
            setError("Failed to fetch dashboard data. Please try again later.");
        } finally {

            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const handleDateRangeChange = (e) => {
        const { name, value } = e.target;
        setCustomDateRange(prev => ({ ...prev, [name]: value }));
    };

    if (error && !dashboardData.charts.orders.length) {
        return (

            <div className="p-6 bg-gray-50 w-full min-h-screen">
                {/* Header */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold mb-4 lg:mb-0">Admin Dashboard</h1>
                    {/* Time filters */}
                    <div className="flex flex-wrap gap-2">
                        <select
                            value={timeFilter}
                            onChange={(e) => setTimeFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
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
                                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                            >
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        )}
                        {timeFilter === 'monthly' && (
                            <>
                                <select
                                    value={monthFilter}
                                    onChange={(e) => setMonthFilter(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                                >
                                    {months.map((month, index) => (
                                        <option key={month} value={index + 1}>{month}</option>
                                    ))}
                                </select>
                                <select
                                    value={yearFilter}
                                    onChange={(e) => setYearFilter(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                                >
                                    {years.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </>
                        )}
                        {timeFilter === 'custom' && (
                            <div className="flex gap-2">
                                <input
                                    type="date"
                                    name="start"
                                    value={customDateRange.start}
                                    onChange={handleDateRangeChange}
                                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                                />
                                <span className="self-center">to</span>
                                <input
                                    type="date"
                                    name="end"
                                    value={customDateRange.end}
                                    onChange={handleDateRangeChange}
                                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                                />
                                <button
                                    onClick={fetchDashboardData}
                                    className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                                >
                                    Apply
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="p-6 bg-gray-50 w-full min-h-screen flex items-center justify-center text-red-500">
                    {error}
                </div>
            </div>

        );
    }

    const ordersDataForNivo = [
        {
            id: 'Orders',
            data: dashboardData.charts.orders.map(item => ({
                x: item.name,
                y: item.value
            }))
        }
    ]

    // Define COLORS for Pie Chart cells
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    return (
        <div className="p-6 bg-gray-50 w-full min-h-screen">
            {/* Header */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
                <h1 className="text-2xl font-bold mb-4 lg:mb-0">Admin Dashboard</h1>
                {/* Time filters */}
                <div className="flex flex-wrap gap-2">
                    <select
                        value={timeFilter}
                        onChange={(e) => setTimeFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
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
                            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                        >
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    )}
                    {timeFilter === 'monthly' && (
                        <>
                            <select
                                value={monthFilter}
                                onChange={(e) => setMonthFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                            >
                                {months.map((month, index) => (
                                    <option key={month} value={index + 1}>{month}</option>
                                ))}
                            </select>
                            <select
                                value={yearFilter}
                                onChange={(e) => setYearFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                            >
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </>
                    )}
                    {timeFilter === 'custom' && (
                        <div className="flex gap-2">
                            <input
                                type="date"
                                name="start"
                                value={customDateRange.start}
                                onChange={handleDateRangeChange}
                                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                            />
                            <span className="self-center">to</span>
                            <input
                                type="date"
                                name="end"
                                value={customDateRange.end}
                                onChange={handleDateRangeChange}
                                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                            />
                            <button
                                onClick={fetchDashboardData}
                                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                            >
                                Apply
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Summary Cards */}
            {dashboardData && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm font-medium text-gray-500 mb-1">Total Orders</div>
                    <div className="text-2xl font-bold">{dashboardData.summary.totalOrders.toLocaleString()}</div>
                    <div className="text-sm text-green-600 mt-2">↑ 12% from previous period</div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm font-medium text-gray-500 mb-1">Total Revenue</div>
                    <div className="text-2xl font-bold">{formatCurrency(dashboardData.summary.totalRevenue)}</div>
                    <div className="text-sm text-green-600 mt-2">↑ 8% from previous period</div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm font-medium text-gray-500 mb-1">Total Users</div>
                    <div className="text-2xl font-bold">{dashboardData.summary.totalUsers.toLocaleString()}</div>
                    <div className="text-sm text-green-600 mt-2">↑ 15% from previous period</div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm font-medium text-gray-500 mb-1">Total Sellers</div>
                    <div className="text-2xl font-bold">{dashboardData.summary.totalSellers.toLocaleString()}</div>
                    <div className="text-sm text-green-600 mt-2">↑ 5% from previous period</div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm font-medium text-gray-500 mb-1">Pending Orders</div>
                    <div className="text-2xl font-bold">{dashboardData.summary.pendingOrders.toLocaleString()}</div>
                    <div className="text-sm text-yellow-600 mt-2">↑ 3% from previous period</div>
                </div>
            </div>
            }

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    className={`py-3 px-6 ${activeSection === 'overview' ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
                    onClick={() => setActiveSection('overview')}
                >
                    Overview
                </button>
                <button
                    className={`py-3 px-6 ${activeSection === 'orders' ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
                    onClick={() => setActiveSection('orders')}
                >
                    Orders
                </button>
                <button
                    className={`py-3 px-6 ${activeSection === 'users' ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
                    onClick={() => toast.error("currently not working")}
                // onClick={() => setActiveSection('users')}
                >
                    Users & Sellers
                </button>
                <button
                    className={`py-3 px-6 ${activeSection === 'products' ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
                    onClick={() => setActiveSection('products')}
                >
                    Products
                </button>
                <button
                    className={`py-3 px-6 ${activeSection === 'catagory' ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
                    onClick={() => setActiveSection('catagory')}
                >
                    catagories
                </button>
            </div>

            {/* Overview Section */}
            {activeSection === 'overview' && dashboardData && (
                <>
                    {/* Main Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Orders Trend - using Nivo */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold mb-4">Orders Trend</h2>
                            <OrdersTrendChart ordersData={ordersDataForNivo} />
                        </div>

                        {/* Revenue Trend */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold mb-4">Revenue Trend</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart
                                    data={dashboardData.charts.revenue}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Legend />
                                    <Area type="monotone" dataKey="value" stroke="#82ca9d" fill="#82ca9d" name="Revenue" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* User Registrations */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold mb-4">User Registrations</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={dashboardData.charts.users}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value" name="Users" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Seller Registrations */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold mb-4">Seller Registrations</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={dashboardData.charts.sellers}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value" name="Sellers" fill="#FF8042" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Secondary Charts and Tables */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Order Status Distribution */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold mb-4">Order Status Distribution</h2>
                            <div className="flex justify-center">
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={dashboardData.orderStatuses}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                            nameKey="name"
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {dashboardData.orderStatuses.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value, name) => [value, name]} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Geographic Distribution */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold mb-4">Geographic Distribution</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    layout="vertical"
                                    data={dashboardData.geoDistribution}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value" name="Orders" fill="#0088FE" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            )}

            {/* Orders Section */}
            {activeSection === 'orders' && dashboardData && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-6">Orders Analysis</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Orders Over Time */}
                        {/* <div>
                            <h3 className="text-md font-medium mb-4">Orders Over Time</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart
                                    data={dashboardData.charts.orders}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="value" stroke="#0088FE" name="Orders" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div> */}
                        <OrdersTrendChart ordersData={ordersDataForNivo} />

                        {/* Order Status Distribution */}
                        <div>
                            <h3 className="text-md font-medium mb-4">Order Status Distribution</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={dashboardData.orderStatuses}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                        nameKey="name"
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {dashboardData.orderStatuses.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value, name) => [value, name]} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="mt-6">
                        <h3 className="text-md font-medium mb-4">Revenue by Time Period</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={dashboardData.charts.revenue}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                                <Legend />
                                <Bar dataKey="value" name="Revenue" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Users Section */}
            {activeSection === 'users' && dashboardData && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-6">Users & Sellers Analysis</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* User Registrations */}
                        <div>
                            <h3 className="text-md font-medium mb-4">User Registrations</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart
                                    data={dashboardData.charts.users}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Area type="monotone" dataKey="value" name="Users" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Seller Registrations */}
                        <div>
                            <h3 className="text-md font-medium mb-4">Seller Registrations</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart
                                    data={dashboardData.charts.sellers}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Area type="monotone" dataKey="value" name="Sellers" stroke="#FF8042" fill="#FF8042" fillOpacity={0.6} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="mt-6">
                        <h3 className="text-md font-medium mb-4">User vs Seller Growth Comparison</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart
                                data={dashboardData.charts.users.map((item, index) => ({
                                    name: item.name,
                                    users: item.value,
                                    sellers: dashboardData.charts.sellers[index]?.value || 0
                                }))}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="users" name="Users" stroke="#8884d8" activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="sellers" name="Sellers" stroke="#FF8042" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Products Section */}
            {activeSection === 'products' && dashboardData && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-6">Products Analysis</h2>
                    {/* Top Products */}
                    <div className="mb-6">
                        <h3 className="text-md font-medium mb-4">Top Selling Products</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Product Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Units Sold
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Revenue
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {dashboardData.topProducts.map((product, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {product.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {product.sales.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatCurrency(product.revenue)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* Product Sales Visualization */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-md font-medium mb-4">Top 5 Products by Sales</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={dashboardData.topProducts}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="sales" name="Units Sold" fill="#0088FE" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div>
                            <h3 className="text-md font-medium mb-4">Top 5 Products by Revenue</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={dashboardData.topProducts}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Legend />
                                    <Bar dataKey="revenue" name="Revenue" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {activeSection === 'catagory' && dashboardData && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-6">Category Analysis</h2>
                    {/* Top Products */}
                    <div className="mb-6">
                        <h3 className="text-md font-medium mb-4">Top Selling Categorys</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            category Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Units Sold
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Revenue
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {dashboardData.topCategorys.map((product, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {product.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {product.sales.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatCurrency(product.revenue)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* Product Sales Visualization */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-md font-medium mb-4">Top 5 categories by Sales</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={dashboardData.topCategorys}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="sales" name="Units Sold" fill="#0088FE" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div>
                            <h3 className="text-md font-medium mb-4">Top 5 Categories by Revenue</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={dashboardData.topCategorys}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Legend />
                                    <Bar dataKey="revenue" name="Revenue" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="mt-6 text-center text-sm text-gray-500">

                <div>Last updated: {new Date().toLocaleString()}</div>
            </div>
        </div>
    );
};

export default Dashboard;



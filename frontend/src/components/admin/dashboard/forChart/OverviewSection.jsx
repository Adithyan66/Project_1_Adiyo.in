import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell, Area } from 'recharts';
import OrdersTrendChart from './OrdersTrendChart';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const OverviewSection = ({ dashboardData, formatCurrency }) => {
    const ordersDataForNivo = [{
        id: 'Orders',
        data: dashboardData.charts.orders.map(item => ({ x: item.name, y: item.value }))
    }];

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Orders Trend</h2>
                    <OrdersTrendChart ordersData={ordersDataForNivo} />
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Revenue Trend</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={dashboardData.charts.revenue} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={formatCurrency} />
                            <Legend />
                            <Area type="monotone" dataKey="value" stroke="#82ca9d" fill="#82ca9d" name="Revenue" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">User Registrations</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dashboardData.charts.users} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" name="Users" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Seller Registrations</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dashboardData.charts.sellers} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Geographic Distribution</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart layout="vertical" data={dashboardData.geoDistribution} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
    );
};

OverviewSection.propTypes = {
    dashboardData: PropTypes.shape({
        charts: PropTypes.shape({
            orders: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired, value: PropTypes.number.isRequired })).isRequired,
            revenue: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired, value: PropTypes.number.isRequired })).isRequired,
            users: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired, value: PropTypes.number.isRequired })).isRequired,
            sellers: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired, value: PropTypes.number.isRequired })).isRequired
        }).isRequired,
        orderStatuses: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired, value: PropTypes.number.isRequired })).isRequired,
        geoDistribution: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired, value: PropTypes.number.isRequired })).isRequired
    }).isRequired,
    formatCurrency: PropTypes.func.isRequired
};

export default OverviewSection;
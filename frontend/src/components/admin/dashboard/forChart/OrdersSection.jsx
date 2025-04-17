import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import OrdersTrendChart from './OrdersTrendChart';

// Colors for Pie Chart cells
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// Orders Section Component
const OrdersSection = ({ dashboardData, formatCurrency }) => {
    const ordersDataForNivo = [{
        id: 'Orders',
        data: dashboardData.charts.orders.map(item => ({ x: item.name, y: item.value }))
    }];

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-6">Orders Analysis</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <OrdersTrendChart ordersData={ordersDataForNivo} />
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
                    <BarChart data={dashboardData.charts.revenue} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={formatCurrency} />
                        <Legend />
                        <Bar dataKey="value" name="Revenue" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

OrdersSection.propTypes = {
    dashboardData: PropTypes.shape({
        charts: PropTypes.shape({
            orders: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired, value: PropTypes.number.isRequired })).isRequired,
            revenue: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired, value: PropTypes.number.isRequired })).isRequired
        }).isRequired,
        orderStatuses: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired, value: PropTypes.number.isRequired })).isRequired
    }).isRequired,
    formatCurrency: PropTypes.func.isRequired
};

export default OrdersSection;
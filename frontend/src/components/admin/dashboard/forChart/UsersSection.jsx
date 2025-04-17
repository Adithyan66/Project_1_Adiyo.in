import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, AreaChart, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

// Users Section Component
const UsersSection = ({ dashboardData }) => (
    <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-6">Users & Sellers Analysis</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
                <h3 className="text-md font-medium mb-4">User Registrations</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={dashboardData.charts.users} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="value" name="Users" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            <div>
                <h3 className="text-md font-medium mb-4">Seller Registrations</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={dashboardData.charts.sellers} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
);

UsersSection.propTypes = {
    dashboardData: PropTypes.shape({
        charts: PropTypes.shape({
            users: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired, value: PropTypes.number.isRequired })).isRequired,
            sellers: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired, value: PropTypes.number.isRequired })).isRequired
        }).isRequired
    }).isRequired
};

export default UsersSection;
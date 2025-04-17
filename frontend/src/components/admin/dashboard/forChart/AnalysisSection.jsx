import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

// Analysis Section Component (Reusable for Products and Categories)
const AnalysisSection = ({ title, data, entityName, formatCurrency }) => (
    <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-6">{title}</h2>
        <div className="mb-6">
            <h3 className="text-md font-medium mb-4">Top Selling {entityName}s</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{entityName} Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units Sold</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.sales.toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(item.revenue)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
                <h3 className="text-md font-medium mb-4">Top 5 {entityName}s by Sales</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                <h3 className="text-md font-medium mb-4">Top 5 {entityName}s by Revenue</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={formatCurrency} />
                        <Legend />
                        <Bar dataKey="revenue" name="Revenue" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
);

AnalysisSection.propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            sales: PropTypes.number.isRequired,
            revenue: PropTypes.number.isRequired
        })
    ).isRequired,
    entityName: PropTypes.string.isRequired,
    formatCurrency: PropTypes.func.isRequired
};

export default AnalysisSection;
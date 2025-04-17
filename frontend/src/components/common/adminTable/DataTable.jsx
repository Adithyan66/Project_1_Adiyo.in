import React from 'react';
import PropTypes from 'prop-types';

// Reusable DataTable Component
const DataTable = ({ columns, data, sortBy, sortOrder, onSort, onRowClick, actions = [] }) => {
    return (
        <div className="bg-white rounded shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.field}
                                className={`px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider ${column.sortable ? 'cursor-pointer' : ''
                                    }`}
                                onClick={() => column.sortable && onSort(column.field)}
                            >
                                {column.header}
                                {column.sortable && sortBy === column.field && (
                                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                )}
                            </th>
                        ))}
                        {actions.length > 0 && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.length > 0 ? (
                        data.map((item, index) => (
                            <tr
                                key={item._id || index}
                                className="hover:bg-gray-50"
                                onClick={() => onRowClick && onRowClick(item)}
                            >
                                {columns.map((column) => (
                                    <td key={column.field} className="px-6 py-4 whitespace-nowrap">
                                        {column.render ? (
                                            column.render(item)
                                        ) : (
                                            <div className="text-sm text-gray-900">
                                                {item[column.field] || '-'}
                                            </div>
                                        )}
                                    </td>
                                ))}
                                {actions.length > 0 && (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        {actions.map((action, idx) => (
                                            (!action.condition || action.condition(item)) && (
                                                <button
                                                    key={idx}
                                                    className={action.className}
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent row click
                                                        action.handler(item);
                                                    }}
                                                >
                                                    {action.label}
                                                </button>
                                            )
                                        ))}
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                                className="px-6 py-4 text-center text-sm text-gray-500"
                            >
                                No data found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

DataTable.propTypes = {
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            header: PropTypes.string.isRequired,
            field: PropTypes.string.isRequired,
            sortable: PropTypes.bool,
            render: PropTypes.func,
        })
    ).isRequired,
    data: PropTypes.array.isRequired,
    sortBy: PropTypes.string,
    sortOrder: PropTypes.oneOf(['asc', 'desc']),
    onSort: PropTypes.func,
    onRowClick: PropTypes.func,
    actions: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            className: PropTypes.string.isRequired,
            handler: PropTypes.func.isRequired,
            condition: PropTypes.func,
        })
    ),
};

export default DataTable;
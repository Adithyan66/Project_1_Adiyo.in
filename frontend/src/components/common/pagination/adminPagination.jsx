import React from 'react';
import PropTypes from 'prop-types';

const AdminPagination = ({ currentPage, setCurrentPage, pageSize, setPageSize, totalItems, pageSizeOptions }) => {
    const totalPages = Math.ceil(totalItems / pageSize);

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
    };

    const getPageNumbers = () => {
        const pages = [];
        let startPage, endPage;

        if (totalPages <= 5) {
            startPage = 1;
            endPage = totalPages;
        } else if (currentPage <= 3) {
            startPage = 1;
            endPage = 5;
        } else if (currentPage >= totalPages - 2) {
            startPage = totalPages - 4;
            endPage = totalPages;
        } else {
            startPage = currentPage - 2;
            endPage = currentPage + 2;
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    return (
        <div className="flex flex-col sm:flex-row sm:justify-between items-center mt-4 gap-2">
            <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                <span className="font-medium">{Math.min(currentPage * pageSize, totalItems)}</span> of{' '}
                <span className="font-medium">{totalItems}</span> results
            </div>
            <div className="flex items-center space-x-2">
                <select
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    className="border rounded p-1 text-sm"
                >
                    {pageSizeOptions.map((size) => (
                        <option key={size} value={size}>
                            {size} per page
                        </option>
                    ))}
                </select>
                <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded disabled:opacity-50"
                >
                    &lt;
                </button>
                {getPageNumbers().map((pageNumber) => (
                    <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`px-3 py-1 rounded ${currentPage === pageNumber ? 'bg-black text-white' : 'bg-gray-100'
                            }`}
                    >
                        {pageNumber}
                    </button>
                ))}
                <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded disabled:opacity-50"
                >
                    &gt;
                </button>
            </div>
        </div>
    );
};

AdminPagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    setCurrentPage: PropTypes.func.isRequired,
    pageSize: PropTypes.number.isRequired,
    setPageSize: PropTypes.func.isRequired,
    totalItems: PropTypes.number.isRequired,
    pageSizeOptions: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default AdminPagination;
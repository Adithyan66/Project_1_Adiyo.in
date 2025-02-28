// src/components/Pagination.js
import React from "react";

function Pagination({
    currentPage,
    totalPages,
    goToPreviousPage,
    goToNextPage,
}) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex flex-col items-center mt-6">
            <hr className="w-full border-t border-gray-300 my-14" />
            <div className="flex items-center space-x-4">
                <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                    Prev
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>

    );
}

export default Pagination;

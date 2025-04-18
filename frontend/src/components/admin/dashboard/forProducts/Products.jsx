


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setEditProductID } from '../../../../store/slices/sellerSideSelectedSlice';
import useProducts from '../../../../hooks/admin/useProducts';
import DataTable from '../../../common/adminTable/DataTable';
import AdminPagination from '../../../common/pagination/adminPagination';
import { PulseRingLoader } from '../../../common/loading/Spinner';
import ErrorModal from '../../../common/error/ErrorModal';
import editIcon from '../../../../assets/images/edit.png';
import deleteIcon from '../../../../assets/images/delete.png';
import GenericHeaderSection from '../../../common/adminTable/GenericHeaderSection';

const Products = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {
        products,
        categories,
        loading,
        error,
        currentPage,
        setCurrentPage,
        pageSize,
        setPageSize,
        totalProducts,
        searchTerm,
        setSearchTerm,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
        categoryFilter,
        setCategoryFilter,
        deleteModal,
        handleSearch,
        clearSearch,
        handleSort,
        handleOpenDeleteModal,
        handleCloseDeleteModal,
        confirmDelete,
        formatedDate,
    } = useProducts();

    // Map categories to filterOptions
    const filterOptions = [
        { value: 'all', label: 'All Categories' },
        ...categories.map((category) => ({
            value: category._id,
            label: category.name,
        })),
    ];

    // Define columns for DataTable
    const columns = [
        {
            header: 'Products',
            field: 'name',
            render: (product) => (
                <div className="flex items-center space-x-3">
                    <img
                        src={`https://i.pravatar.cc/40?u=${product._id}`}
                        alt="product"
                        className="w-8 h-8 rounded-full"
                    />
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                </div>
            ),
        },
        {
            header: 'Product ID',
            field: 'sku',
            sortable: true,
        },
        {
            header: 'Added On',
            field: 'createdAt',
            sortable: true,
            render: (product) => formatedDate(product.createdAt),
        },
        {
            header: 'Base Price',
            field: 'basePrice',
            render: (product) => `₹${product.colors[0]?.basePrice?.toLocaleString('en-IN') || 0}`,
        },
        {
            header: 'Discount Price',
            field: 'discountPrice',
            render: (product) => `₹${product.colors[0]?.discountPrice?.toLocaleString('en-IN') || 0}`,
        },
        {
            header: 'Category',
            field: 'category',
            sortable: true,
            render: (product) => product?.category?.name || 'N/A',
        },
        {
            header: 'Stock',
            field: 'totalStock',
            render: (product) => product.colors[0]?.totalStock || 0,
        },
        {
            header: 'Variants',
            field: 'colors',
            render: (product) => product.colors?.length || 0,
        },
    ];

    // Define actions for DataTable
    const actions = [
        {
            label: <img src={editIcon} alt="edit" className="w-5 h-5" />,
            className: 'text-black px-2 py-1 rounded hover:bg-gray-200',
            handler: (product) => {
                navigate(`/admin/edit-product/${product._id}`);
                dispatch(setEditProductID(product._id));
            },
        },
        {
            label: <img src={deleteIcon} alt="delete" className="w-5 h-5" />,
            className: 'text-black px-2 py-1 rounded hover:bg-gray-200',
            handler: (product) => handleOpenDeleteModal(product._id),
        },
    ];

    // Error state: show only ErrorModal
    if (error && products.length === 0) {
        return <ErrorModal isOpen={true} message={error} onClose={() => navigate(-1)} />;
    }

    return (
        <div className="p-4 md:p-6 bg-gray-50 w-full min-h-[800px]">
            {/* GenericHeaderSection */}
            <GenericHeaderSection
                title="Products Management"
                searchPlaceholder="Search by Name, SKU..."
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleSearch={handleSearch}
                clearSearch={clearSearch}
                filterValue={categoryFilter}
                setFilterValue={setCategoryFilter}
                setCurrentPage={setCurrentPage}
                filterOptions={filterOptions}
            />

            {/* Loading state: show only PulseRingLoader */}
            {loading && products.length === 0 ? (
                <PulseRingLoader />
            ) : (
                <>
                    {/* DataTable */}
                    <DataTable
                        columns={columns}
                        data={products}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                        actions={actions}
                    />

                    {/* Pagination */}
                    <AdminPagination
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        pageSize={pageSize}
                        setPageSize={setPageSize}
                        totalItems={totalProducts}
                        pageSizeOptions={[10, 20, 50]}
                    />
                </>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModal.open && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    {/* Semi-transparent backdrop */}
                    <div className="absolute inset-0 bg-black opacity-50">
                    </div>
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50">
                        <div className="bg-white rounded-lg p-6 w-80 md:w-96 shadow-2xl">
                            <h2 className="text-xl font-bold mb-4 text-center">Confirm Deletion</h2>
                            <p className="mb-6 text-center">Are you sure you want to delete this product?</p>
                            <div className="flex justify-center gap-4">
                                <button
                                    className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                                    onClick={handleCloseDeleteModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                                    onClick={() => confirmDelete(deleteModal.productId)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
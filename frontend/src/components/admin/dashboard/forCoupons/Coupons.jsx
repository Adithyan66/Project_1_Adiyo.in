import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Coupen } from '../../../../icons/icons';
import useCoupons from '../../../../hooks/admin/useCoupons';
import DataTable from '../../../common/adminTable/DataTable';
import AdminPagination from '../../../common/pagination/adminPagination';
import { PulseRingLoader } from '../../../common/loading/Spinner';
import ErrorModal from '../../../common/error/ErrorModal';
import CouponModal from './CouponModal';
import editIcon from '../../../../assets/images/edit.png';
import deleteIcon from '../../../../assets/images/delete.png';
import GenericHeaderSection from '../../../common/adminTable/GenericHeaderSection';


const Coupons = () => {
    const navigate = useNavigate();
    const {
        coupons,
        loading,
        error,
        currentPage,
        setCurrentPage,
        pageSize,
        setPageSize,
        totalCoupons,
        searchTerm,
        setSearchTerm,
        deleteModal,
        addModalOpen,
        editModalOpen,
        editingCoupon,
        handleSearch,
        clearSearch,
        handleOpenDeleteModal,
        handleCloseDeleteModal,
        confirmDelete,
        handleOpenAddModal,
        handleCloseAddModal,
        handleOpenEditModal,
        handleCloseEditModal,
        fetchCoupons,
        formatDate,
    } = useCoupons();

    const columns = [
        {
            header: '',
            field: 'icon',
            render: () => <Coupen />,
        },
        {
            header: 'Name',
            field: 'name',
            render: (coupon) => <div className="text-sm font-medium text-gray-900">{coupon.name}</div>,
        },
        {
            header: 'Coupon Code',
            field: 'code',
            render: (coupon) => <div className="text-sm text-gray-900">{coupon.code}</div>,
        },
        {
            header: 'Discount',
            field: 'discount',
            render: (coupon) => (
                <div className="text-sm text-gray-900">
                    {coupon.discountType === 'percentage'
                        ? `${coupon.discountValue}%`
                        : `₹ ${coupon.discountValue}`}
                </div>
            ),
        },
        {
            header: 'Active From',
            field: 'activeFrom',
            render: (coupon) => <div className="text-sm text-gray-900">{formatDate(coupon.activeFrom)}</div>,
        },
        {
            header: 'Active To',
            field: 'expiresAt',
            render: (coupon) => <div className="text-sm text-gray-900">{formatDate(coupon.expiresAt)}</div>,
        },
        {
            header: 'Limit',
            field: 'maxUsage',
            render: (coupon) => <div className="text-sm text-gray-900">{coupon.maxUsage}</div>,
        },
        {
            header: 'Used',
            field: 'usedCount',
            render: (coupon) => <div className="text-sm text-gray-900">{coupon.usedCount}</div>,
        },
        {
            header: 'Categories',
            field: 'applicableCategories',
            render: (coupon) => (
                <div className="text-sm text-gray-900">{coupon.applicableCategories?.name || 'N/A'}</div>
            ),
        },
    ];

    const actions = [
        {
            label: <img src={editIcon} alt="edit" className="w-5 h-5" />,
            className: 'text-blue-600 hover:text-blue-900',
            handler: (coupon) => handleOpenEditModal(coupon),
        },
        {
            label: <img src={deleteIcon} alt="delete" className="w-5 h-5" />,
            className: 'text-red-600 hover:text-red-900',
            handler: (coupon) => handleOpenDeleteModal(coupon._id),
        },
    ];

    if (error && coupons.length === 0) {
        return <ErrorModal isOpen={true} message={error} onClose={() => navigate(-1)} />;
    }

    return (
        <div className="p-4 md:p-6 bg-gray-50 w-full min-h-[800px]">

            <GenericHeaderSection
                title="Coupons Management"
                searchPlaceholder="Search by name..."
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleSearch={handleSearch}
                clearSearch={clearSearch}
                setCurrentPage={setCurrentPage}
                showFilter={false}
                actionButton={
                    <button
                        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                        onClick={handleOpenAddModal}
                    >
                        Add Coupon
                    </button>
                }
            />

            {/* Loading state: show only PulseRingLoader */}
            {loading && coupons.length === 0 ? (
                <PulseRingLoader />
            ) : (
                <>
                    {/* DataTable */}
                    <DataTable
                        columns={columns}
                        data={coupons.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                        actions={actions}
                    />

                    {/* Pagination */}
                    <AdminPagination
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        pageSize={pageSize}
                        setPageSize={setPageSize}
                        totalItems={totalCoupons}
                        pageSizeOptions={[2, 5, 10]}
                    />
                </>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModal.open && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50">
                    <div className="bg-white rounded p-6 w-80 md:w-96 shadow-2xl border border-gray-300">
                        <h2 className="text-xl font-bold mb-4 text-center">Confirm Deletion</h2>
                        <p className="mb-6 text-center">Are you sure you want to delete this coupon?</p>
                        <div className="flex justify-center gap-4">
                            <button
                                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                                onClick={handleCloseDeleteModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                                onClick={() => confirmDelete(deleteModal.couponId)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Coupon Modal */}
            {addModalOpen && (
                <CouponModal
                    mode="add"
                    isOpen={addModalOpen}
                    onClose={handleCloseAddModal}
                    fetchCoupons={fetchCoupons}
                />
            )}

            {/* Edit Coupon Modal */}
            {editModalOpen && editingCoupon && (
                <CouponModal
                    mode="edit"
                    isOpen={editModalOpen}
                    onClose={handleCloseEditModal}
                    fetchCoupons={fetchCoupons}
                    coupon={editingCoupon}
                />
            )}
        </div>
    );
};

export default Coupons;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PulseRingLoader } from '../../../common/loading/Spinner';
import ErrorModal from '../../../common/error/ErrorModal';
import useCustomers from '../../../../hooks/admin/useCustomers';
import DataTable from '../../../common/adminTable/DataTable';
import AdminPagination from '../../../common/pagination/adminPagination';
import GenericHeaderSection from '../../../common/adminTable/GenericHeaderSection';

const Customers = () => {
    const navigate = useNavigate();
    const {
        customers,
        loading,
        error,
        currentPage,
        setCurrentPage,
        pageSize,
        setPageSize,
        totalCustomers,
        searchTerm,
        setSearchTerm,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
        statusFilter,
        setStatusFilter,
        handleSearch,
        clearSearch,
        handleSort,
        formatedDate,
    } = useCustomers();

    // Define filterOptions for Customers
    const filterOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'active', label: 'Active' },
        { value: 'blocked', label: 'Blocked' },
    ];

    // Define columns for DataTable
    const columns = [
        {
            header: 'Name',
            field: 'username',
            render: (customer) => (
                <div className="flex items-center space-x-3">
                    <img
                        src={customer.profileImg ? customer.profileImg : `https://i.pravatar.cc/40?u=${customer._id}`}
                        alt="avatar"
                        className="w-8 h-8 rounded-full"
                    />
                    <div className="text-sm font-medium text-gray-900">{customer.username}</div>
                </div>
            ),
        },
        {
            header: 'Customer ID',
            field: 'userId',
            sortable: true,
        },
        {
            header: 'Registration Date',
            field: 'registrationDate',
            sortable: true,
            render: (customer) => formatedDate(customer.registrationDate),
        },
        {
            header: 'Total Orders',
            field: 'products',
            sortable: true,
            render: (customer) => customer.products || 0,
        },
        {
            header: 'Total Amount Spent',
            field: 'sales',
            sortable: true,
            render: (customer) => `₹${customer.sales ? customer.sales.toLocaleString('en-IN') : 0}`,
        },
        {
            header: 'Status',
            field: 'isActive',
            render: (customer) => (
                <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${customer.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                >
                    {customer.isActive ? 'Active' : 'Blocked'}
                </span>
            ),
        },
    ];

    // Define actions for DataTable
    const actions = [
        {
            label: 'More',
            className: 'bg-black text-white px-3 py-1 rounded hover:bg-gray-800',
            handler: (customer) => navigate(`/admin/${customer._id}/customer-details/`),
        },
    ];

    // Error state: show only ErrorModal
    if (error && customers.length === 0) {
        return <ErrorModal isOpen={true} message={error} onClose={() => navigate(-1)} />;
    }

    return (
        <div className="p-4 md:p-6 bg-gray-50 w-full min-h-[800px]">
            {/* GenericHeaderSection */}
            <GenericHeaderSection
                title="Customers"
                searchPlaceholder="Search by Name, ID..."
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleSearch={handleSearch}
                clearSearch={clearSearch}
                filterValue={statusFilter}
                setFilterValue={setStatusFilter}
                setCurrentPage={setCurrentPage}
                filterOptions={filterOptions}
            />

            {/* Loading state: show only PulseRingLoader */}
            {loading && customers.length === 0 ? (
                <PulseRingLoader />
            ) : (
                <>
                    {/* DataTable */}
                    <DataTable
                        columns={columns}
                        data={customers}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                        actions={actions}
                        onRowClick={(customer) => navigate(`/admin/${customer._id}/customer-details/`)}
                    />

                    {/* Pagination */}
                    <AdminPagination
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        pageSize={pageSize}
                        setPageSize={setPageSize}
                        totalItems={totalCustomers}
                        pageSizeOptions={[10, 20, 50]}
                    />
                </>
            )}
        </div>
    );
};

export default Customers;
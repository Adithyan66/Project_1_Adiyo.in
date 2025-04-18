
import { useState } from "react";
import { useNavigate } from "react-router";
import useDebounce from "../../../../hooks/common/useDebounce";
import useSalesReport from "../../../../hooks/admin/useSalesReport";
import { getStatusBadgeClass } from "../../../../utils/statusBadge";
import PropTypes from 'prop-types';
import GenericHeaderSection from "../../../common/adminTable/GenericHeaderSection"
import CustomDateRange from "../../../common/dateRange/CustomDateRange";
import SummaryCards from "./SummaryCards";
import DataTable from "../../../common/adminTable/DataTable"
import AdminPagination from "../../../common/pagination/adminPagination"
import DownloadButtons from "../../../common/buttons/DownloadButton";
import { formatDate } from "../../../../utils/formatDate";
import { PulseRingLoader } from "../../../common/loading/Spinner";


const SalesReport = () => {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState('');
    const [dateRange, setDateRange] = useState('all');
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');

    const debouncedSearchTerm = useDebounce(inputValue, 2000);
    const { reportData, loading, error } = useSalesReport({
        searchTerm: debouncedSearchTerm,
        dateRange,
        customStartDate,
        customEndDate,
        currentPage,
        pageSize,
        sortBy,
        sortOrder
    });

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    const columns = [
        { header: 'Order ID', field: 'orderId', sortable: true },
        { header: 'Date', field: 'date', sortable: false, render: (item) => formatDate(item.createdAt) },
        { header: 'Total Amount', field: 'totalAmount', sortable: true, render: (item) => `₹${item.totalAmount}` },
        { header: 'Discounts', field: 'discount', sortable: true, render: (item) => `₹${item.discount}` },
        { header: 'Coupon Deduction', field: 'couponCode', sortable: true, render: (item) => item.couponCode || 'No Coupon' },
        {
            header: 'Status', field: 'orderStatus', sortable: true, render: (item) => (
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(item.orderStatus)}`}>
                    {item.orderStatus}
                </span>
            )
        },
    ];

    const actions = [
        {
            label: 'View Details',
            className: 'text-indigo-600 hover:text-indigo-900',
            handler: (item) => navigate(`/admin/sales-details/${item._id}`),
        },
    ];

    const filterOptions = [
        { value: 'all', label: 'All Dates' },
        { value: 'today', label: '1 Day' },
        { value: 'last7days', label: '1 Week' },
        { value: 'thisMonth', label: '1 Month' },
        { value: 'custom', label: 'Custom Date Range' },
    ];

    const downloadParams = { searchTerm: debouncedSearchTerm, dateRange, customStartDate, customEndDate, sortBy, sortOrder };

    if (loading) {
        return (
            <PulseRingLoader />);
    }

    if (error) {
        return <ErrorModal isOpen={true} message={error} onClose={() => navigate(-1)} />;
    }

    const { summary, data: salesRecords, pagination } = reportData;

    return (
        <div className="p-4 md:p-6 bg-gray-50 w-full min-h-[800px]">
            <GenericHeaderSection
                title="Sales Report"
                searchPlaceholder="Search by Order ID, Amount..."
                searchTerm={inputValue}
                setSearchTerm={setInputValue}
                handleSearch={(e) => { e.preventDefault(); setCurrentPage(1); }}
                clearSearch={() => { setInputValue(''); setCurrentPage(1); }}
                filterValue={dateRange}
                setFilterValue={setDateRange}
                setCurrentPage={setCurrentPage}
                filterOptions={filterOptions}
                showFilter={true}
            />
            {dateRange === 'custom' && (
                <CustomDateRange
                    customStartDate={customStartDate}
                    setCustomStartDate={setCustomStartDate}
                    customEndDate={customEndDate}
                    setCustomEndDate={setCustomEndDate}
                    setCurrentPage={setCurrentPage}
                />
            )}
            <SummaryCards summary={summary} />
            <DataTable
                columns={columns}
                data={salesRecords}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
                actions={actions}
            />
            <AdminPagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                pageSize={pageSize}
                setPageSize={setPageSize}
                totalItems={pagination.totalItems}
                pageSizeOptions={[10, 20, 50]}
            />
            <DownloadButtons downloadParams={downloadParams} hasData={salesRecords.length > 0} />
        </div>
    );
};

SalesReport.propTypes = {
    navigate: PropTypes.func,
};


export default SalesReport
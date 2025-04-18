
import useWalletManagement from '../../../../hooks/admin/useWalletMangement';
import GenericHeaderSection from '../../../common/adminTable/GenericHeaderSection';
import { PulseRingLoader } from '../../../common/loading/Spinner';
import DataTable from '../../../common/adminTable/DataTable';
import AdminPagination from '../../../common/pagination/adminPagination';
import TransactionDetailsModal from './TransactionDetailsModal';
import { formatAmount, formatDate } from '../../../common/details/Format';

const WalletManagement = () => {

    const { transactions, setTransactions,
        isDetailModalOpen, setIsDetailModalOpen,
        currentTransaction, setCurrentTransaction,
        isLoading, setIsLoading,
        filter, setFilter,
        currentPage, setCurrentPage,
        totalPages, setTotalPages, totalTransactions,
        limit, setLimit,
        searchQuery, setSearchQuery, clearSearch,
        transactionTypes,
        handleViewDetails,
        handleSearch,
        handlePageChange,
        handleFilterChange
    } = useWalletManagement()


    const filterOptions = [
        { value: 'all', label: 'All Statuses' },
        ...transactionTypes.map((status) => ({
            value: status,
            label: status.charAt(0).toUpperCase() + status.slice(1).replace("_", " "),
        })),
    ];

    const columns = [
        {
            header: "TRANSACTION ID",
            field: "transactionId",
            sortable: false,
            render: (transaction) => transaction.transactionId || transaction._id.slice(-6).toUpperCase()
        },
        {
            header: "DATE",
            filed: "createdAt",
            sortable: false,
            render: (transaction) => formatDate(transaction.createdAt)
        },
        {
            header: "USER",
            field: "user",
            sortable: false,
            render: (transaction) => transaction?.userId?.username || "Not available"
        },
        {
            header: "TYPE",
            field: "type",
            sortable: false,
            render: (transaction) => transaction.type.replace("_", " ")
        },
        {
            header: "STATUS",
            field: "status",
            sortable: false,
            render: (transaction) => transaction.status
        },
        {
            header: "AMOUNT",
            field: "amount",
            sortable: false,
            render: (transaction) => formatAmount(transaction.amount, transaction.type)
        },
    ]


    const actions = [
        {
            label: "View Details",
            className: 'text-blue-600 hover:text-blue-900',
            handler: (transaction) => handleViewDetails(transaction)
        }

    ]

    return (
        <div className="p-4 md:p-6 bg-gray-50 w-full min-h-[800px]">

            <GenericHeaderSection
                title={"Wallet Management"}
                searchPlaceholder={"Search with Transaction Id"}
                searchTerm={searchQuery}
                setSearchTerm={setSearchQuery}
                handleSearch={handleSearch}
                clearSearch={clearSearch}
                filterValue={filter}
                setFilterValue={setFilter}
                setCurrentPage={setCurrentPage}
                filterOptions={filterOptions}
                showFilter={true}
            ></GenericHeaderSection>

            {
                isLoading ? (
                    <PulseRingLoader />

                ) : (
                    <>
                        <DataTable
                            columns={columns}
                            data={transactions}
                            onRowClick={(transaction) => handleViewDetails(transaction)}
                            actions={actions}
                        />
                        <AdminPagination
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            pageSize={limit}
                            setPageSize={setLimit}
                            totalItems={totalTransactions}
                            pageSizeOptions={[20, 30, 50]}
                        />
                    </>
                )
            }
            {isDetailModalOpen && currentTransaction && (
                <TransactionDetailsModal
                    currentTransaction={currentTransaction}
                    setIsDetailModalOpen={setIsDetailModalOpen}
                />
            )}

        </div >
    );
};

export default WalletManagement;
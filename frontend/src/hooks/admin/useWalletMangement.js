import { useEffect, useState } from "react";
import { adminGetWalletTransactions } from "../../services/wishlistService";
import useDebounce from "../common/useDebounce";
import { toast } from "react-toastify";


const useWalletManagement = () => {

    const [transactions, setTransactions] = useState([]);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [currentTransaction, setCurrentTransaction] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(20);
    const [totalTransactions, setTotalTransactions] = useState(null)

    // Search state
    const [searchQuery, setSearchQuery] = useState('');

    // Available transaction types
    const transactionTypes = [
        'all',
        'credit',
        'debit',
        'refund',
        'withdrawal',
        'order_payment',
        'order_refund',
        'return_refund',
        'cancellation_refund',
        'referral'
    ];

    const debouncedSearchTerm = useDebounce(searchQuery, 300)

    useEffect(() => {
        fetchTransactions();
    }, [currentPage, limit, filter, debouncedSearchTerm,]);

    const fetchTransactions = async () => {
        setIsLoading(true);
        try {
            // Prepare query parameters for backend
            const params = {
                page: currentPage,
                limit: limit,
                type: filter !== 'all' ? filter : undefined,
                search: searchQuery || undefined,
            };
            console.log("paraaaaaaaaaaaaam", params);


            const response = await adminGetWalletTransactions(params);

            if (response.data.success) {
                setTransactions(response.data.transactions);
                setTotalPages(response.data.totalPages || 1);
                setTotalTransactions(response.data.totalTransactions)
                console.log("Transactions fetched successfully:", response.data.transactions);
            } else {
                toast.error('Failed to load transactions');
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
            toast.error('An error occurred while fetching transactions');
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewDetails = (transaction) => {
        setCurrentTransaction(transaction);
        setIsDetailModalOpen(true);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1); // Reset to first page when searching
        fetchTransactions();
    };

    const clearSearch = () => {
        setSearchQuery('');
        setCurrentPage(1);
    };


    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleFilterChange = (type) => {
        setFilter(type);
        setCurrentPage(1); // Reset page when filter changes
    };



    return {
        transactions, setTransactions,
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

    }


}


export default useWalletManagement
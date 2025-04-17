import { useState, useEffect } from 'react';
import { getCustomersList } from '../../services/adminCustomerServiced';

// Custom hook for Customers component logic
const useCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCustomers, setTotalCustomers] = useState(0);

    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('registrationDate');
    const [sortOrder, setSortOrder] = useState('desc');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchCustomers();
    }, [currentPage, pageSize, searchTerm, sortBy, sortOrder, statusFilter]);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage,
                limit: pageSize,
                sortBy,
                sortOrder,
                ...(searchTerm && { search: searchTerm }),
                ...(statusFilter !== 'all' && { status: statusFilter === 'active' }),
            });

            const response = await getCustomersList(params);
            console.log(response.data.customers);

            setCustomers(response.data.customers);
            setTotalCustomers(response.data.totalCustomers || response.data.customers.length);
            setError(null);
        } catch (error) {
            console.error('Error fetching customer data:', error);
            setError('Failed to fetch customers. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
    };

    const clearSearch = () => {
        setSearchTerm('');
        setCurrentPage(1);
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
        setCurrentPage(1);
    };

    const formatedDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return {
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
    };
};

export default useCustomers;
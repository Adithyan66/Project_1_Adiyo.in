import { useState, useEffect } from 'react';
import { getCouponList, deleteCoupon } from '../../services/couponService';
import useDebounce from '../common/useDebounce';

// Custom hook for Coupons component logic
const useCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCoupons, setTotalCoupons] = useState(0);

    const [searchTerm, setSearchTerm] = useState('');

    const [deleteModal, setDeleteModal] = useState({
        open: false,
        couponId: null,
    });

    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);

    // Debounce search term with 300ms delay
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    useEffect(() => {
        fetchCoupons();
    }, []);

    useEffect(() => {
        // Reset to page 1 when search term changes
        setCurrentPage(1);
    }, [debouncedSearchTerm]);

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const response = await getCouponList();
            const fetchedCoupons = response.data.coupons || [];
            setCoupons(fetchedCoupons);
            setTotalCoupons(fetchedCoupons.length);
            setError(null);
        } catch (error) {
            console.error('Error fetching coupons:', error);
            setError('Failed to fetch coupons. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Filter coupons client-side based on search term
    const filteredCoupons = coupons.filter((coupon) =>
        coupon.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
    };

    const clearSearch = () => {
        setSearchTerm('');
        setCurrentPage(1);
    };

    const handleOpenDeleteModal = (couponId) => {
        setDeleteModal({ open: true, couponId });
    };

    const handleCloseDeleteModal = () => {
        setDeleteModal({ open: false, couponId: null });
    };

    const confirmDelete = async (couponId) => {
        try {
            await deleteCoupon(couponId);
            await fetchCoupons();
        } catch (error) {
            console.error('Error deleting coupon:', error);
            setError('Failed to delete coupon. Please try again.');
        } finally {
            handleCloseDeleteModal();
        }
    };

    const handleOpenAddModal = () => {
        setAddModalOpen(true);
    };

    const handleCloseAddModal = () => {
        setAddModalOpen(false);
    };

    const handleOpenEditModal = (coupon) => {
        setEditingCoupon(coupon);
        setEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setEditModalOpen(false);
        setEditingCoupon(null);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    return {
        coupons: filteredCoupons,
        loading,
        error,
        currentPage,
        setCurrentPage,
        pageSize,
        setPageSize,
        totalCoupons: filteredCoupons.length,
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
    };
};

export default useCoupons;
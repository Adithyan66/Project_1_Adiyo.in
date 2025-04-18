import { useState, useEffect } from 'react';
import { getCategoryList } from '../../services/categoryService';
import { adminDeleteProduct, getProducts } from '../../services/productService';
import useDebounce from '../common/useDebounce';

const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalProducts, setTotalProducts] = useState(0);

    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [categoryFilter, setCategoryFilter] = useState('all');

    const [deleteModal, setDeleteModal] = useState({
        open: false,
        productId: null,
    });

    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [currentPage, pageSize, debouncedSearchTerm, sortBy, sortOrder, categoryFilter]);

    const fetchCategories = async () => {
        try {
            const response = await getCategoryList();
            setCategories(response.data.categories || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage,
                limit: pageSize,
                sortBy,
                sortOrder,
                ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
                ...(categoryFilter !== 'all' && { category: categoryFilter }),
            });

            const response = await getProducts(params);
            setProducts(response.data.products);
            setTotalProducts(response.data.totalProducts || response.data.products.length);
            setError(null);
        } catch (error) {
            console.error('Error fetching product data:', error);
            setError('Failed to fetch products. Please try again later.');
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

    const handleOpenDeleteModal = (id) => {
        setDeleteModal({ open: true, productId: id });
    };

    const handleCloseDeleteModal = () => {
        setDeleteModal({ open: false, productId: null });
    };

    const confirmDelete = async (id) => {
        try {
            await adminDeleteProduct(id);
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        } finally {
            handleCloseDeleteModal();
        }
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
    };
};

export default useProducts;
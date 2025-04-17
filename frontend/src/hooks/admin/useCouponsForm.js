import { useState, useEffect } from 'react';
import { addCoupon, editCoupon } from '../../services/couponService';
import { getCategoryList } from "../../services/categoryService"

export const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const useCouponForm = ({ mode, isOpen, coupon, fetchCoupons, onClose }) => {
    const [formData, setFormData] = useState({
        couponName: '',
        couponCode: '',
        discountValue: '',
        limit: '',
        activeDate: '',
        expireDate: '',
        minimumOrder: '',
        selectedCategory: '',
    });
    const [errors, setErrors] = useState({});
    const [categories, setCategories] = useState([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && coupon) {
                setFormData({
                    couponName: coupon.name || '',
                    couponCode: coupon.code || '',
                    discountValue: coupon.discountValue?.toString() || '',
                    limit: coupon.maxUsage?.toString() || '',
                    activeDate: formatDate(coupon.activeFrom) || '',
                    expireDate: formatDate(coupon.expiresAt) || '',
                    minimumOrder: coupon.minimumOrderValue?.toString() || '',
                    selectedCategory: coupon.applicableCategories?._id || '',
                });
            } else {
                setFormData({
                    couponName: '',
                    couponCode: '',
                    discountValue: '',
                    limit: '',
                    activeDate: '',
                    expireDate: '',
                    minimumOrder: '',
                    selectedCategory: '',
                });
            }
            setErrors({});
            setApiError('');
            fetchCategories();
        }
    }, [isOpen, mode, coupon]);

    // Fetch categories
    const fetchCategories = async () => {
        setIsLoadingCategories(true);
        try {
            const response = await getCategoryList();
            setCategories(response.data.categories || []);
            setApiError('');
        } catch (error) {
            console.error('Error fetching categories:', error);
            setApiError('Failed to load categories. Please try again.');
        } finally {
            setIsLoadingCategories(false);
        }
    };

    const validateField = (name, value) => {
        switch (name) {
            case 'couponName':
                return value.trim() ? '' : 'Coupon name is required.';
            case 'couponCode':
                return value.trim() ? '' : 'Coupon code is required.';
            case 'discountValue': {
                const num = Number(value);
                if (!value) return 'Discount value is required.';
                if (isNaN(num) || num <= 0) return 'Discount must be a positive number.';
                return '';
            }
            case 'limit': {
                const num = Number(value);
                if (!value) return 'Limit is required.';
                if (isNaN(num) || num <= 0 || !Number.isInteger(num)) return 'Limit must be a positive integer.';
                return '';
            }
            case 'activeDate':
                return value ? '' : 'Active date is required.';
            case 'expireDate': {
                if (!value) return 'Expire date is required.';
                if (formData.activeDate && new Date(value).getTime() < new Date(formData.activeDate).getTime()) {
                    return 'Expire date must be after active date.';
                }
                return '';
            }
            case 'minimumOrder': {
                const num = Number(value);
                if (!value) return 'Minimum order value is required.';
                if (isNaN(num) || num <= 0) return 'Minimum order must be a positive number.';
                return '';
            }
            case 'selectedCategory':
                return value ? '' : 'Please select a category.';
            default:
                return '';
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    };

    const handleSubmit = async () => {
        // Validate all fields
        const newErrors = {};
        Object.keys(formData).forEach((key) => {
            newErrors[key] = validateField(key, formData[key]);
        });
        setErrors(newErrors);

        if (Object.values(newErrors).some((error) => error)) {
            setApiError('Please fix all errors before submitting.');
            return;
        }

        setIsSubmitting(true);
        setApiError('');

        const couponData = {
            name: formData.couponName,
            code: formData.couponCode,
            discountValue: Number(formData.discountValue),
            maxUsage: Number(formData.limit),
            activeFrom: formData.activeDate,
            expiresAt: formData.expireDate,
            minimumOrderValue: Number(formData.minimumOrder),
            applicableCategories: formData.selectedCategory,
            ...(mode === 'edit' && { id: coupon._id }),
        };

        try {
            if (mode === 'edit') {
                await editCoupon(couponData);
            } else {
                await addCoupon(couponData);
            }
            fetchCoupons();
            if (mode === 'add') {
                setFormData({
                    couponName: '',
                    couponCode: '',
                    discountValue: '',
                    limit: '',
                    activeDate: '',
                    expireDate: '',
                    minimumOrder: '',
                    selectedCategory: '',
                });
            }
            onClose();
        } catch (error) {
            console.error(`Error ${mode === 'edit' ? 'editing' : 'adding'} coupon:`, error);
            setApiError(
                error.response?.data?.message ||
                `Failed to ${mode === 'edit' ? 'edit' : 'add'} coupon. Please try again.`
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        errors,
        categories,
        isLoadingCategories,
        isSubmitting,
        apiError,
        handleChange,
        handleSubmit,
    };
};

export default useCouponForm;
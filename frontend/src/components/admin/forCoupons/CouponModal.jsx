import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Coupen } from '../../../icons/icons';
import useCouponForm from '../../../hooks/admin/useCouponsForm';


const INPUT_CLASSES =
    'w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black disabled:bg-gray-100';
const LABEL_CLASSES = 'block font-medium mb-1 text-sm';
const ERROR_CLASSES = 'text-red-600 text-xs mt-1';
const BUTTON_CLASSES =
    'px-8 py-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed';

const CouponModal = ({ mode, isOpen, onClose, fetchCoupons, coupon }) => {
    const {
        formData,
        errors,
        categories,
        isLoadingCategories,
        isSubmitting,
        apiError,
        handleChange,
        handleSubmit,
    } = useCouponForm({ mode, isOpen, coupon, fetchCoupons, onClose });

    const modalRef = useRef(null);
    const firstInputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            firstInputRef.current?.focus();
            const handleEsc = (e) => {
                if (e.key === 'Escape') onClose();
            };
            window.addEventListener('keydown', handleEsc);
            return () => window.removeEventListener('keydown', handleEsc);
        }
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen) {
            const focusableElements = modalRef.current?.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements?.[0];
            const lastElement = focusableElements?.[focusableElements.length - 1];

            const trapFocus = (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey && document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    } else if (!e.shiftKey && document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            };

            document.addEventListener('keydown', trapFocus);
            return () => document.removeEventListener('keydown', trapFocus);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Semi-transparent backdrop */}
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-30 backdrop-blur-xs"
                role="dialog"
                aria-modal="true"
                aria-labelledby="coupon-modal-title"
            >
                <div
                    ref={modalRef}
                    className="bg-white w-full max-w-2xl max-h-[90vh] mx-4 rounded shadow-lg p-6 overflow-y-auto"
                >
                    <div className="flex justify-center items-center bg-black rounded mb-8">
                        <h2
                            id="coupon-modal-title"
                            className="flex items-center justify-center text-xl font-bold text-white p-4 whitespace-nowrap"
                        >
                            <span className="inline-flex mr-2">
                                <Coupen />
                            </span>
                            {mode === 'edit' ? 'Edit Coupon' : 'Add New Coupon'}
                        </h2>
                    </div>

                    {/* API Error */}
                    {apiError && (
                        <div className="mb-4 text-red-600 text-center font-semibold" role="alert">
                            {apiError}
                        </div>
                    )}

                    {/* Form Fields */}
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="w-full sm:w-1/2">
                                <label className={LABEL_CLASSES} htmlFor="couponName">
                                    Coupon Name
                                </label>
                                <input
                                    id="couponName"
                                    name="couponName"
                                    type="text"
                                    className={INPUT_CLASSES}
                                    placeholder="Free delivery"
                                    value={formData.couponName}
                                    onChange={handleChange}
                                    aria-required="true"
                                    aria-invalid={!!errors.couponName}
                                    aria-describedby={errors.couponName ? 'couponName-error' : undefined}
                                    ref={firstInputRef}
                                    data-testid="couponName-input"
                                />
                                {errors.couponName && (
                                    <span id="couponName-error" className={ERROR_CLASSES} data-testid="couponName-error">
                                        {errors.couponName}
                                    </span>
                                )}
                            </div>
                            <div className="w-full sm:w-1/2">
                                <label className={LABEL_CLASSES} htmlFor="couponCode">
                                    Coupon Code
                                </label>
                                <input
                                    id="couponCode"
                                    name="couponCode"
                                    type="text"
                                    className={INPUT_CLASSES}
                                    placeholder="BX67HJ87KH"
                                    value={formData.couponCode}
                                    onChange={handleChange}
                                    aria-required="true"
                                    aria-invalid={!!errors.couponCode}
                                    aria-describedby={errors.couponCode ? 'couponCode-error' : undefined}
                                    data-testid="couponCode-input"
                                />
                                {errors.couponCode && (
                                    <span id="couponCode-error" className={ERROR_CLASSES} data-testid="couponCode-error">
                                        {errors.couponCode}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="w-full sm:w-1/2">
                                <label className={LABEL_CLASSES} htmlFor="discountValue">
                                    Discount Price
                                </label>
                                <input
                                    id="discountValue"
                                    name="discountValue"
                                    type="number"
                                    step="0.01"
                                    className={INPUT_CLASSES}
                                    placeholder="399"
                                    value={formData.discountValue}
                                    onChange={handleChange}
                                    aria-required="true"
                                    aria-invalid={!!errors.discountValue}
                                    aria-describedby={errors.discountValue ? 'discountValue-error' : undefined}
                                    data-testid="discountValue-input"
                                />
                                {errors.discountValue && (
                                    <span id="discountValue-error" className={ERROR_CLASSES} data-testid="discountValue-error">
                                        {errors.discountValue}
                                    </span>
                                )}
                            </div>
                            <div className="w-full sm:w-1/2">
                                <label className={LABEL_CLASSES} htmlFor="limit">
                                    Limit
                                </label>
                                <input
                                    id="limit"
                                    name="limit"
                                    type="number"
                                    className={INPUT_CLASSES}
                                    placeholder="40"
                                    value={formData.limit}
                                    onChange={handleChange}
                                    aria-required="true"
                                    aria-invalid={!!errors.limit}
                                    aria-describedby={errors.limit ? 'limit-error' : undefined}
                                    data-testid="limit-input"
                                />
                                {errors.limit && (
                                    <span id="limit-error" className={ERROR_CLASSES} data-testid="limit-error">
                                        {errors.limit}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="w-full sm:w-1/2">
                                <label className={LABEL_CLASSES} htmlFor="minimumOrder">
                                    Minimum Order Value
                                </label>
                                <input
                                    id="minimumOrder"
                                    name="minimumOrder"
                                    type="number"
                                    step="0.01"
                                    className={INPUT_CLASSES}
                                    placeholder="399"
                                    value={formData.minimumOrder}
                                    onChange={handleChange}
                                    aria-required="true"
                                    aria-invalid={!!errors.minimumOrder}
                                    aria-describedby={errors.minimumOrder ? 'minimumOrder-error' : undefined}
                                    data-testid="minimumOrder-input"
                                />
                                {errors.minimumOrder && (
                                    <span id="minimumOrder-error" className={ERROR_CLASSES} data-testid="minimumOrder-error">
                                        {errors.minimumOrder}
                                    </span>
                                )}
                            </div>
                            <div className="w-full sm:w-1/2">
                                <label className={LABEL_CLASSES} htmlFor="selectedCategory">
                                    Applicable Categories
                                </label>
                                <select
                                    id="selectedCategory"
                                    name="selectedCategory"
                                    className={INPUT_CLASSES}
                                    value={formData.selectedCategory}
                                    onChange={handleChange}
                                    disabled={isLoadingCategories}
                                    aria-required="true"
                                    aria-invalid={!!errors.selectedCategory}
                                    aria-describedby={errors.selectedCategory ? 'selectedCategory-error' : undefined}
                                    data-testid="selectedCategory-input"
                                >
                                    {mode === 'add' && <option value="">Select Category</option>}
                                    {isLoadingCategories ? (
                                        <option disabled>Loading categories...</option>
                                    ) : (
                                        categories.map((category) => (
                                            <option key={category._id} value={category._id}>
                                                {category.name}
                                            </option>
                                        ))
                                    )}
                                </select>
                                {errors.selectedCategory && (
                                    <span id="selectedCategory-error" className={ERROR_CLASSES} data-testid="selectedCategory-error">
                                        {errors.selectedCategory}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="w-full sm:w-1/2">
                                <label className={LABEL_CLASSES} htmlFor="activeDate">
                                    Active Date
                                </label>
                                <input
                                    id="activeDate"
                                    name="activeDate"
                                    type="date"
                                    className={INPUT_CLASSES}
                                    value={formData.activeDate}
                                    onChange={handleChange}
                                    aria-required="true"
                                    aria-invalid={!!errors.activeDate}
                                    aria-describedby={errors.activeDate ? 'activeDate-error' : undefined}
                                    data-testid="activeDate-input"
                                />
                                {errors.activeDate && (
                                    <span id="activeDate-error" className={ERROR_CLASSES} data-testid="activeDate-error">
                                        {errors.activeDate}
                                    </span>
                                )}
                            </div>
                            <div className="w-full sm:w-1/2">
                                <label className={LABEL_CLASSES} htmlFor="expireDate">
                                    Expire Date
                                </label>
                                <input
                                    id="expireDate"
                                    name="expireDate"
                                    type="date"
                                    className={INPUT_CLASSES}
                                    value={formData.expireDate}
                                    onChange={handleChange}
                                    aria-required="true"
                                    aria-invalid={!!errors.expireDate}
                                    aria-describedby={errors.expireDate ? 'expireDate-error' : undefined}
                                    data-testid="expireDate-input"
                                />
                                {errors.expireDate && (
                                    <span id="expireDate-error" className={ERROR_CLASSES} data-testid="expireDate-error">
                                        {errors.expireDate}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center space-x-4 mt-8">
                        <button
                            onClick={onClose}
                            className={`${BUTTON_CLASSES} border border-gray-300 hover:bg-gray-100`}
                            disabled={isSubmitting}
                            aria-label="Cancel coupon changes"
                            data-testid="cancel-button"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className={`${BUTTON_CLASSES} bg-black text-white hover:bg-gray-800`}
                            disabled={isSubmitting}
                            aria-label={mode === 'edit' ? 'Save coupon changes' : 'Create new coupon'}
                            data-testid="submit-button"
                        >
                            {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Edit' : 'Create'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

CouponModal.propTypes = {
    mode: PropTypes.oneOf(['add', 'edit']).isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    fetchCoupons: PropTypes.func.isRequired,
    coupon: PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        code: PropTypes.string,
        discountValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        maxUsage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        activeFrom: PropTypes.string,
        expiresAt: PropTypes.string,
        minimumOrderValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        applicableCategories: PropTypes.shape({
            _id: PropTypes.string,
            name: PropTypes.string,
        }),
    }),
};

CouponModal.defaultProps = {
    coupon: null,
};

export default CouponModal;
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { addReview } from '../../../services/reviewService';

const API_BASE_URL = import.meta.env.VITE_API_URL;


const ProductReviewModal = ({ productId, onClose, onReviewSubmit }) => {


    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);

    const handleStarClick = (selectedRating) => {
        setRating(selectedRating);
    };

    const handleSubmitReview = async () => {
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        setIsSubmitting(true);
        try {
            // const response = await axios.post(`${API_BASE_URL}/user/${productId}/addreviews`, {
            //     rating,
            //     comment
            // }, { withCredentials: true });

            const response = await addReview(productId, rating, comment);

            toast.success('Review submitted successfully');

            onReviewSubmit(response.data.review);

            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md border-4 border-gray-200 shadow-2xl">
                <h3 className="text-xl font-medium mb-4">Write a Review</h3>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Your Rating</label>
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                size={32}
                                fill={(hoverRating || rating) >= star ? 'gold' : 'gray'}
                                stroke="#gold"
                                className="cursor-pointer mr-1"
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => handleStarClick(star)}
                            />
                        ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        {rating === 0 ? 'Select your rating' : `${rating} out of 5 stars`}
                    </p>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Your Review</label>
                    <textarea
                        rows="4"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="Share your experience with this product"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 focus:outline-none"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmitReview}
                        className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 flex items-center focus:outline-none focus:ring-2 focus:ring-gray-500"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                Submitting...
                            </>
                        ) : (
                            'Submit Review'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductReviewModal;
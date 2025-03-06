import axios from 'axios';
import React, { useState, useEffect } from 'react';

const ProductPage = ({ product }) => {

    const [activeTab, setActiveTab] = useState('details');

    const {
        sku,
        name,
        shortDescription,
        description,
        brand,
        category,
        subCategory,
        price,
        discountPrice,
        discountPercentage,
        material,
        careInstructions,
        gender,
        variants,
        totalStock: totalStockNumber,
        imageUrls,
        imagePublicIds,
        color,
        size,
        createdAt,
        dressStyle,
    } = product;

    return (
        <div className="max-w-screen-lg mx-auto px-4 py-8 mt-[50px]">
            {/* Tab Navigation */}
            <div className="flex space-x-8 border-b border-gray-300 mb-6">
                <button
                    className={`pb-2 text-gray-600 transition-colors duration-200 ${activeTab === 'details' ? 'border-b-2 border-black text-black' : ''
                        }`}
                    onClick={() => setActiveTab('details')}
                >
                    Product Details
                </button>

                <button
                    className={`pb-2 text-gray-600 transition-colors duration-200 ${activeTab === 'reviews' ? 'border-b-2 border-black text-black' : ''
                        }`}
                    onClick={() => setActiveTab('reviews')}
                >
                    Rating & Reviews
                </button>

                <button
                    className={`pb-2 text-gray-600 transition-colors duration-200 ${activeTab === 'faq' ? 'border-b-2 border-black text-black' : ''
                        }`}
                    onClick={() => setActiveTab('faq')}
                >
                    FAQs
                </button>
            </div>

            {/* Conditionally render the active tab */}
            {activeTab === 'details' && <ProductDetails product={product} />}
            {activeTab === 'reviews' && <RatingAndReviews product={product} />}
            {activeTab === 'faq' && <FAQ />}
        </div>
    );
};

/* ------------------ Product Details Tab ------------------ */
const ProductDetails = ({ product }) => {

    const {
        _id,
        sku,
        name,
        shortDescription,
        description,
        brand,
        category,
        subCategory,
        price,
        discountPrice,
        discountPercentage,
        material,
        careInstructions,
        gender,
        variants,
        totalStock: totalStockNumber,
        imageUrls,
        imagePublicIds,
        color,
        size,
        createdAt,
        dressStyle,
    } = product;


    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Product Details</h2>
            <p className="text-gray-700 mb-4">
                {description}
            </p>
            <ul className="list-disc list-inside space-y-2">
                {/* <li>Feature 1: Lorem ipsum dolor sit amet</li>
                <li>Feature 2: Suspendisse potenti</li>
                <li>Feature 3: Sed vulputate, augue a fringilla tincidunt</li> */}
                {careInstructions.map((instruction) => <li>{instruction}</li>
                )}
            </ul>
        </div>
    );
};

const RatingAndReviews = ({ product }) => {

    const [reviews, setReviews] = useState([]);

    const { _id } = product;

    useEffect(() => {

        const fetchReview = async () => {

            const response = await axios.get(`http://localhost:3333/user/${_id}/reviews`)

            setReviews(response.data.reviews)

            console.log("reviews ", response.data.reviews);

        }

        fetchReview()

    }, [_id]);



    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={i < rating ? 'text-yellow-500' : 'text-gray-300'}>
                ★
            </span>
        ));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    };


    return (
        <div>
            {/* Top Section: Title, Sort Dropdown, Write a Review Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h2 className="text-2xl font-bold mb-2 sm:mb-0">All Reviews ({reviews.length})</h2>
                <div className="flex items-center space-x-4">
                    {/* Sort dropdown */}
                    <select className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none">
                        <option value="latest">Latest</option>
                        <option value="oldest">Oldest</option>
                        <option value="highest">Highest Rated</option>
                        <option value="lowest">Lowest Rated</option>
                    </select>
                    {/* <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm">
                        Write a Review
                    </button> */}
                </div>
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((review, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 rounded p-4 shadow-sm">
                        {/* Reviewer Name and Rating */}
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-800">{review?.userId?.username}</h3>
                            <div className="flex space-x-1">{renderStars(review?.rating)}</div>
                        </div>
                        {/* Review Content */}
                        <p className="text-sm text-gray-600 mb-4">{review.comment}</p>
                        {/* Date */}
                        <p className="text-xs text-gray-400">Posted on {formatDate(review?.createdAt)}</p>
                    </div>
                ))}
            </div>

            {/* Load More Reviews Button */}
            <div className="flex justify-center mt-6">
                <button className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 text-sm">
                    Load More Reviews
                </button>
            </div>
        </div>
    );
};



const FAQ = () => {
    const faqs = [
        {
            question: 'What is the return policy?',
            answer:
                'You can return the product within 30 days of purchase for a full refund. Just keep the original packaging and receipt.',
        },
        {
            question: 'Is there a warranty?',
            answer:
                'Yes, there is a one-year warranty covering any manufacturing defects. Please contact our support team for more information.',
        },
        {
            question: 'Can I customize the design?',
            answer:
                'Currently, we do not offer custom designs, but stay tuned for future updates.',
        },
    ];

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div key={index}>
                        <h4 className="font-semibold text-gray-800">{faq.question}</h4>
                        <p className="text-gray-600 mt-1">{faq.answer}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductPage;

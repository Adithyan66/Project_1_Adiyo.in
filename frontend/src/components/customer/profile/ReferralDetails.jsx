

import React, { useState, useEffect } from 'react';
import { Link, Share2, Copy, Check, Users, Gift, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../wallet/WalletCards';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getUserReferrals } from '../../../services/referalService';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const ReferralDetails = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [copied, setCopied] = useState(false);

    const [referralData, setReferralData] = useState({
        referralCode: 'YOUR123CODE',
        referralLink: 'https://adiyo.shop/join/YOUR123CODE',
        totalEarned: 0,
        pendingAmount: 0,
        totalReferrals: 0,
        activeReferrals: 0
    });

    const [referrals, setReferrals] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 5,
        totalReferrals: 0,
        totalPages: 1
    });

    const fetchReferralData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Prepare query parameters
            let queryParams = new URLSearchParams({
                page: currentPage,
                limit: 5
            });

            if (searchQuery) {
                queryParams.append('search', searchQuery);
            }

            console.log(`Fetching referral data with query: ${queryParams}`);

            const response = await getUserReferrals(queryParams);
            setReferralData(response.data.referralDetails);
            setReferrals(response.data.referrals);
            setPagination(response.data.pagination);

        } catch (err) {
            console.error('Error fetching referral data:', err);
            setError('Failed to load referral data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on component mount and when filters change
    useEffect(() => {
        fetchReferralData();
    }, [currentPage, searchQuery]);

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    // Copy referral link to clipboard
    const copyReferralLink = () => {
        navigator.clipboard.writeText(referralData.referralLink)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 3000);
                toast.success('Referral link copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                toast.error('Failed to copy link. Please try again.');
            });
    };

    // Share referral link
    const shareReferralLink = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Join me on Adiyo',
                    text: 'Use my referral link to join Adiyo and get exclusive benefits!',
                    url: referralData?.referralLink
                });
                toast.success('Thanks for sharing!');
            } catch (err) {
                console.error('Share failed:', err);
                // Fall back to copy if share dialog was canceled
                copyReferralLink();
            }
        } else {
            // No share API support, fall back to copy
            copyReferralLink();
        }
    };

    return (
        <div className="flex-1 p-3 sm:p-6 bg-white m-2 sm:m-6 rounded-md shadow-sm min-h-screen">
            {/* Header Section */}
            <div className="bg-gray-50 p-3 sm:p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Gift className="mr-2 sm:mr-3 text-gray-800" size={20} />
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">My Referrals</h2>
                    </div>
                    <div className="flex items-center">
                        <span className="bg-black text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                            {referralData?.totalReferrals} referrals
                        </span>
                    </div>
                </div>
            </div>

            {/* Show error message if any */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 sm:p-4 m-3 sm:m-6 rounded-md text-sm">
                    {error}
                </div>
            )}

            {/* Referral Stats & Invite Cards */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6 p-3 sm:p-6">
                <Card className="bg-white shadow-sm border border-gray-200">
                    <CardHeader className="pb-1 sm:pb-2 p-4 sm:p-6">
                        <CardTitle className="text-gray-500 text-xs sm:text-sm font-medium">Total Referral Earnings</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                        <div className="flex items-end">
                            <span className="text-2xl sm:text-3xl font-bold">₹{referralData?.totalEarned.toFixed(2)}</span>
                            <span className="text-xs sm:text-sm text-gray-500 ml-2 mb-1">Earned</span>
                        </div>

                        {referralData?.pendingAmount > 0 && (
                            <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm">
                                <Gift size={14} className="text-gray-500 mr-2" />
                                <span className="text-gray-600">₹{referralData?.pendingAmount.toFixed(2)} pending from recent referrals</span>
                            </div>
                        )}

                        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row space-y-2 sm:space-y-0">
                            <button
                                className="bg-black text-white px-4 py-2 rounded-lg text-xs sm:text-sm sm:mr-3 hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center"
                                onClick={shareReferralLink}
                            >
                                <Share2 size={14} className="mr-2" />
                                Share Invite Link
                            </button>
                            <button
                                className="border border-black text-black px-4 py-2 rounded-lg text-xs sm:text-sm hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center"
                                onClick={copyReferralLink}
                            >
                                {copied ? (
                                    <>
                                        <Check size={14} className="mr-2" />
                                        Copied
                                    </>
                                ) : (
                                    <>
                                        <Copy size={14} className="mr-2" />
                                        Copy Link
                                    </>
                                )}
                            </button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white shadow-sm border border-gray-200">
                    <CardHeader className="pb-1 sm:pb-2 p-4 sm:p-6">
                        <CardTitle className="text-gray-500 text-xs sm:text-sm font-medium">Referral Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                        <div className="grid grid-cols-2 gap-2 sm:gap-4">
                            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                <div className="flex items-center mb-1">
                                    <Users size={14} className="text-gray-600 mr-1 sm:mr-2" />
                                    <span className="text-xs sm:text-sm text-gray-600">Total Referrals</span>
                                </div>
                                <p className="text-lg sm:text-xl font-bold">{referralData?.totalReferrals}</p>
                            </div>
                            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                <div className="flex items-center mb-1">
                                    <Users size={14} className="text-gray-600 mr-1 sm:mr-2" />
                                    <span className="text-xs sm:text-sm text-gray-600">Active Referrals</span>
                                </div>
                                <p className="text-lg sm:text-xl font-bold">{referralData?.activeReferrals}</p>
                            </div>
                            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg col-span-2">
                                <div className="flex items-center mb-1">
                                    <Link size={14} className="text-gray-600 mr-1 sm:mr-2" />
                                    <span className="text-xs sm:text-sm text-gray-600">Your Referral Code</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-lg sm:text-xl font-bold font-mono">{referralData?.referralCode}</p>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(referralData?.referralCode);
                                            toast.success('Referral code copied!');
                                        }}
                                        className="text-xs sm:text-sm text-gray-600 hover:text-black"
                                    >
                                        <Copy size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search Bar */}
            <div className="p-3 sm:p-6 border-b border-gray-200 bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 sm:space-y-4 md:space-y-0">
                    <div className="relative w-full md:w-72">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-gray-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search referrals..."
                            className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center p-8 sm:p-16">
                    <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-gray-900"></div>
                </div>
            )}

            {/* Referrals List */}
            {!loading && referrals.length > 0 ? (
                <div className="divide-y divide-gray-200">
                    {referrals.map((referral) => (
                        <div key={referral.id} className="p-3 sm:p-6 hover:bg-gray-50 transition-all duration-200">
                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                                <div className="mb-3 md:mb-0">
                                    <div className="flex items-center">
                                        <div className="p-1 sm:p-2 rounded-full mr-2 sm:mr-4 bg-gray-100">
                                            <Users size={16} className="text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm sm:text-base">{referral?.name}</p>
                                            <p className="text-xs sm:text-sm text-gray-500">{referral?.email}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                    <p className="text-xs px-2 py-1 rounded-full inline-block bg-gray-100 text-gray-700">
                                        Joined: {referral?.joinedDate}
                                    </p>
                                    <p className="text-xs px-2 py-1 rounded-full inline-block bg-green-100 text-green-800">
                                        {referral?.status === 'active' ? 'Active' : 'Inactive'}
                                    </p>
                                    <p className="font-semibold text-green-600 text-sm sm:text-base">
                                        +₹{referral?.amount.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="p-3 sm:p-6 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 space-y-3 sm:space-y-0">
                            <p className="text-xs sm:text-sm text-gray-500">
                                Showing {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.totalReferrals)} of {pagination.totalReferrals} referrals
                            </p>
                            <div className="flex items-center">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`p-1 sm:p-2 rounded-lg mr-1 sm:mr-2 ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    <ChevronLeft size={16} />
                                </button>

                                {/* Show limited page buttons on mobile */}
                                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                                    .filter(pageNum => {
                                        // On mobile, show current page, first, last, and one before/after current
                                        if (window.innerWidth < 640) {
                                            return pageNum === 1 ||
                                                pageNum === pagination.totalPages ||
                                                pageNum === currentPage ||
                                                pageNum === currentPage - 1 ||
                                                pageNum === currentPage + 1;
                                        }
                                        return true;
                                    })
                                    .map(pageNum => (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg mx-1 text-xs sm:text-sm
                                                ${currentPage === pageNum ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                                        >
                                            {pageNum}
                                        </button>
                                    ))}

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                                    disabled={currentPage === pagination.totalPages}
                                    className={`p-1 sm:p-2 rounded-lg ml-1 sm:ml-2 ${currentPage === pagination.totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : !loading && (
                <div className="text-center py-8 sm:py-16">
                    <Users size={48} className="mx-auto text-gray-300 mb-4 sm:mb-6" />
                    <p className="text-lg sm:text-xl text-gray-700 font-medium mb-2">No referrals found</p>
                    <p className="text-gray-500 mb-4 sm:mb-6 text-sm px-4">
                        {searchQuery
                            ? "Try adjusting your search to see more results."
                            : "Share your referral link to invite friends and earn rewards."}
                    </p>
                    <button
                        className="bg-black text-white px-6 py-2 sm:px-8 sm:py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center mx-auto"
                        onClick={shareReferralLink}
                    >
                        <Share2 size={16} className="mr-2" />
                        Share Invite Link
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReferralDetails;
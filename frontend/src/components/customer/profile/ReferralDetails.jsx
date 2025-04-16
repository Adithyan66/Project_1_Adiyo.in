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
        referralLink: 'https://adiyo.in/join/YOUR123CODE',
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


            const response = await getUserReferrals(queryParams)

            // axios.get(
            //     `${API_BASE_URL}/user/referrals?${queryParams.toString()}`,
            //     { withCredentials: true }
            // );

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
        <div className="flex-1 p-6 bg-white m-6 rounded-md shadow-sm min-h-screen">
            {/* Header Section */}
            <div className="bg-gray-50 p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Gift className="mr-3 text-gray-800" size={24} />
                        <h2 className="text-2xl font-semibold text-gray-900">My Referrals</h2>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="bg-black text-white px-4 py-1 rounded-full text-sm font-medium">
                            {referralData?.totalReferrals} referrals
                        </span>
                    </div>
                </div>
            </div>

            {/* Show error message if any */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 m-6 rounded-md">
                    {error}
                </div>
            )}

            {/* Referral Stats & Invite Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                <Card className="bg-white shadow-sm border border-gray-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-gray-500 text-sm font-medium">Total Referral Earnings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end">
                            <span className="text-3xl font-bold">₹{referralData?.totalEarned.toFixed(2)}</span>
                            <span className="text-sm text-gray-500 ml-2 mb-1">Earned</span>
                        </div>

                        {referralData?.pendingAmount > 0 && (
                            <div className="mt-4 flex items-center text-sm">
                                <Gift size={16} className="text-gray-500 mr-2" />
                                <span className="text-gray-600">₹{referralData?.pendingAmount.toFixed(2)} pending from recent referrals</span>
                            </div>
                        )}

                        <div className="mt-6 flex">
                            <button
                                className="bg-black text-white px-4 py-2 rounded-lg text-sm mr-3 hover:bg-gray-800 transition-colors duration-200 flex items-center"
                                onClick={shareReferralLink}
                            >
                                <Share2 size={16} className="mr-2" />
                                Share Invite Link
                            </button>
                            <button
                                className="border border-black text-black px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors duration-200 flex items-center"
                                onClick={copyReferralLink}
                            >
                                {copied ? (
                                    <>
                                        <Check size={16} className="mr-2" />
                                        Copied
                                    </>
                                ) : (
                                    <>
                                        <Copy size={16} className="mr-2" />
                                        Copy Link
                                    </>
                                )}
                            </button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white shadow-sm border border-gray-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-gray-500 text-sm font-medium">Referral Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center mb-1">
                                    <Users size={16} className="text-gray-600 mr-2" />
                                    <span className="text-sm text-gray-600">Total Referrals</span>
                                </div>
                                <p className="text-xl font-bold">{referralData?.totalReferrals}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center mb-1">
                                    <Users size={16} className="text-gray-600 mr-2" />
                                    <span className="text-sm text-gray-600">Active Referrals</span>
                                </div>
                                <p className="text-xl font-bold">{referralData?.activeReferrals}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg col-span-2">
                                <div className="flex items-center mb-1">
                                    <Link size={16} className="text-gray-600 mr-2" />
                                    <span className="text-sm text-gray-600">Your Referral Code</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-xl font-bold font-mono">{referralData?.referralCode}</p>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(referralData?.referralCode);
                                            toast.success('Referral code copied!');
                                        }}
                                        className="text-sm text-gray-600 hover:text-black"
                                    >
                                        <Copy size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search Bar */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                    <div className="relative w-full md:w-72">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search referrals..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center p-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
                </div>
            )}

            {/* Referrals List */}
            {!loading && referrals.length > 0 ? (
                <div className="divide-y divide-gray-200">
                    {referrals.map((referral) => (
                        <div key={referral.id} className="p-6 hover:bg-gray-50 transition-all duration-200">
                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                                <div className="mb-4 md:mb-0">
                                    <div className="flex items-center">
                                        <div className="p-2 rounded-full mr-4 bg-gray-100">
                                            <Users size={20} className="text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{referral?.name}</p>
                                            <p className="text-sm text-gray-500">{referral?.email}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6">
                                    <p className="text-xs px-2 py-1 rounded-full inline-block bg-gray-100 text-gray-700">
                                        Joined: {referral?.joinedDate}
                                    </p>
                                    <p className="text-xs px-2 py-1 rounded-full inline-block bg-green-100 text-green-800">
                                        {referral?.status === 'active' ? 'Active' : 'Inactive'}
                                    </p>
                                    <p className="font-semibold text-green-600">
                                        +₹{referral?.amount.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="p-6 flex items-center justify-between border-t border-gray-200">
                            <p className="text-sm text-gray-500">
                                Showing {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.totalReferrals)} of {pagination.totalReferrals} referrals
                            </p>
                            <div className="flex items-center">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`p-2 rounded-lg mr-2 ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(pageNum => (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`w-8 h-8 flex items-center justify-center rounded-lg mx-1 ${currentPage === pageNum ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        {pageNum}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                                    disabled={currentPage === pagination.totalPages}
                                    className={`p-2 rounded-lg ml-2 ${currentPage === pagination.totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : !loading && (
                <div className="text-center py-16">
                    <Users size={64} className="mx-auto text-gray-300 mb-6" />
                    <p className="text-xl text-gray-700 font-medium mb-2">No referrals found</p>
                    <p className="text-gray-500 mb-6">
                        {searchQuery
                            ? "Try adjusting your search to see more results."
                            : "Share your referral link to invite friends and earn rewards."}
                    </p>
                    <button
                        className="bg-black text-white px-8 py-3 rounded-lg text-md font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center mx-auto"
                        onClick={shareReferralLink}
                    >
                        <Share2 size={18} className="mr-2" />
                        Share Invite Link
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReferralDetails;
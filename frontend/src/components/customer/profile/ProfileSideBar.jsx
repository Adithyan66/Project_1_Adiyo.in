
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
    ChevronRight,
    ChevronDown,
    ShoppingBag,
    Settings,
    Package,
    LogOut,
    User,
    MapPin,
    Gift,
    Star,
    Wallet,
    ShoppingCart,
    ScanHeart
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveSelection } from '../../../store/slices/userSidebarSelectedSlice';





const ProfileSideBar = () => {




    const dispatch = useDispatch();
    const navigate = useNavigate();

    const selectedSideBar = useSelector((state) => state.userSideSelected.activeSelection);
    const user = useSelector((state) => state.user.userInfo)


    // State to manage expanded sections
    const [expandedSections, setExpandedSections] = useState({
        accountSettings: true,
        myStuffs: true
    });

    // Toggle section expansion
    const toggleSection = (section) => {
        setExpandedSections({
            ...expandedSections,
            [section]: !expandedSections[section]
        });
    };

    // Handle navigation and selection
    const handleNavigation = (path, selection) => {
        dispatch(setActiveSelection(selection));
        navigate(path);
    };



    return (
        <aside className="w-82 bg-white shadow-lg rounded-lg overflow-hidden h-full sticky top-5">
            {/* User Profile Section */}
            <div className="bg-gray-50 p-6 border-b">
                <div className="flex items-center">
                    <div className="w-14 h-14 rounded-full overflow-hidden mr-4 border-2 border-gray-500">
                        <img
                            src={user?.profileImg}
                            alt="User avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <div className="text-lg font-medium"> {user?.username}</div>
                        <div className="text-sm text-gray-500">{user?.email}</div>
                    </div>
                </div>
            </div>

            {/* Menu Items */}
            <nav className="p-3">
                {/* My orders */}
                <div
                    className="mb-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
                    onClick={() => handleNavigation("/user/wishlist", "wishlist")}
                >
                    <div className="flex items-center justify-between px-4 py-3 cursor-pointer">
                        <div className="flex items-center">
                            <span className="mr-3 text-black bg-gray-100 p-2 rounded-lg">
                                <ScanHeart size={20} />
                            </span>
                            <span className="font-medium">My Wishlist</span>
                        </div>
                        <ChevronRight size={18} className="text-gray-500" />
                    </div>
                </div>

                {/* Account Settings */}
                <div className="mb-2 rounded-lg bg-gray-50">
                    <div
                        className="flex items-center justify-between px-4 py-3 cursor-pointer"
                        onClick={() => toggleSection('accountSettings')}
                    >
                        <div className="flex items-center">
                            <span className="mr-3 text-black bg-gray-100 p-2 rounded-lg">
                                <Settings size={20} />
                            </span>
                            <span className="font-medium">Account Settings</span>
                        </div>
                        {expandedSections.accountSettings ?
                            <ChevronDown size={18} className="text-gray-500" /> :
                            <ChevronRight size={18} className="text-gray-500" />
                        }
                    </div>

                    {/* Submenu for Account Settings */}
                    {expandedSections.accountSettings && (
                        <div className="ml-4 pl-8 border-l-2 border-gray-200 my-2">
                            <div
                                className={`py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer
                ${selectedSideBar === 'profile' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100'}`}
                                onClick={() => handleNavigation("/user/profile", "profile")}
                            >
                                <User size={16} className={`mr-2 ${selectedSideBar === 'profile' ? 'text-white' : 'text-gray-500'}`} />
                                <span>Profile Information</span>
                            </div>
                            <div
                                className={`py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer
                ${selectedSideBar === 'manageAddresses' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100'}`}
                                onClick={() => handleNavigation("/user/manage-address", "manageAddresses")}
                            >
                                <MapPin size={16} className={`mr-2 ${selectedSideBar === 'manageAddresses' ? 'text-white' : 'text-gray-500'}`} />
                                <span>Manage Addresses</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* My Stuffs */}
                <div className="mb-2 rounded-lg  transition-all duration-200">
                    <div
                        className="flex items-center justify-between px-4 py-3 cursor-pointer"
                        onClick={() => toggleSection('myStuffs')}
                    >
                        <div className="flex items-center">
                            <span className="mr-3 text-black bg-gray-100 p-2 rounded-lg">
                                <Package size={20} />
                            </span>
                            <span className="font-medium">My Stuffs</span>
                        </div>
                        {expandedSections.myStuffs ?
                            <ChevronDown size={18} className="text-gray-500" /> :
                            <ChevronRight size={18} className="text-gray-500" />
                        }
                    </div>

                    {/* Submenu for My Stuffs */}
                    {expandedSections.myStuffs && (
                        <div className="ml-4 pl-8 border-l-2 border-gray-200 my-2">
                            <div
                                className="py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer hover:bg-gray-100"
                                onClick={() => handleNavigation("/user/coupons", "coupons")}
                            >
                                <Gift size={16} className="mr-2 text-gray-500" />
                                <span>My Coupons</span>
                            </div>
                            <div
                                className="py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer hover:bg-gray-100"
                                onClick={() => handleNavigation("/user/orders-list", "orders")}
                            >
                                <ShoppingBag size={16} className="mr-2 text-gray-500" />
                                <span>My Orders</span>
                            </div>
                            <div
                                className="py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer hover:bg-gray-100"
                                onClick={() => handleNavigation("/user/view-cart", "view-cart")}
                            >
                                <ShoppingCart size={16} className="mr-2 text-gray-500" />
                                <span>My Cart</span>
                            </div>
                            <div
                                className="py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer hover:bg-gray-100"
                                onClick={() => handleNavigation("/user/reviews", "reviews")}
                            >
                                <Star size={16} className="mr-2 text-gray-500" />
                                <span>My Reviews & Ratings</span>
                            </div>
                            <div
                                className="py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer hover:bg-gray-100"
                                onClick={() => handleNavigation("/user/referrals", "referrals")}
                            >
                                <Star size={16} className="mr-2 text-gray-500" />
                                <span>My Referrals</span>
                            </div>
                            <div
                                className="py-3 px-4 my-1 rounded-lg flex items-center cursor-pointer hover:bg-gray-100"
                                onClick={() => handleNavigation("/user/wallet", "wallet")}
                            >
                                <Wallet size={16} className="mr-2 text-gray-500" />
                                <span>My Wallet</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Log out */}
                <div className="mt-6">
                    <div className="flex items-center px-4 py-3 cursor-pointer rounded-lg hover:bg-gray-100 transition-all duration-200">
                        <span className="mr-3 bg-red- text-black bg-gray-100 p-2 rounded-lg">
                            <LogOut size={20} />
                        </span>
                        <span className="font-medium">Log out</span>
                    </div>
                </div>
            </nav>

            {/* Support section */}
            <div className="mt-4 p-4 border-t">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-black font-medium">Need help?</p>
                    <button className="mt-2 text-xs bg-black text-white px-4 py-2 rounded-lg">
                        Contact Support
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default ProfileSideBar;
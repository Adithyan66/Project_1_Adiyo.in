import React from 'react';
import { ChevronRight, ShoppingBag, Settings, Package, CreditCard, LogOut } from 'lucide-react';




const ProfileSideBar = () => {



    const menuItems = [
        { id: 1, label: 'My orders', icon: <ShoppingBag size={18} />, hasArrow: true },
        {
            id: 2, label: 'Account Settings', icon: <Settings size={18} />, hasArrow: false,
            submenu: [
                { id: 'profile', label: 'Profile Information', active: true },
                { id: 'address', label: 'Manage Addresses', active: false }
            ]
        },
        {
            id: 3, label: 'My Stuffs', icon: <Package size={18} />, hasArrow: true,
            submenu: [
                { id: 'coupons', label: 'My Coupons', active: false },
                { id: 'reviews', label: 'My reviews & ratings', active: false },
                { id: 'wallet', label: 'My Wallet', active: false }
            ]
        },
        { id: 4, label: 'Log out', icon: <LogOut size={18} />, hasArrow: false },
    ];

    return (
        <aside className="w-64 bg-white shadow-sm">
            {/* User Avatar and Name */}
            <div className="flex items-center p-4 border-b">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                    <img
                        src="/api/placeholder/40/40"
                        alt="User avatar"
                        className="w-full h-full object-cover"
                    />
                </div>
                <span className="font-medium">Hello, Adhi</span>
            </div>

            {/* Menu Items */}
            <nav className="mt-2">
                {menuItems.map((item) => (
                    <div key={item.id} className="mb-1">
                        <div className={`flex items-center justify-between px-4 py-3 hover:bg-gray-100 cursor-pointer
              ${item.label === 'Account Settings' ? 'bg-gray-50' : ''}`}>
                            <div className="flex items-center">
                                <span className="mr-3 text-gray-600">{item.icon}</span>
                                <span className="text-sm">{item.label}</span>
                            </div>
                            {item.hasArrow && <ChevronRight size={16} />}
                        </div>

                        {/* Submenu for Account Settings */}
                        {item.label === 'Account Settings' && (
                            <div className="pl-10">
                                {item.submenu.map((subItem) => (
                                    <div
                                        key={subItem.id}
                                        className={`py-2 px-4 text-sm ${subItem.active ? 'bg-black text-white' : 'text-gray-700'}`}
                                    >
                                        {subItem.label}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Submenu for My Stuffs */}
                        {item.label === 'My Stuffs' && (
                            <div className="pl-10 hidden">
                                {item.submenu.map((subItem) => (
                                    <div
                                        key={subItem.id}
                                        className="py-2 px-4 text-sm text-gray-700"
                                    >
                                        {subItem.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>
        </aside>
    );
};

export default ProfileSideBar;

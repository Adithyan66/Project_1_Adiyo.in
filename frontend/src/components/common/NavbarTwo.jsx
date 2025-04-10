import React from 'react';
import logo from "../../assets/images/Adiyo.in.svg";
import mail from "../../assets/images/mail.png";
import notification from "../../assets/images/notification.png";

const NavbarTwo = () => {

    return (

        <nav className="flex items-center justify-between bg-gray-100 shadow px-4 py-2">
            {/* Left Section: Logo */}
            <div className="flex items-center">
                {/* Dummy Logo (replace with your actual Adiyo logo) */}
                <img
                    src={logo}
                    alt="Adiyo Logo"
                    className="h-8 w-auto mr-2 ml-10"
                />
            </div>

            {/* Middle Section: Search Bar */}


            {/* Right Section: Icons (replace with real icons or images) */}
            <div className="flex items-center space-x-4">
                <button className="p-2 hover:bg-gray-100 rounded">
                    {/* Icon placeholder 1 (e.g. Gmail icon) */}
                    <img
                        src={mail}
                        alt="Icon 1"
                    />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded">
                    {/* Icon placeholder 2 */}
                    <img
                        src={notification}
                        alt="Icon 2"
                    />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded">
                    {/* Icon placeholder 3 (e.g. User Avatar) */}
                    <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb2DlIR_yJjRktGY0SE-bPyAjzPYH3U9jn9g&s"
                        alt="Icon 3"
                        className='h-15 w-15 rounded-full object-cover'
                    />
                </button>
            </div>
        </nav>
    );
};

export default NavbarTwo;

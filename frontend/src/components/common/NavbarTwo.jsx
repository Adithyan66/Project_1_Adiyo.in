// import React from 'react';
// import logo from "../../assets/images/Adiyo.in.svg";
// import mail from "../../assets/images/mail.png";
// import notification from "../../assets/images/notification.png";

// const NavbarTwo = () => {

//     return (

//         <nav className="flex items-center justify-between bg-gray-100 shadow px-4 py-2">
//             {/* Left Section: Logo */}
//             <div className="flex items-center">
//                 {/* Dummy Logo (replace with your actual Adiyo logo) */}
//                 <img
//                     src={logo}
//                     alt="Adiyo Logo"
//                     className="h-8 w-auto mr-2 ml-10"
//                 />
//             </div>

//             {/* Middle Section: Search Bar */}


//             {/* Right Section: Icons (replace with real icons or images) */}
//             <div className="flex items-center space-x-4">
//                 <button className="p-2 hover:bg-gray-100 rounded">
//                     {/* Icon placeholder 1 (e.g. Gmail icon) */}
//                     <img
//                         src={mail}
//                         alt="Icon 1"
//                     />
//                 </button>
//                 <button className="p-2 hover:bg-gray-100 rounded">
//                     {/* Icon placeholder 2 */}
//                     <img
//                         src={notification}
//                         alt="Icon 2"
//                     />
//                 </button>
//                 <button className="p-2 hover:bg-gray-100 rounded">
//                     {/* Icon placeholder 3 (e.g. User Avatar) */}
//                     <img
//                         src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb2DlIR_yJjRktGY0SE-bPyAjzPYH3U9jn9g&s"
//                         alt="Icon 3"
//                         className='h-15 w-15 rounded-full object-cover'
//                     />
//                 </button>
//             </div>
//         </nav>
//     );
// };

// export default NavbarTwo;




import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import logo from "../../assets/images/Adiyo.in.svg";
import mail from "../../assets/images/mail.png";
import notification from "../../assets/images/notification.png";
import { toggleSidebar } from '../../store/slices/sideBarSlice';

const NavbarTwo = () => {
    const dispatch = useDispatch();
    const { isOpen } = useSelector((state) => state.sidebar);

    const handleToggleSidebar = () => {
        dispatch(toggleSidebar());
    };

    return (
        <nav className="flex items-center justify-between bg-gray-100 shadow px-4 py-2 ">
            {/* Left Section: Hamburger on mobile, hidden on desktop */}
            <div className="md:hidden flex items-center">
                <button
                    onClick={handleToggleSidebar}
                    className="p-2 text-gray-600 hover:bg-gray-200 rounded"
                    aria-label="Toggle sidebar"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                        />
                    </svg>
                </button>
            </div>

            {/* Logo Section: Centered on mobile, left on desktop */}
            <div className="flex items-center md:ml-10 absolute left-1/2 md:relative md:left-20 transform -translate-x-1/2 md:transform-none ">
                <img
                    src={logo}
                    alt="Adiyo Logo"
                    className="h-8 w-auto"
                />
            </div>

            {/* Right Section: Icons - pushed to right on all screens */}
            <div className="flex items-center space-x-2 md:space-x-4">
                <button className="p-1 md:p-2 hover:bg-gray-200 rounded">
                    <img
                        src={mail}
                        alt="Mail"
                        className="h-5 w-5 md:h-6 md:w-6"
                    />
                </button>
                <button className="p-1 md:p-2 hover:bg-gray-200 rounded">
                    <img
                        src={notification}
                        alt="Notifications"
                        className="h-5 w-5 md:h-6 md:w-6"
                    />
                </button>
                <button className="p-1 md:p-2 hover:bg-gray-200 rounded">
                    <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb2DlIR_yJjRktGY0SE-bPyAjzPYH3U9jn9g&s"
                        alt="User Avatar"
                        className="h-6 w-6 md:h-8 md:w-8 rounded-full object-cover"
                    />
                </button>
            </div>
        </nav>
    );
};

export default NavbarTwo;
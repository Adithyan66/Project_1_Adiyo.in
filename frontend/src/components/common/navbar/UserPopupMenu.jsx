
// import { useDispatch, useSelector } from "react-redux";
// import { setLoginPopup, setActiveForm } from "../../../store/slices/authModalSlice.js"
// import { setActiveSelection } from "../../../store/slices/userSidebarSelectedSlice.js";
// import { useNavigate } from "react-router";

// import SignupForm from "../authmodal/SignupForm";
// import LoginForm from "../authmodal/LoginForm";
// import Forgot from "../authmodal/Forgot";

// import { logout } from "../../../store/slices/userSlice.js"
// import { logout as logoutService } from "../../../services/authService.js"

// import {
//   ProfileIcon,
//   AdiyoPlusZoneIcon,
//   OrdersIcon,
//   RewardsIcon,
//   GiftCardsIcon,
//   BecomeSellerIcon,
//   UserLogo,
//   Logout,
// } from "../../../icons/icons";


// function UserPopupMenu({ popupRef }) {



//   const navigate = useNavigate()
//   const dispatch = useDispatch();

//   const { loginPopup, activeForm } = useSelector((state) => state.authModal);


//   const user = useSelector((state) => state.user.userInfo);
//   console.log("userInfo from userpopup", user);

//   const handleOverlayClick = () => {
//     dispatch(setLoginPopup(false));
//   };

//   const handleModalClick = (e) => {
//     e.stopPropagation();
//   };

//   const handleLogout = async () => {
//     try {
//       const response = await logoutService()

//       console.log(response.data)

//       dispatch(logout())

//     } catch (error) {

//       console.log("logout fails");

//     }
//   }

//   const protectRoute = (route) => {

//     if (user) {
//       navigate(route)
//     } else {
//       dispatch(setActiveForm("login"));
//       dispatch(setLoginPopup(true));
//     }
//   }


//   return (
//     <>
//       <div
//         ref={popupRef}
//         className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
//       >
//         {user ? (
//           <a
//             href="#"
//             className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 text-2xl mb-3"
//           >
//             <UserLogo />
//             <span>{user.username}</span>
//           </a>
//         ) : (
//           <>
//             <a
//               href="#"
//               className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
//               onClick={() => {
//                 dispatch(setActiveForm("login"));
//                 dispatch(setLoginPopup(true));
//               }}
//             >
//               Login
//             </a>
//             <a
//               href="#"
//               className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
//               onClick={() => {
//                 dispatch(setActiveForm("signup"));
//                 dispatch(setLoginPopup(true));
//               }}
//             >
//               New Customer? Sign Up
//             </a>
//           </>
//         )}

//         <a
//           href="#"
//           className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
//           onClick={() => {
//             dispatch(setActiveSelection("profile"))
//             protectRoute("/user/profile")
//           }}
//         >
//           <ProfileIcon /> My Profile
//         </a>
//         {/* Additional menu items */}
//         <a
//           href="#"
//           className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
//         >
//           <AdiyoPlusZoneIcon /> Adiyo plus zone
//         </a>
//         <a
//           href="#"
//           className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
//         >
//           <OrdersIcon /> Orders
//         </a>
//         <a
//           href="#"
//           className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
//         >
//           <RewardsIcon /> Rewards
//         </a>
//         <a
//           href="#"
//           className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
//         >
//           <GiftCardsIcon /> Gift Cards
//         </a>
//         <a
//           href="#"
//           className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
//         >
//           <BecomeSellerIcon /> Become Seller
//         </a>

//         {user && (
//           <a
//             href="#"
//             className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
//             onClick={() => handleLogout()}
//           >
//             <Logout /> <span className="ml-5">Log Out</span>
//           </a>
//         )}
//       </div>

//       {loginPopup && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center">
//           {/* Overlay */}
//           <div
//             className="absolute inset-0 bg-black opacity-50"
//             onClick={handleOverlayClick}
//           ></div>
//           {/* Modal container */}
//           <div id="login-modal" className="relative z-10" onClick={handleModalClick}>
//             {activeForm === "login" && (
//               <LoginForm
//                 onClose={() => dispatch(setLoginPopup(false))}
//                 onSwitch={dispatch.bind(null, setActiveForm)}
//               />
//             )}
//             {activeForm === "signup" && (
//               <SignupForm
//                 onClose={() => dispatch(setLoginPopup(false))}
//                 onSwitch={dispatch.bind(null, setActiveForm)}
//               />
//             )}
//             {activeForm === "forgot" && (
//               <Forgot
//                 onClose={() => dispatch(setLoginPopup(false))}
//                 onSwitch={dispatch.bind(null, setActiveForm)}
//               />
//             )}
//             {activeForm === "reset" && (
//               <ResetPasswordForm
//                 onClose={() => dispatch(setLoginPopup(false))}
//                 onSwitch={dispatch.bind(null, setActiveForm)}
//               />
//             )}
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default UserPopupMenu;



















// import { useState, useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useLocation, useNavigate } from "react-router-dom";
// import { setLoginPopup, setActiveForm } from "../../../store/slices/authModalSlice.js";
// import { setActiveSelection } from "../../../store/slices/userSidebarSelectedSlice.js";
// import { logout } from "../../../store/slices/userSlice.js";
// import { logout as logoutService } from "../../../services/authService.js";

// import SignupForm from "../authmodal/SignupForm";
// import LoginForm from "../authmodal/LoginForm";
// import Forgot from "../authmodal/Forgot";

// import {
//   ProfileIcon,
//   AdiyoPlusZoneIcon,
//   OrdersIcon,
//   RewardsIcon,
//   GiftCardsIcon,
//   BecomeSellerIcon,
//   UserLogo,
//   Logout,
// } from "../../../icons/icons";

// function UserPopupMenu({ popupRef }) {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const modalRef = useRef(null); // Ref for modal to manage focus
//   const { loginPopup, activeForm } = useSelector((state) => state.authModal);
//   const user = useSelector((state) => state.user.userInfo);
//   const [isLoggingOut, setIsLoggingOut] = useState(false); // Loading state for logout

//   // Reset loginPopup on route change
//   useEffect(() => {
//     dispatch(setLoginPopup(false));
//   }, [location.pathname, dispatch]);

//   // Focus trapping for modal accessibility
//   useEffect(() => {
//     if (loginPopup && modalRef.current) {
//       const focusableElements = modalRef.current.querySelectorAll(
//         'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
//       );
//       const firstElement = focusableElements[0];
//       const lastElement = focusableElements[focusableElements.length - 1];

//       const handleKeyDown = (e) => {
//         if (e.key === "Tab") {
//           if (e.shiftKey && document.activeElement === firstElement) {
//             e.preventDefault();
//             lastElement.focus();
//           } else if (!e.shiftKey && document.activeElement === lastElement) {
//             e.preventDefault();
//             firstElement.focus();
//           }
//         }
//         if (e.key === "Escape") {
//           dispatch(setLoginPopup(false));
//         }
//       };

//       firstElement?.focus();
//       document.addEventListener("keydown", handleKeyDown);
//       return () => document.removeEventListener("keydown", handleKeyDown);
//     }
//   }, [loginPopup, dispatch]);

//   const handleOverlayClick = () => {
//     dispatch(setLoginPopup(false));
//   };

//   const handleModalClick = (e) => {
//     e.stopPropagation();
//   };

//   const handleLogout = async () => {
//     setIsLoggingOut(true);
//     try {
//       await logoutService();
//       dispatch(logout());
//       navigate("/"); // Redirect to home after logout
//     } catch (error) {
//       // Use a toast notification library (e.g., react-toastify) in production
//       alert("Logout failed. Please try again.");
//     } finally {
//       setIsLoggingOut(false);
//     }
//   };

//   const protectRoute = (route, selection) => {
//     if (user) {
//       if (selection) dispatch(setActiveSelection(selection));
//       navigate(route);
//     } else {
//       dispatch(setActiveForm("login"));
//       dispatch(setLoginPopup(true));
//     }
//   };

//   return (
//     <>
//       <div
//         ref={popupRef}
//         className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-2 z-50"
//       >
//         {user ? (
//           <div className="flex items-center gap-2 px-4 py-2 text-gray-700 text-base font-medium border-b mb-2">
//             <UserLogo className="w-5 h-5" />
//             <span>{user.username}</span>
//           </div>
//         ) : (
//           <>
//             <button
//               className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
//               onClick={() => {
//                 dispatch(setActiveForm("login"));
//                 dispatch(setLoginPopup(true));
//               }}
//               aria-label="Login"
//             >
//               Login
//             </button>
//             <button
//               className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
//               onClick={() => {
//                 dispatch(setActiveForm("signup"));
//                 dispatch(setLoginPopup(true));
//               }}
//               aria-label="Sign Up"
//             >
//               New Customer? Sign Up
//             </button>
//           </>
//         )}

//         <button
//           className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
//           onClick={() => protectRoute("/user/profile", "profile")}
//           aria-label="My Profile"
//         >
//           <ProfileIcon className="w-5 h-5" />
//           My Profile
//         </button>
//         <button
//           className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
//           onClick={() => protectRoute("/user/plus-zone", null)}
//           aria-label="Adiyo Plus Zone"
//         >
//           <AdiyoPlusZoneIcon className="w-5 h-5" />
//           Adiyo Plus Zone
//         </button>
//         <button
//           className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
//           onClick={() => protectRoute("/user/orders", "orders")}
//           aria-label="Orders"
//         >
//           <OrdersIcon className="w-5 h-5" />
//           Orders
//         </button>
//         <button
//           className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
//           onClick={() => protectRoute("/user/rewards", null)}
//           aria-label="Rewards"
//         >
//           <RewardsIcon className="w-5 h-5" />
//           Rewards
//         </button>
//         <button
//           className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
//           onClick={() => protectRoute("/user/gift-cards", null)}
//           aria-label="Gift Cards"
//         >
//           <GiftCardsIcon className="w-5 h-5" />
//           Gift Cards
//         </button>
//         <button
//           className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
//           onClick={() => navigate("/seller/register")}
//           aria-label="Become Seller"
//         >
//           <BecomeSellerIcon className="w-5 h-5" />
//           Become Seller
//         </button>

//         {user && (
//           <button
//             className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
//             onClick={handleLogout}
//             disabled={isLoggingOut}
//             aria-label="Log Out"
//           >
//             <Logout className="w-5 h-5" />
//             {isLoggingOut ? "Logging Out..." : "Log Out"}
//           </button>
//         )}
//       </div>

//       {loginPopup && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center">
//           {/* Overlay */}
//           <div
//             className="absolute inset-0 bg-black opacity-50"
//             onClick={handleOverlayClick}
//             aria-hidden="true"
//           ></div>
//           {/* Modal container */}
//           <div
//             ref={modalRef}
//             id="login-modal"
//             className="relative z-[110] bg-white rounded-lg p-6 max-w-md w-full"
//             role="dialog"
//             aria-modal="true"
//             onClick={handleModalClick}
//           >
//             {activeForm === "login" && (
//               <LoginForm
//                 onClose={() => dispatch(setLoginPopup(false))}
//                 onSwitch={(form) => dispatch(setActiveForm(form))}
//               />
//             )}
//             {activeForm === "signup" && (
//               <SignupForm
//                 onClose={() => dispatch(setLoginPopup(false))}
//                 onSwitch={(form) => dispatch(setActiveForm(form))}
//               />
//             )}
//             {activeForm === "forgot" && (
//               <Forgot
//                 onClose={() => dispatch(setLoginPopup(false))}
//                 onSwitch={(form) => dispatch(setActiveForm(form))}
//               />
//             )}

//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default UserPopupMenu;












import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setLoginPopup, setActiveForm } from "../../../store/slices/authModalSlice.js";
import { setActiveSelection } from "../../../store/slices/userSidebarSelectedSlice.js";
import { logout } from "../../../store/slices/userSlice.js";
import { logout as logoutService } from "../../../services/authService.js";

import SignupForm from "../authmodal/SignupForm";
import LoginForm from "../authmodal/LoginForm";
import Forgot from "../authmodal/Forgot";

import {
  ProfileIcon,
  AdiyoPlusZoneIcon,
  OrdersIcon,
  RewardsIcon,
  GiftCardsIcon,
  BecomeSellerIcon,
  UserLogo,
  Logout,
} from "../../../icons/icons";

function UserPopupMenu({ popupRef }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const modalRef = useRef(null); // Ref for modal to manage focus
  const { loginPopup, activeForm } = useSelector((state) => state.authModal);
  const user = useSelector((state) => state.user.userInfo);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Loading state for logout

  // Reset loginPopup on route change
  useEffect(() => {
    dispatch(setLoginPopup(false));
  }, [location.pathname, dispatch]);

  // Focus trapping for modal accessibility
  useEffect(() => {
    if (loginPopup && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleKeyDown = (e) => {
        if (e.key === "Tab") {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
        if (e.key === "Escape") {
          dispatch(setLoginPopup(false));
        }
      };

      firstElement?.focus();
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [loginPopup, dispatch]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutService();
      dispatch(logout());
      navigate("/"); // Redirect to home after logout
    } catch (error) {
      // Use a toast notification library (e.g., react-toastify) in production
      alert("Logout failed. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const protectRoute = (route, selection) => {
    if (user) {
      if (selection) dispatch(setActiveSelection(selection));
      navigate(route);
    } else {
      dispatch(setActiveForm("login"));
      dispatch(setLoginPopup(true));
    }
  };

  return (
    <>
      <div
        ref={popupRef}
        className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-2 z-50"
      >
        {user ? (
          <div className="flex items-center gap-2 px-4 py-2 text-gray-700 text-base font-medium border-b mb-2">
            <UserLogo className="w-5 h-5" />
            <span>{user.username}</span>
          </div>
        ) : (
          <>
            <button
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
              onClick={() => {
                dispatch(setActiveForm("login"));
                dispatch(setLoginPopup(true));
              }}
              aria-label="Login"
            >
              Login
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
              onClick={() => {
                dispatch(setActiveForm("signup"));
                dispatch(setLoginPopup(true));
              }}
              aria-label="Sign Up"
            >
              New Customer? Sign Up
            </button>
          </>
        )}

        <button
          className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
          onClick={() => protectRoute("/user/profile", "profile")}
          aria-label="My Profile"
        >
          <ProfileIcon className="w-5 h-5" />
          My Profile
        </button>
        {/* <button
          className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
          onClick={() => protectRoute("/user/plus-zone", null)}
          aria-label="Adiyo Plus Zone"
        >
          <AdiyoPlusZoneIcon className="w-5 h-5" />
          Adiyo Plus Zone
        </button>
        <button
          className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
          onClick={() => protectRoute("/user/orders", "orders")}
          aria-label="Orders"
        >
          <OrdersIcon className="w-5 h-5" />
          Orders
        </button>
        <button
          className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
          onClick={() => protectRoute("/user/rewards", null)}
          aria-label="Rewards"
        >
          <RewardsIcon className="w-5 h-5" />
          Rewards
        </button>
        <button
          className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
          onClick={() => protectRoute("/user/gift-cards", null)}
          aria-label="Gift Cards"
        >
          <GiftCardsIcon className="w-5 h-5" />
          Gift Cards
        </button>
        <button
          className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
          onClick={() => navigate("/seller/register")}
          aria-label="Become Seller"
        >
          <BecomeSellerIcon className="w-5 h-5" />
          Become Seller
        </button> */}

        {user && (
          <button
            className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
            onClick={handleLogout}
            disabled={isLoggingOut}
            aria-label="Log Out"
          >
            <Logout className="w-5 h-5" />
            {isLoggingOut ? "Logging Out..." : "Log Out"}
          </button>
        )}
      </div>

      {loginPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Dark overlay (kept but no click handler) */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            aria-hidden="true"
          ></div>

          {/* Modal container */}
          <div
            ref={modalRef}
            id="login-modal"
            className="relative z-[110] bg-white rounded-lg p-6 max-w-md w-full"
            role="dialog"
            aria-modal="true"
          >
            {/* Close button */}
            <button
              onClick={() => dispatch(setLoginPopup(false))}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {activeForm === "login" && (
              <LoginForm
                onClose={() => dispatch(setLoginPopup(false))}
                onSwitch={(form) => dispatch(setActiveForm(form))}
              />
            )}
            {activeForm === "signup" && (
              <SignupForm
                onClose={() => dispatch(setLoginPopup(false))}
                onSwitch={(form) => dispatch(setActiveForm(form))}
              />
            )}
            {activeForm === "forgot" && (
              <Forgot
                onClose={() => dispatch(setLoginPopup(false))}
                onSwitch={(form) => dispatch(setActiveForm(form))}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default UserPopupMenu;
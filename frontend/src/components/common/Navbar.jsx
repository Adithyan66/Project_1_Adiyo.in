

import { NavButtons } from "./navbar/NavButtons.jsx";
import { useEffect, useRef, useState } from "react";

import UserPopupMenu from "./navbar/UserPopupMenu";

import { setActiveForm, setLoginPopup } from "../../store/slices/authModalSlice.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { SearchBar } from "./navbar/SearchBar.jsx";
import { NavLinks } from "./navbar/NavLinks.jsx";
import { NavBrand } from "./navbar/NavBrand.jsx"

function Navbar({ setSearchTerm, toProductPage }) {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);

  // useEffect(() => {
  //   function handleClickOutside(event) {
  //     const modalEl = document.getElementById("login-modal");

  //     if (
  //       popupRef.current &&
  //       !popupRef.current.contains(event.target) &&
  //       !(modalEl && modalEl.contains(event.target))
  //     ) {
  //       setIsOpen(false);
  //       dispatch(setLoginPopup(false));
  //       dispatch(setActiveForm(""));
  //     }
  //   }
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, [dispatch]);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md px-4 sm:px-6 lg:px-8 py-2 sm:py-3">
      {/* Mobile layout (< 640px): Logo centered on top, search and buttons below */}
      <div className="sm:hidden flex flex-col items-center">
        {/* Top row: Centered logo */}
        <div className="w-full flex justify-center mb-3">
          <NavBrand mobileView={true} />
        </div>

        {/* Bottom row: Search bar and buttons */}
        <div className="w-full flex items-center justify-between">
          <div className="flex-grow pr-2">
            <SearchBar
              setSearchTerm={setSearchTerm}
              toProductPage={toProductPage}
              mobileView={true}
            />
          </div>
          <div className="flex-shrink-0">
            <NavButtons onUserClick={() => setIsOpen(!isOpen)} mobileView={true} />
          </div>
        </div>
      </div>

      {/* Desktop layout (≥ 640px): Original horizontal layout */}
      <div className="hidden sm:flex items-center justify-between py-3">
        <NavBrand />
        <div className="flex items-center">
          <div className="mr-4">
            <SearchBar setSearchTerm={setSearchTerm} toProductPage={toProductPage} />
          </div>
          <NavButtons onUserClick={() => setIsOpen(!isOpen)} isOpen={isOpen} />
        </div>
      </div>

      {/* User popup (positioned appropriately for both layouts) */}
      {isOpen && (
        <div className="absolute right-4 sm:right-6 lg:right-8 top-[5.5rem] sm:top-16">
          <UserPopupMenu />
        </div>
      )}
    </nav>
  );
}

export default Navbar;
















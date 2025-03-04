
import { useEffect, useRef, useState } from "react";
import NavBrand from "./navbar/NavBrand";
import SearchBar from "./navbar/SearchBar";
import NavButtons from "./navbar/NavButtons";
import UserPopupMenu from "./navbar/UserPopupMenu";

import { setActiveForm, setLoginPopup } from "../../store/slices/authModalSlice.js";
import { useDispatch } from "react-redux";


function Navbar({ setSearchTerm, toProductPage }) {

  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {

    function handleClickOutside(event) {

      const modalEl = document.getElementById("login-modal");

      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        !(modalEl && modalEl.contains(event.target))
      ) {
        setIsOpen(false);
        dispatch(setLoginPopup(false));
        dispatch(setActiveForm(""));
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (

    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md px-4 sm:px-6 lg:px-8 p-3">
      <div className="flex items-center justify-between h-16">
        <NavBrand />
        <SearchBar setSearchTerm={setSearchTerm} toProductPage={toProductPage} />
        <NavButtons onUserClick={() => setIsOpen(!isOpen)} />
        {isOpen && <UserPopupMenu popupRef={popupRef} />}
      </div>
    </nav>
  );
}

export default Navbar;

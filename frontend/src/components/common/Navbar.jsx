
import { useEffect, useRef, useState } from "react";
import NavBrand from "./navbar/NavBrand";
import SearchBar from "./navbar/SearchBar";
import NavButtons from "./navbar/NavButtons";
import UserPopupMenu from "./navbar/UserPopupMenu";



function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      // Get modal container if it exists
      const modalEl = document.getElementById("login-modal");
      // Close if click is outside both the popup and the modal (if open)
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        !(modalEl && modalEl.contains(event.target))
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    // Added `fixed top-0 left-0 w-full z-50`
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md px-4 sm:px-6 lg:px-8 p-3">
      <div className="flex items-center justify-between h-16">
        <NavBrand />
        <SearchBar />
        <NavButtons onUserClick={() => setIsOpen(!isOpen)} />
        {isOpen && <UserPopupMenu popupRef={popupRef} />}
      </div>
    </nav>
  );
}

export default Navbar;

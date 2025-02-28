import React from "react";

function SearchBar() {
  return (
    <div className="flex justify-center flex-1">
      <div className="relative w-[550px]">
        <svg
          className="absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
        >
          <path d="M21.15 19.74a12 12 0 1 0-1.41 1.41l10.55 10.56 1.41-1.41zM12 22a10 10 0 1 1 10-10 10 10 0 0 1-10 10z" />
        </svg>
        <input
          type="text"
          placeholder="Search for products..."
          className="w-full rounded-full bg-gray-100 pl-10 pr-4 py-3 text-sm focus:outline-none"
        />
      </div>
    </div>
  );
}

export default SearchBar;

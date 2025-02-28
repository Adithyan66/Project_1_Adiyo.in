import React from "react";

function NavLinks() {
  return (
    <div className="hidden md:flex flex-1 ml-24">
      <div className="flex space-x-14">
        <a
          href="#"
          className="text-gray-700 hover:text-gray-900 flex items-center"
        >
          Shop{" "}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
            <path d="M12 17.414 3.293 8.707l1.414-1.414L12 14.586l7.293-7.293 1.414 1.414L12 17.414z" />
          </svg>
        </a>
        <a href="#" className="text-gray-700 hover:text-gray-900">
          On Sale
        </a>
        <a href="#" className="text-gray-700 hover:text-gray-900">
          New Arrivals
        </a>
        <a href="#" className="text-gray-700 hover:text-gray-900">
          Brands
        </a>
      </div>
    </div>
  );
}

export default NavLinks;

import React from "react";
import logo from "../../../assets/images/Adiyo.in.svg";
import NavLinks from "./NavLinks";

function NavBrand() {
  return (
    <div className="flex items-center">
      <div className="flex-shrink-0 ml-[15px]">
        <img src={logo} alt="Adiyo.in" className="h-8" />
      </div>
      <NavLinks />
    </div>
  );
}

export default NavBrand;

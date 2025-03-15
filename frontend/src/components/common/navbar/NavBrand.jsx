import React from "react";
import logo from "../../../assets/images/Adiyo.in.svg";
import NavLinks from "./NavLinks";

import { useNavigate } from "react-router";

function NavBrand() {

  const navigate = useNavigate()

  return (
    <div className="flex items-center">
      <div className="flex-shrink-0 ml-[15px] hover:cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img src={logo} alt="Adiyo.in" className="h-8" />
      </div>
      <NavLinks />
    </div>
  );
}

export default NavBrand;

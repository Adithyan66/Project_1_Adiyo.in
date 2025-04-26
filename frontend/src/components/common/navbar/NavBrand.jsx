import logo from "../../../assets/images/Adiyo.in.svg";

import { useNavigate } from "react-router";
import { NavLinks } from "./NavLinks";


export function NavBrand({ mobileView = false }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center">
      <div
        className={`flex-shrink-0 ${mobileView ? "" : "ml-[15px]"} hover:cursor-pointer`}
        onClick={() => navigate("/")}
      >
        <img src={logo} alt="Adiyo.in" className="h-8" />
      </div>
      {/* Only show NavLinks on desktop (non-mobile view) */}
      {!mobileView && <NavLinks />}
    </div>
  );
}

// // import React from "react";
import logo from "../../../assets/images/Adiyo.in.svg";
// // import NavLinks from "./NavLinks";

import { useNavigate } from "react-router";
import { NavLinks } from "./NavLinks";

// // import { useNavigate } from "react-router";

// // function NavBrand() {

// //   const navigate = useNavigate()

// //   return (
// //     <div className="flex items-center">
// //       <div className="flex-shrink-0 ml-[15px] hover:cursor-pointer"
// //         onClick={() => navigate("/")}
// //       >
// //         <img src={logo} alt="Adiyo.in" className="h-8" />
// //       </div>
// //       <NavLinks />
// //     </div>
// //   );
// // }

// // export default NavBrand;



// function NavBrand() {
//   const navigate = useNavigate();

//   return (
//     <div className="flex flex-col items-center sm:flex-row">
//       <div
//         className="flex-shrink-0 hover:cursor-pointer"
//         onClick={() => navigate("/")}
//       >
//         <img src={logo} alt="Adiyo.in" className="h-8" />
//       </div>
//       <NavLinks />
//     </div>
//   );
// }

// export default NavBrand


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

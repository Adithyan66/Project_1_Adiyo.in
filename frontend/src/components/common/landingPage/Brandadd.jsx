import React from "react";

import img2 from "../../../assets/images/gucci.png";
import img3 from "../../../assets/images/prada.png";
import img4 from "../../../assets/images/versace.png";
import img5 from "../../../assets/images/zara.png";
import img1 from "../../../assets/images/calvin.png";

function Brandadd() {
  return (
    <div className="bg-black p-5" style={{ height: "120px" }}>
      <div className="flex justify-evenly items-center h-full">
        <img src={img1} alt="Image 1" className="w-auto h-auto" />
        <img src={img2} alt="Image 2" className="w-auto h-auto" />
        <img src={img3} alt="Image 3" className="w-auto h-auto" />
        <img src={img4} alt="Image 4" className="w-auto h-auto" />
        <img src={img5} alt="Image 5" className="w-auto h-auto" />
      </div>
    </div>
  );
}

export default Brandadd;

// import React from "react";
// import { useNavigate } from "react-router";



// import hero from "../../../assets/images/vijay.png";
// import heroHeading from "../../../assets/images/heroHeading.svg";
// import frame from "../../../assets/images/frame.svg";





// function HeroSection() {

//   const navigate = useNavigate();



//   return (
//     <section
//       className="relative w-full min-h-screen bg-center bg-no-repeat bg-cover flex items-center justify-start"
//     >
//       {/* Stars: visible on medium screens and larger, with a higher z-index */}
//       <div className="hidden md:block relative z-20">
//         <div className="absolute top-[-400px] left-[1000px]  text-black">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 25 25"
//             className="w-50 h-50 fill-current"
//           >
//             <path
//               d="M18.5 5a5.497 5.497 0 0 1-5.5 5.5 5.49 5.49 0 0 1 5.5 5.5 5.497 5.497 0 0 1 5.5-5.5A5.497 5.497 0 0 1 18.5 5zM6.5 12A5.497 5.497 0 0 1 12 6.5 5.497 5.497 0 0 1 6.5 1 5.497 5.497 0 0 1 1 6.5a5.489 5.489 0 0 1 3.1.95A5.5 5.5 0 0 1 6.5 12zM10.5 13A5.497 5.497 0 0 1 5 18.5a5.49 5.49 0 0 1 5.5 5.5 5.497 5.497 0 0 1 5.5-5.5 5.497 5.497 0 0 1-5.5-5.5z"
//               style={{ fill: "#232326" }}
//             />
//           </svg>
//         </div>
//         <div className="absolute top-[-100px] left-[800px]  text-black">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 25 25"
//             className="w-30 h-30 fill-current"
//           >
//             <path
//               d="m21.5 9.757-5.278 4.354 1.649 7.389L12 17.278 6.129 21.5l1.649-7.389L2.5 9.757l6.333-.924L12 2.5l3.167 6.333z"
//               style={{ fill: "#232326" }}
//             />
//           </svg>
//         </div>
//       </div>

//       {/* Overlay */}
//       <div className="absolute inset-0 bg-white bg-opacity-60"></div>

//       {/* Content Wrapper */}
//       <div className="relative z-10 w-full max-w-[100%] px-20 py-10 flex flex-col md:flex-row items-start justify-between">
//         {/* Left Text Section */}
//         <div className="md:w-1/2 space-y-4 mt-40">
//           {/* Title */}
//           <img src={heroHeading} alt="Hero Heading" />

//           {/* Subtitle */}
//           <p className="text-black text-base md:text-lg max-w-lg mt-10">
//             Browse through our diverse range of meticulously crafted garments,
//             designed to bring out your individuality and cater to your sense of
//             style.
//           </p>

//           {/* Button */}
//           <button
//             className="bg-black text-white font-semibold py-3 px-6 rounded-full hover:bg-gray-800 transition-colors ml-20"
//             onClick={() => navigate("/products-list")}
//           >
//             Shop Now
//           </button>

//           {/* Stats Section */}
//           <div className="mt-6 flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-10 bg-white/90 py-4 px-6 rounded-lg ">
//             <img src={frame} alt="Frame" />
//           </div>
//         </div>

//         {/* Right Image Section */}
//         <div className="w-[600px] h-full flex justify-end">
//           <img src={hero} alt="Dummy Model" className="w-full h-auto" />
//         </div>
//       </div>
//     </section>
//   );
// }

// export default HeroSection;




import React from "react";
import { useNavigate } from "react-router";
import hero from "../../../assets/images/vijay.png";
import heroHeading from "../../../assets/images/heroHeading.svg";
import frame from "../../../assets/images/frame.svg";

function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative w-full min-h-screen bg-center bg-no-repeat bg-cover flex items-center justify-start overflow-hidden">
      {/* Stars: visible on medium screens and larger, with a higher z-index */}
      <div className="hidden md:block relative z-20">
        <div className="absolute top-20 right-20 md:top-20 md:right-40 lg:top-[-400px] lg:left-[1000px] text-black">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 25 25"
            className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 fill-current"
          >
            <path
              d="M18.5 5a5.497 5.497 0 0 1-5.5 5.5 5.49 5.49 0 0 1 5.5 5.5 5.497 5.497 0 0 1 5.5-5.5A5.497 5.497 0 0 1 18.5 5zM6.5 12A5.497 5.497 0 0 1 12 6.5 5.497 5.497 0 0 1 6.5 1 5.497 5.497 0 0 1 1 6.5a5.489 5.489 0 0 1 3.1.95A5.5 5.5 0 0 1 6.5 12zM10.5 13A5.497 5.497 0 0 1 5 18.5a5.49 5.49 0 0 1 5.5 5.5 5.497 5.497 0 0 1 5.5-5.5 5.497 5.497 0 0 1-5.5-5.5z"
              style={{ fill: "#232326" }}
            />
          </svg>
        </div>
        <div className="absolute top-40 right-40 md:top-40 md:right-20 lg:top-[-100px] lg:left-[800px] text-black">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 25 25"
            className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 fill-current"
          >
            <path
              d="m21.5 9.757-5.278 4.354 1.649 7.389L12 17.278 6.129 21.5l1.649-7.389L2.5 9.757l6.333-.924L12 2.5l3.167 6.333z"
              style={{ fill: "#232326" }}
            />
          </svg>
        </div>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-white bg-opacity-60"></div>

      {/* Content Wrapper */}
      <div className="relative z-10 w-full px-4 sm:px-6 md:px-10 lg:px-20 py-6 md:py-10 flex flex-col md:flex-row items-center md:items-start justify-between">
        {/* Left Text Section */}
        <div className="w-full md:w-1/2 space-y-4 mt-20 md:mt-40 text-center md:text-left">
          {/* Title */}
          <img
            src={heroHeading}
            alt="Hero Heading"
            className="max-w-full h-auto mx-auto md:mx-0"
          />

          {/* Subtitle */}
          <p className="text-black text-sm sm:text-base md:text-lg max-w-lg mt-4 md:mt-10 mx-auto md:mx-0">
            Browse through our diverse range of meticulously crafted garments,
            designed to bring out your individuality and cater to your sense of
            style.
          </p>

          {/* Button */}
          <div className="flex justify-center md:justify-start">
            <button
              className="bg-black text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-full hover:bg-gray-800 transition-colors md:ml-20"
              onClick={() => navigate("/products-list")}
            >
              Shop Now
            </button>
          </div>

          {/* Stats Section */}
          <div className="mt-6 flex justify-center md:justify-start">
            <div className="bg-white/90 py-3 px-4 sm:py-4 sm:px-6 rounded-lg w-full max-w-md md:max-w-none">
              <img
                src={frame}
                alt="Frame"
                className="max-w-full h-auto"
              />
            </div>
          </div>
        </div>

        {/* Right Image Section - Hidden on small screens, visible from medium screens */}
        <div className="w-full md:w-1/2 lg:w-[600px] mt-8 md:mt-0 flex justify-center md:justify-end">
          <img
            src={hero}
            alt="Dummy Model"
            className="w-3/4 sm:w-2/3 md:w-full h-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
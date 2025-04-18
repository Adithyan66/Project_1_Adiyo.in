


// import React from "react";
// import Newsletterimg from "../../../assets/images/newsletter.svg";

// function Newsletter() {
//     return (
//         <div className="relative w-full mx-auto h-auto sm:h-[200px] py-20 sm:py-0 ">
//             {/* Background split horizontally: top half white, bottom half gray */}
//             <div className="absolute inset-0 flex flex-col">
//                 <div className="h-1/2 bg-white" />
//                 <div className="h-1/2 bg-gray-200" />
//             </div>

//             {/* Black rectangle - responsive width and height */}
//             <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-[80%] md:w-[75%] lg:w-[65%] 
//                       min-h-[180px] sm:min-h-[150px] bg-black rounded-xl 
//                       flex flex-col sm:flex-row items-center justify-center sm:justify-between 
//                       px-4 sm:px-6 md:px-6 py-6 sm:py-0 gap-6 sm:gap-0">
//                 {/* Left side: image (now centered on mobile) */}
//                 <div className="flex justify-center sm:justify-start sm:flex-1">
//                     <img
//                         src={Newsletterimg}
//                         alt="Stay Up to Date"
//                         className="h-auto w-auto max-w-[80%] sm:max-w-full sm:ml-4 md:ml-10"
//                     />
//                 </div>

//                 {/* Right side: input + button (stacked on mobile) */}
//                 <div className="flex flex-col sm:flex-row items-center gap-3 sm:space-x-3 w-full sm:w-auto px-4 sm:px-0">
//                     <input
//                         type="email"
//                         placeholder="Enter your email"
//                         className="px-4 py-2 rounded-full outline-none bg-white w-full sm:w-auto"
//                     />
//                     <button className="bg-white text-black font-semibold px-4 py-2 rounded-full hover:bg-gray-100 transition-colors w-full sm:w-auto">
//                         Subscribe
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Newsletter;



import React from "react";
import Newsletterimg from "../../../assets/images/newsletter.svg";

function Newsletter() {
    return (
        <div className="relative w-full mx-auto h-auto sm:h-[200px] py-20 sm:py-0 mt-18 sm:mt-0">
            {/* Background split horizontally: top half white, bottom half gray */}
            <div className="absolute inset-0 flex flex-col">
                <div className="h-1/2 bg-white" />
                <div className="h-1/2 bg-gray-200" />
            </div>

            {/* Black rectangle - responsive width and height */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-[80%] md:w-[75%] lg:w-[65%] 
                      min-h-[200px] sm:min-h-[150px] bg-black rounded-xl 
                      flex flex-col sm:flex-row items-center justify-center sm:justify-between 
                      px-4 sm:px-6 md:px-6 py-8 sm:py-0 gap-6 sm:gap-0">
                {/* Left side: image (now centered on mobile) */}
                <div className="flex justify-center sm:justify-start sm:flex-1">
                    <img
                        src={Newsletterimg}
                        alt="Stay Up to Date"
                        className="h-auto w-auto max-w-[80%] sm:max-w-full sm:ml-4 md:ml-10"
                    />
                </div>

                {/* Right side: input + button (in same row on mobile but with smaller button) */}
                <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto px-4 sm:px-4 md:px-10 mt-4 sm:mt-0">
                    <div className="flex flex-row w-full sm:w-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-2 py-2 rounded-l-full outline-none bg-white"
                        />
                        <button className="bg-white text-black font-semibold px-3 sm:px-4 py-2 rounded-r-full hover:bg-gray-100 transition-colors whitespace-nowrap text-sm sm:text-base">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Newsletter;
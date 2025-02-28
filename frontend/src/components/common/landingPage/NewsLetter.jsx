import React from "react";

import Newsletterimg from "../../../assets/images/newsletter.svg"


function Newsletter() {



    return (
        <div className="relative w-[100%] mx-auto h-[200px]">
            {/* Background split horizontally: top half white, bottom half gray */}
            <div className="absolute inset-0 flex flex-col">
                <div className="h-1/2 bg-white" />
                <div className="h-1/2 bg-gray-200" />
            </div>

            {/* Black rectangle in the center */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[65%] h-[150px] bg-black rounded-xl flex items-center px-6 justify-between">
                {/* Left side: image (replace with your own text image) */}
                <div className="flex-1">
                    <img
                        src={Newsletterimg}
                        alt="Stay Up to Date"
                        className="h-auto w-auto ml-10"
                    />
                </div>

                {/* Right side: input + button */}
                <div className="flex items-center space-x-3">
                    <input
                        type="email"
                        placeholder="Enter your email address"
                        className="px-4 py-2 rounded-full outline-none bg-white"
                    />
                    <button className="bg-white text-black font-semibold px-4 py-2 rounded-full hover:bg-gray-100 transition-colors">
                        Subscribe
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Newsletter;

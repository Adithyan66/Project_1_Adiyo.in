import React from "react";

import BrowseByDressStyle from "../../../assets/images/BROWSE BY dress STYLE.svg"


function BrowseByStyle() {




    // Dummy data for demonstration
    const styles = [
        {
            label: "Casual",
            image: "https://p2.piqsels.com/preview/471/740/1012/blonde-hair-casual-eyes-face.jpg",
        },
        {
            label: "Formal",
            image: "https://img.freepik.com/free-photo/image-handsome-caucasian-man-party-suit-smiling-pleased-attend-formal-event-standing-white-background_1258-64650.jpg",
        },
        {
            label: "Party",
            image: "https://media.istockphoto.com/id/590039970/photo/man-wearing-a-white-shirt-white-background.jpg?s=612x612&w=0&k=20&c=r15FPjb--n45lV9lWTeUXQspeC1OrX9Nk55GMt6jae8=",
        },
        {
            label: "Gym",
            image: "https://t3.ftcdn.net/jpg/02/76/34/74/360_F_276347475_XLF6MQQ1hj85TN2TkfQtMPWju8a8Ktmh.jpg",
        },
    ];




    return (
        <div className="max-w-7xl mx-auto px-8 py-12">
            <div className="bg-gray-100 rounded-xl shadow p-10">
                <img
                    src={BrowseByDressStyle}
                    alt="New Arrivals"
                    className="block mx-auto mb-14 mt-10 "
                />

                {/* Two Rows: each row has a fixed height of 300px */}
                <div className="flex flex-col space-y-6">
                    {/* Row 1: [40% | 60%] */}
                    <div className="flex w-full h-[250px] space-x-6">
                        {/* 40% width box */}
                        <div
                            className="relative w-[40%] h-full rounded-2xl overflow-hidden group cursor-pointer"
                        >
                            <div
                                className="w-full h-full bg-center bg-cover transition-transform group-hover:scale-105"
                                style={{ backgroundImage: `url(${styles[0].image})` }}
                            />
                            <div className="absolute bottom-3 left-3 bg-white px-2 py-1 text-2xl font-bold rounded-md shadow">
                                {styles[0].label}
                            </div>
                        </div>

                        {/* 60% width box */}
                        <div
                            className="relative w-[60%] h-full rounded-2xl overflow-hidden group cursor-pointer"
                        >
                            <div
                                className="w-full h-full bg-center bg-cover transition-transform group-hover:scale-105"
                                style={{ backgroundImage: `url(${styles[1].image})` }}
                            />
                            <div className="absolute bottom-3 left-3 bg-white px-2 py-1 text-2xl font-bold rounded-md shadow">
                                {styles[1].label}
                            </div>
                        </div>
                    </div>

                    {/* Row 2: [60% | 40%] */}
                    <div className="flex w-full h-[300px] space-x-6">
                        {/* 60% width box */}
                        <div
                            className="relative w-[60%] h-full rounded-2xl overflow-hidden group cursor-pointer"
                        >
                            <div
                                className="w-full h-full bg-center bg-cover transition-transform group-hover:scale-105"
                                style={{ backgroundImage: `url(${styles[2].image})` }}
                            />
                            <div className="absolute bottom-3 left-3 bg-white px-2 py-1 text-2xl font-bold rounded-md shadow">
                                {styles[2].label}
                            </div>
                        </div>

                        {/* 40% width box */}
                        <div
                            className="relative w-[40%] h-full rounded-2xl overflow-hidden group cursor-pointer"
                        >
                            <div
                                className="w-full h-full bg-center bg-cover transition-transform group-hover:scale-105"
                                style={{ backgroundImage: `url(${styles[3].image})` }}
                            />
                            <div className="absolute bottom-3 left-3 bg-white px-2 py-1 text-2xl font-bold rounded-md shadow">
                                {styles[3].label}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BrowseByStyle;

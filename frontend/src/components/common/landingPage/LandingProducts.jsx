import React from 'react'

import ProductCard from "../ProductCard"

import newArrivals from "../../../assets/images/NEW ARRIVALS.svg"
import topSelling from "../../../assets/images/TOP SELLING.svg"



function LandingProducts() {




    const productImages = [
        "https://rukminim2.flixcart.com/image/612/612/xif0q/kids-t-shirt/k/o/7/13-14-years-provogue103-rednavy-provogue-original-imaghudycnpy5djn.jpeg?q=70",
        "https://rukminim2.flixcart.com/image/612/612/xif0q/kids-t-shirt/k/o/7/13-14-years-provogue103-rednavy-provogue-original-imaghudycnpy5djn.jpeg?q=70",
        "https://rukminim2.flixcart.com/image/612/612/xif0q/kids-t-shirt/k/o/7/13-14-years-provogue103-rednavy-provogue-original-imaghudycnpy5djn.jpeg?q=70",
        "https://rukminim2.flixcart.com/image/612/612/xif0q/kids-t-shirt/k/o/7/13-14-years-provogue103-rednavy-provogue-original-imaghudycnpy5djn.jpeg?q=70",

    ]

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            {/* NEW ARRIVALS Section */}
            <section className="max-w-6xl mx-auto mb-12 px-4">

                <img
                    src={newArrivals}
                    alt="New Arrivals"
                    className="block mx-auto mb-6 mt-20 mb-15"
                />

                {/* Grid of 4 products */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    <ProductCard
                        image={productImages[0]}
                        title="T-shirt with Tape Details"
                        price={120}
                        oldPrice={150}
                        rating={4}
                    />
                    <ProductCard
                        image={productImages[1]}
                        title="Skinny Fit Jeans"
                        price={240}
                        oldPrice={150}
                        rating={5}
                    />
                    <ProductCard
                        image={productImages[2]}
                        title="Checkered Shirt"
                        price={180}
                        oldPrice={150}
                        rating={4}
                    />
                    <ProductCard
                        image={productImages[3]}
                        title="Sleeve Striped T-shirt"
                        price={130}
                        oldPrice={150}


                        rating={3}
                    />
                </div>
                {/* View All button */}
                <div className="flex justify-center mt-6">

                    <button className="w-[200px] px-6 py-2 border border-gray-300 text-black font-medium hover:bg-black hover:text-white transition-colors rounded-full mt-10">
                        View All
                    </button>

                </div>
            </section>

            <hr className="my-8 border-gray-300 w-[80%] mx-auto" />
            {/* top selling Section */}
            <section className="max-w-6xl mx-auto mb-12 px-4">
                <img
                    src={topSelling}
                    alt="New Arrivals"
                    className="block mx-auto mb-6 mt-20 mb-15"
                />

                {/* Grid of 4 products */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    <ProductCard
                        image={productImages[0]}
                        title="Vertical Striped Shirt"
                        price={212}
                        oldPrice={232}
                        rating={5}
                    />
                    <ProductCard
                        image={productImages[1]}
                        title="Courage Graphic T-shirt"
                        price={145}
                        oldPrice={150}
                        rating={4}
                    />
                    <ProductCard
                        image={productImages[2]}
                        title="Loose Fit Bermuda Shorts"
                        price={80}
                        oldPrice={150}
                        rating={3}
                    />
                    <ProductCard
                        image={productImages[3]}
                        title="Faded Skinny Jeans"
                        price={210}
                        oldPrice={150}
                        rating={4}
                    />
                </div>
                {/* View All button */}
                <div className="flex justify-center mt-6">
                    <button className="w-[200px] px-6 py-2 border border-gray-300 text-black font-medium hover:bg-black hover:text-white transition-colors rounded-full mt-10">
                        View All
                    </button>
                </div>
            </section>
        </div>
    )
}

export default LandingProducts

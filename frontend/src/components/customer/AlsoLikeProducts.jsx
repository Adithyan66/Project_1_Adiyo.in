import React from 'react'
import ProductCard from '../common/ProductCard'
import alsolikeproducts from "../../assets/images/You might also like.png"

function AlsoLikeProducts() {



    const productImages = [
        "https://rukminim2.flixcart.com/image/612/612/xif0q/kids-t-shirt/k/o/7/13-14-years-provogue103-rednavy-provogue-original-imaghudycnpy5djn.jpeg?q=70",
        "https://rukminim2.flixcart.com/image/612/612/xif0q/kids-t-shirt/k/o/7/13-14-years-provogue103-rednavy-provogue-original-imaghudycnpy5djn.jpeg?q=70",
        "https://rukminim2.flixcart.com/image/612/612/xif0q/kids-t-shirt/k/o/7/13-14-years-provogue103-rednavy-provogue-original-imaghudycnpy5djn.jpeg?q=70",
        "https://rukminim2.flixcart.com/image/612/612/xif0q/kids-t-shirt/k/o/7/13-14-years-provogue103-rednavy-provogue-original-imaghudycnpy5djn.jpeg?q=70",

    ]


    return (
        <div className=" min-h-screen py-8">
            {/* NEW ARRIVALS Section */}
            <section className="max-w-6xl mx-auto mb-12 px-4">

                <img
                    src={alsolikeproducts}
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

        </div>
    )
}

export default AlsoLikeProducts

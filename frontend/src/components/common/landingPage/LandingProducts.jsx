// import React from 'react'

// import ProductCard from "../ProductCard"

// import newArrivals from "../../../assets/images/NEW ARRIVALS.svg"
// import topSelling from "../../../assets/images/TOP SELLING.svg"



// function LandingProducts() {




//     const productImages = [
//         "https://res.cloudinary.com/dry8cpqvg/image/upload/v1740948329/Adiyo/productsImages/wyndtj959emxshw7v7f7.avif",
//         "https://res.cloudinary.com/dry8cpqvg/image/upload/v1740948329/Adiyo/productsImages/zcm0mapzcbbh5pn0kg0j.avif",
//         "https://res.cloudinary.com/dry8cpqvg/image/upload/v1740948329/Adiyo/productsImages/ia47nr7wyrsfaafx4vya.avif",
//         "https://res.cloudinary.com/dry8cpqvg/image/upload/v1740948329/Adiyo/productsImages/zupfkd9wwjcfz7vp8wxn.avif",
//     ]

//     return (
//         <div className="bg-gray-50 min-h-screen py-8">
//             {/* NEW ARRIVALS Section */}
//             <section className="max-w-6xl mx-auto mb-12 px-4">

//                 <img
//                     src={newArrivals}
//                     alt="New Arrivals"
//                     className="block mx-auto mb-6 mt-20 mb-15"
//                 />

//                 {/* Grid of 4 products */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//                     <ProductCard
//                         image={productImages[0]}
//                         title="T-shirt with Tape Details"
//                         price={120}
//                         oldPrice={150}
//                         rating={4}
//                     />
//                     <ProductCard
//                         image={productImages[1]}
//                         title="Skinny Fit Jeans"
//                         price={240}
//                         oldPrice={150}
//                         rating={5}
//                     />
//                     <ProductCard
//                         image={productImages[2]}
//                         title="Checkered Shirt"
//                         price={180}
//                         oldPrice={150}
//                         rating={4}
//                     />
//                     <ProductCard
//                         image={productImages[3]}
//                         title="Sleeve Striped T-shirt"
//                         price={130}
//                         oldPrice={150}


//                         rating={3}
//                     />
//                 </div>
//                 {/* View All button */}
//                 <div className="flex justify-center mt-6">

//                     <button className="w-[200px] px-6 py-2 border border-gray-300 text-black font-medium hover:bg-black hover:text-white transition-colors rounded-full mt-10">
//                         View All
//                     </button>

//                 </div>
//             </section>

//             <hr className="my-8 border-gray-300 w-[80%] mx-auto" />
//             {/* top selling Section */}
//             <section className="max-w-6xl mx-auto mb-12 px-4">
//                 <img
//                     src={topSelling}
//                     alt="New Arrivals"
//                     className="block mx-auto mb-6 mt-20 mb-15"
//                 />

//                 {/* Grid of 4 products */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//                     <ProductCard
//                         image={productImages[0]}
//                         title="Vertical Striped Shirt"
//                         price={212}
//                         oldPrice={232}
//                         rating={5}
//                     />
//                     <ProductCard
//                         image={productImages[1]}
//                         title="Courage Graphic T-shirt"
//                         price={145}
//                         oldPrice={150}
//                         rating={4}
//                     />
//                     <ProductCard
//                         image={productImages[2]}
//                         title="Loose Fit Bermuda Shorts"
//                         price={80}
//                         oldPrice={150}
//                         rating={3}
//                     />
//                     <ProductCard
//                         image={productImages[3]}
//                         title="Faded Skinny Jeans"
//                         price={210}
//                         oldPrice={150}
//                         rating={4}
//                     />
//                 </div>
//                 {/* View All button */}
//                 <div className="flex justify-center mt-6">
//                     <button className="w-[200px] px-6 py-2 border border-gray-300 text-black font-medium hover:bg-black hover:text-white transition-colors rounded-full mt-10">
//                         View All
//                     </button>
//                 </div>
//             </section>
//         </div>
//     )
// }

// export default LandingProducts




import React, { useState, useEffect } from 'react';
import ProductCard from "../ProductCard";
import newArrivals from "../../../assets/images/NEW ARRIVALS.svg";
import topSelling from "../../../assets/images/TOP SELLING.svg";
import axios from 'axios';
import LandingProductCard from '../LandingProductCard';



const API_BASE_URL = import.meta.env.VITE_API_URL;






function LandingProducts() {



    const [newArrivalsProducts, setNewArrivalsProducts] = useState([]);
    const [topSellingProducts, setTopSellingProducts] = useState([]);

    const [newArrivalsPage, setNewArrivalsPage] = useState(1);
    const [topSellingPage, setTopSellingPage] = useState(1);

    const [hasMoreNewArrivals, setHasMoreNewArrivals] = useState(true);
    const [hasMoreTopSelling, setHasMoreTopSelling] = useState(true);

    const PRODUCTS_PER_PAGE = 4;
    const MAX_ROWS = 10;

    const fetchNewArrivals = async (page) => {

        try {

            const response = await axios.get(`${API_BASE_URL}/user/new-arrivals?page=${page}&limit=${PRODUCTS_PER_PAGE}`)


            const data = response.data

            if (data.products.length < PRODUCTS_PER_PAGE) {
                setHasMoreNewArrivals(false);
            }

            if (page >= MAX_ROWS) {
                setHasMoreNewArrivals(false);
            }

            if (page === 1) {
                setNewArrivalsProducts(data.products);
            } else {
                setNewArrivalsProducts(prev => [...prev, ...data.products]);
            }
        } catch (error) {
            console.error("Error fetching new arrivals:", error);
        }
    };

    const fetchTopSelling = async (page) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/user/top-selling?page=${page}&limit=${PRODUCTS_PER_PAGE}`);

            const data = response.data

            if (data.products.length < PRODUCTS_PER_PAGE) {
                setHasMoreTopSelling(false);
            }

            if (page >= MAX_ROWS) {
                setHasMoreTopSelling(false);
            }

            if (page === 1) {
                setTopSellingProducts(data.products);
            } else {
                setTopSellingProducts(prev => [...prev, ...data.products]);
            }
        } catch (error) {
            console.error("Error fetching top selling products:", error);
        }
    };

    // Load initial products when component mounts
    useEffect(() => {
        fetchNewArrivals(1);
        fetchTopSelling(1);
    }, []);

    // Handle "View More" click for new arrivals
    const handleViewMoreNewArrivals = () => {
        const nextPage = newArrivalsPage + 1;
        setNewArrivalsPage(nextPage);
        fetchNewArrivals(nextPage);
    };

    // Handle "View More" click for top selling
    const handleViewMoreTopSelling = () => {
        const nextPage = topSellingPage + 1;
        setTopSellingPage(nextPage);
        fetchTopSelling(nextPage);
    };

    // Fallback content if products are loading
    if (newArrivalsProducts.length === 0 && topSellingProducts.length === 0) {
        return <div className="h-screen flex items-center justify-center">Loading products...</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            {/* NEW ARRIVALS Section */}
            <section className="max-w-6xl mx-auto mb-12 px-4">
                <img
                    src={newArrivals}
                    alt="New Arrivals"
                    className="block mx-auto  mt-20 mb-15"
                />

                {/* Grid of products */}
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {newArrivalsProducts.map((product, index) => (
                            <LandingProductCard
                                key={`new-arrival-${product.id || index}`}
                                image={product.image}
                                title={product.title}
                                price={product.price}
                                oldPrice={product.oldPrice}
                                rating={product.rating}
                                id={product.id}
                            />
                        ))}
                    </div>
                </div>

                {/* View More button */}
                {hasMoreNewArrivals && (
                    <div className="flex justify-center mt-6">
                        <button
                            className="w-[200px] px-6 py-2 border border-gray-300 text-black font-medium hover:bg-black hover:text-white transition-colors rounded-full mt-10"
                            onClick={handleViewMoreNewArrivals}
                        >
                            View More
                        </button>
                    </div>
                )}
            </section>

            <hr className="my-8 border-gray-300 w-[80%] mx-auto" />

            {/* TOP SELLING Section */}
            <section className="max-w-6xl mx-auto mb-12 px-4">
                <img
                    src={topSelling}
                    alt="Top Selling"
                    className="block mx-auto  mt-20 mb-15"
                />

                {/* Grid of products */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {topSellingProducts.map((product, index) => (
                        <LandingProductCard
                            key={`top-selling-${product.id || index}`}
                            image={product.image}
                            title={product.title}
                            price={product.price}
                            oldPrice={product.oldPrice}
                            rating={product.rating}
                            id={product.id}

                        />
                    ))}
                </div>

                {/* View More button */}
                {hasMoreTopSelling && (
                    <div className="flex justify-center mt-6">
                        <button
                            className="w-[200px] px-6 py-2 border border-gray-300 text-black font-medium hover:bg-black hover:text-white transition-colors rounded-full mt-10"
                            onClick={handleViewMoreTopSelling}
                        >
                            View More
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
}

export default LandingProducts;
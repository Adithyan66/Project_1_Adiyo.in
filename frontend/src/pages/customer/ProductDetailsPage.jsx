import React from 'react'
import Navbar from '../../components/common/Navbar'
import ProductDetail from '../../components/customer/ProductDetail'
import ExtraDetails from "../../components/customer/ExtraDetails"
import AlsoLikeProducts from '../../components/customer/AlsoLikeProducts'
import Newsletter from '../../components/common/landingPage/NewsLetter'
import Footer from '../../components/common/Footer'

function ProductDetailsPage() {
    return (
        <div>
            <Navbar />
            <ProductDetail />
            <ExtraDetails />
            <AlsoLikeProducts />
            <Newsletter />
            <Footer />
        </div>
    )
}

export default ProductDetailsPage

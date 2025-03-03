import React from 'react'
import Navbar from '../../components/common/Navbar'
import ProductDetail from '../../components/customer/ProductDetail'
import ExtraDetails from "../../components/customer/ExtraDetails"
import AlsoLikeProducts from '../../components/customer/AlsoLikeProducts'
import Newsletter from '../../components/common/landingPage/NewsLetter'
import Footer from '../../components/common/Footer'
import { useParams } from 'react-router'

function ProductDetailsPage() {
    const { id } = useParams()
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

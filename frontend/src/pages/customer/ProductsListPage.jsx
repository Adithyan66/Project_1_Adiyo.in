import React from 'react'
import Navbar from "../../components/common/Navbar"
import ProductLists from '../../components/customer/ProductLists'
import Newsletter from '../../components/common/landingPage/NewsLetter'
import Footer from '../../components/common/Footer'

function ProductsListPage() {
    return (
        <div>
            <Navbar />
            <div className='mt-[95px]'>
                <ProductLists />
            </div>
            <Newsletter />
            <Footer />

        </div>
    )
}

export default ProductsListPage

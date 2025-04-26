import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'


import Navbar from "../../components/common/Navbar"
import ProductLists from '../../components/customer/ProductLists'
import Newsletter from '../../components/common/landingPage/NewsLetter'
import Footer from '../../components/common/Footer'


import { setProductList } from "../../store/slices/listProductsSlice.js"
import NewNavbar from '../../components/common/navbar/NewNavbar.jsx'
import { useNavigate } from 'react-router'




function ProductsListPage() {

    const [searchTerm, setSearchTerm] = useState("");

    const navigate = useNavigate()

    const toProductPage = () => {
        navigate("/products-list")
    }

    return (
        <div>
            {/* <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> */}
            <Navbar toProductPage={toProductPage} />
            {/* <NewNavbar setSearchTerm={setSearchTerm} /> */}
            <div className='mt-[95px]'>
                <ProductLists searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </div>
            <Newsletter />
            <Footer />

        </div>
    )
}

export default ProductsListPage

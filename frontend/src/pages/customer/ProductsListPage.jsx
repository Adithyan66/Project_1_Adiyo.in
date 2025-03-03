import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'


import Navbar from "../../components/common/Navbar"
import ProductLists from '../../components/customer/ProductLists'
import Newsletter from '../../components/common/landingPage/NewsLetter'
import Footer from '../../components/common/Footer'


import { setProductList } from "../../store/slices/listProductsSlice.js"




function ProductsListPage() {

    const dispatch = useDispatch()

    const productsList = useSelector((state) => state.listProducts.productlist)



    useEffect(() => {

        const fetchProduct = async () => {
            const response = await axios.get("http://localhost:3333/user/product-list")



            dispatch(setProductList(response.data.products))

            console.log("from response", response.data.products)
            console.log("from state", productsList);

        }

        fetchProduct()

    }, [])



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

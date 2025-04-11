import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from '../../components/common/Navbar'
import ProductDetail from '../../components/customer/ProductDetail'
import ExtraDetails from "../../components/customer/ExtraDetails"
import AlsoLikeProducts from '../../components/customer/AlsoLikeProducts'
import Newsletter from '../../components/common/landingPage/NewsLetter'
import Footer from '../../components/common/Footer'

import { useNavigate } from "react-router-dom";
import ProductDetailShimmer from "../../components/customer/shimmerUI/ProductDetailShimmer";

function ProductDetailsPage() {

    const navigate = useNavigate()

    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                console.log("Starting to fetch", id);
                const response = await axios.get(`http://localhost:3333/user/product/${id}`);

                if (response.data && response.data.product) {
                    const fetchedProduct = response.data.product;
                    setProduct(fetchedProduct);

                    if (fetchedProduct.imageUrls && fetchedProduct.imageUrls.length > 0) {
                        setSelectedImage(fetchedProduct.imageUrls[0]);
                    }
                }
            } catch (err) {
                console.error("Error fetching product:", err);
                navigate("/products-list")
            }
        };

        fetchProduct();
    }, [id]);



    if (!product) {
        return (
            <>
                <Navbar />
                <ProductDetailShimmer />
                <Footer />
            </>)
    }


    return (
        <div>
            <Navbar />
            <ProductDetail product={product} selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
            <ExtraDetails product={product} />
            <AlsoLikeProducts />
            <Newsletter />
            <Footer />
        </div>
    )
}

export default ProductDetailsPage

import React, { useState } from 'react'
import Navbar from "../../components/common/Navbar"
import HeroSection from '../../components/common/landingPage/HeroSection'
import Brandadd from '../../components/common/landingPage/Brandadd'
import LandingProducts from '../../components/common/landingPage/LandingProducts'
import BrowseByStyle from '../../components/common/landingPage/BrowseByStyle'
import Newsletter from '../../components/common/landingPage/NewsLetter'
import Footer from '../../components/common/Footer'
import { useNavigate } from 'react-router'


function LandingPage() {

    const navigate = useNavigate()

    const toProductPage = () => {
        navigate("/products-list")
    }

    return (
        <>
            <Navbar toProductPage={toProductPage} />
            <HeroSection />
            <Brandadd />
            <LandingProducts />
            <BrowseByStyle />
            <Newsletter />
            <Footer />
        </>
    )
}

export default LandingPage

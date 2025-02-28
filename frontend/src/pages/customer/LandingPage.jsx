import React from 'react'
import Navbar from "../../components/common/Navbar"
import HeroSection from '../../components/common/landingPage/HeroSection'
import Brandadd from '../../components/common/landingPage/Brandadd'
import LandingProducts from '../../components/common/landingPage/LandingProducts'
import BrowseByStyle from '../../components/common/landingPage/BrowseByStyle'
import Newsletter from '../../components/common/landingPage/NewsLetter'
import Footer from '../../components/common/Footer'


function LandingPage() {
    return (
        <>
            <Navbar />
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

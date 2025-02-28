import LandingPage from "./pages/customer/LandingPage";
import AdminDashboard from "./components/admin/dashboard/DashBorad";
import ProductDetail from "./components/customer/ProductDetail";
import ExtraDetails from "./components/customer/ExtraDetails";
import AlsoLikeProducts from "./components/customer/AlsoLikeProducts";
import Navbar from "./components/common/Navbar";
import Newsletter from "./components/common/landingPage/NewsLetter";
import Footer from "./components/common/Footer";
import ProductLists from "./components/customer/ProductLists";
import ProductDetailsPage from "./pages/customer/ProductDetailsPage";
import ProductsListPage from "./pages/customer/ProductsListPage";


import 'rc-slider/assets/index.css';

import { Routes, Route } from "react-router-dom";




function App() {
  return (

    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/product-detail" element={<ProductDetailsPage />} />
      <Route path="/products-list" element={<ProductsListPage />} />



    </Routes >
  );
}

export default App;

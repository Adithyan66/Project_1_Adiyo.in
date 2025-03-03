
import 'rc-slider/assets/index.css';

import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import { loginSuccess, logout } from './store/slices/userSlice';

import { AdminProtected, SellerProtected, UserOnlyProtected } from "./components/protectedRoutes/UserProtected"


import LandingPage from "./pages/customer/LandingPage";
import ProductDetailsPage from "./pages/customer/ProductDetailsPage";
import ProductsListPage from "./pages/customer/ProductsListPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import SellerDashboardPage from "./pages/seller/SellerDashboardPage";















function App() {

  const dispatch = useDispatch();
  const navigate = useNavigate()

  useEffect(() => {

    const persistLogin = async () => {

      try {
        const response = await axios.get(
          "http://localhost:3333/user/profile",
          { withCredentials: true }
        );

        dispatch(loginSuccess({
          user: response.data.user,
          token: "cookie",
          role: response.data.role
        }));

      } catch (error) {
        console.log("Error persisting login", error);
      }
    };

    persistLogin();
  }, [dispatch, navigate]);


  return (
    <>
      <Routes>


        <Route path="/"
          element={
            <UserOnlyProtected>
              <LandingPage />
            </UserOnlyProtected>
          }
        />

        <Route path="/products-list" element={<ProductsListPage />} />
        {/* <Route path="/product-detail" element={<ProductDetailsPage />} /> */}
        <Route path="/product-detail/:id" element={<ProductDetailsPage />} />



        <Route path="/admin"
          element={
            <AdminProtected>
              <AdminDashboardPage />
            </AdminProtected>
          } />

        <Route path="/seller"
          element={
            <SellerProtected>
              <SellerDashboardPage />
            </SellerProtected>
          } />

      </Routes >


      {/* <ToastContainer
        position="top-center"
        autoClose={5000}
        style={{ backgroundColor: '#333', color: '#fff' }}
      /> */}

      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

    </>
  );
}

export default App;

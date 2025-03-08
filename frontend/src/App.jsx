
import 'rc-slider/assets/index.css';

import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import Cookies from 'js-cookie';

import 'react-toastify/dist/ReactToastify.css';


import { loginSuccess, logout } from './store/slices/userSlice';

import { AdminProtected, SellerProtected, UserOnlyProtected } from "./components/protectedRoutes/UserProtected"


import LandingPage from "./pages/customer/LandingPage";
import ProductDetailsPage from "./pages/customer/ProductDetailsPage";
import ProductsListPage from "./pages/customer/ProductsListPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import SellerDashboardPage from "./pages/seller/SellerDashboardPage";
import CustomerMoreDetailPage from './pages/admin/CustomerMoreDetailPage';
import CustomerDetailsPage from './components/admin/forCustomers/CustomerDetails';
import CustomersListPage from './pages/admin/CustomersListPage';
import SellersListPage from './pages/admin/SellersListPage';



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

        dispatch(logout())
        const token = Cookies.get('token');

        if (token) {

          toast.error(error.response.data.message)

          await axios.post(
            "http://localhost:3333/user/logout",
            {},
            { withCredentials: true })
        }

      }
    };

    persistLogin();

  }, [dispatch, navigate]);


  return (
    <>
      <Routes>


        <Route path="/" element={<UserOnlyProtected>   <LandingPage /> </UserOnlyProtected>} />

        <Route path="/products-list" element={<ProductsListPage />} />

        <Route path="/product-detail/:id" element={<ProductDetailsPage />} />





        <Route path="/admin/dashboard" element={<AdminProtected><AdminDashboardPage />  </AdminProtected>} />

        <Route path="/admin/customers/" element={<AdminProtected> <CustomersListPage />   </AdminProtected>} />

        <Route path="/admin/:id/customer-details/" element={<AdminProtected><CustomerMoreDetailPage /> </AdminProtected>} />

        <Route path="/admin/sellers" element={<AdminProtected><SellersListPage /></AdminProtected>} />





        <Route path="/seller" element={<SellerProtected>  <SellerDashboardPage />  </SellerProtected>} />

      </Routes >

      <ToastContainer position="top-center" autoClose={1000} hideProgressBar />

    </>
  );
}

export default App;


import 'rc-slider/assets/index.css';
import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loginSuccess, logout } from './store/slices/userSlice';
import { AdminProtected, SellerProtected, UserOnlyProtected, UserProtected } from "./components/protectedRoutes/UserProtected"
import { logout as logoutUser } from './services/authService';

import LandingPage from "./pages/customer/LandingPage";
import ProductDetailsPage from "./pages/customer/ProductDetailsPage";
import ProductsListPage from "./pages/customer/ProductsListPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import SellerDashboardPage from "./pages/seller/SellerDashboardPage";
import CustomerMoreDetailPage from './pages/admin/CustomerMoreDetailPage';
import CustomersListPage from './pages/admin/CustomersListPage';
import SellersListPage from './pages/admin/SellersListPage';
import ManageProductsPage from './pages/admin/ManageProductsPage';
import AdminProductEditPage from "./pages/admin/AdminProductEditPage"
import CouponsPage from './pages/admin/CouponsPage';
import ManageCategoryPage from './pages/admin/ManageCategoryPage';
import UserProfilePage from './pages/customer/UserProfilePage';
import ManageAddressesPage from './pages/customer/ManageAddressesPage';
import CartPage from "./pages/customer/CartPage"
import CheckoutPage from './pages/customer/CheckoutPage';
import OrdersListPage from './pages/customer/OrdersListPage';
import OrderDetailsPage from './pages/customer/OrderDetailsPage';
import CartCheckOutPage from "./pages/customer/CartCheckOutPage"
import ManageOrdersPage from './pages/admin/ManageOrdersPage';
import AdminOrderDetailsPage from "./pages/admin/AdminOrderDetailsPage"
import WishlistPage from './pages/customer/WishlistPage';
import WalletPage from './pages/customer/WalletPage';
import OffersPage from './pages/admin/OffersPage';
import SalesReportPage from './pages/admin/SalesReportPage';
import SalesDetailsPage from './pages/admin/SalesDetailsPage';
import ReferralsDetailsPage from './pages/customer/ReferralsDetailsPage';
import WalletManagementPage from './pages/admin/WalletManagementPage';
import httpClient from './services/httpClient';
import { captureReferral } from './utils/referral';


function App() {

  const dispatch = useDispatch();
  const navigate = useNavigate()

  useEffect(() => {
    const persistLogin = async () => {
      try {
        const response = await httpClient.get('/user/refresh-token');
        dispatch(
          loginSuccess({
            user: response.data.user,
            token: localStorage.getItem("accessToken") || "cookie",
            role: response.data.role,
          })
        );

        if (response.data.role === "admin" && window.location.pathname === "/") {
          navigate("/admin/dashboard");
        } else if (response.data.role === "seller" && window.location.pathname === "/") {
          navigate("/seller");
        }
      } catch (error) {

        dispatch(logout());

        try {
          await logoutUser()
        } catch (logoutError) {
          console.error("Error during logout:", logoutError);
        }
      }
    };

    persistLogin();
  }, [dispatch, navigate]);


  useEffect(() => {
    captureReferral();
  }, []);


  return (
    <>
      <Routes>

        <Route path="/" element={<UserOnlyProtected>   <LandingPage /> </UserOnlyProtected>} />

        <Route path="/products-list" element={<UserOnlyProtected><ProductsListPage /></UserOnlyProtected>} />

        <Route path="/product-detail/:id" element={<UserOnlyProtected><ProductDetailsPage /></UserOnlyProtected>} />

        <Route path="/user/profile" element={<UserProtected><UserProfilePage /></UserProtected>} />

        <Route path="/user/manage-address" element={<UserProtected><ManageAddressesPage /></UserProtected>} />

        <Route path="/user/view-cart" element={<UserProtected><CartPage /></UserProtected>} />

        <Route path="/user/check-out" element={<UserProtected><CheckoutPage /></UserProtected>} />

        <Route path="/user/cart-check-out" element={<UserProtected><CartCheckOutPage /></UserProtected>} />

        <Route path="/user/orders-list" element={<UserProtected><OrdersListPage /></UserProtected>} />

        <Route path="/user/orders/:orderId" element={<UserProtected><OrderDetailsPage /></UserProtected>} />

        <Route path="/user/wishlist" element={<UserProtected><WishlistPage /></UserProtected>} />

        <Route path="/user/wallet" element={<UserProtected><WalletPage /></UserProtected>} />

        <Route path="/user/referrals" element={<UserProtected><ReferralsDetailsPage /></UserProtected>} />







        <Route path="/admin/dashboard" element={<AdminProtected> <AdminDashboardPage />  </AdminProtected>} />

        <Route path="/admin/customers/" element={<AdminProtected> <CustomersListPage />   </AdminProtected>} />

        <Route path="/admin/:id/customer-details/" element={<AdminProtected><CustomerMoreDetailPage /> </AdminProtected>} />

        <Route path="/admin/sellers" element={<AdminProtected><SellersListPage /></AdminProtected>} />

        <Route path="/admin/manage-products" element={<AdminProtected><ManageProductsPage /></AdminProtected>} />

        <Route path="/admin/edit-product/:productId" element={<AdminProtected><AdminProductEditPage /></AdminProtected>} />

        <Route path="/admin/coupons" element={<AdminProtected><CouponsPage /></AdminProtected>} />

        <Route path="/admin/manage-category" element={<AdminProtected><ManageCategoryPage /></AdminProtected>} />

        <Route path="/admin/orders" element={<AdminProtected><ManageOrdersPage /></AdminProtected>} />

        <Route path="/admin/order-details/:orderId" element={<AdminProtected><AdminOrderDetailsPage /></AdminProtected>} />

        <Route path="/admin/manage-offers" element={<AdminProtected> <OffersPage /></AdminProtected>} />

        <Route path="/admin/sales-report" element={<AdminProtected><SalesReportPage /></AdminProtected>} />

        <Route path="/admin/sales-details/:id" element={<AdminProtected><SalesDetailsPage /></AdminProtected>} />

        <Route path="/admin/wallet-management" element={<AdminProtected><WalletManagementPage /></AdminProtected>} />












        <Route path="/seller" element={<SellerProtected>  <SellerDashboardPage />  </SellerProtected>} />

        <Route path="*" element={<LandingPage />} />

      </Routes >

      <ToastContainer position="top-center" autoClose={4000} hideProgressBar />

    </>
  );
}

export default App;

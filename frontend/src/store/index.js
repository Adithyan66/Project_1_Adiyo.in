

import { configureStore } from '@reduxjs/toolkit';

import userReducer from './slices/userSlice';
import authModalSlice from './slices/authModalSlice.js';
import listProductsSlice from "./slices/listProductsSlice.js"
import adminSideSelectedSlice from './slices/adminSideSelectedSlice.js';
import sellerSideSelectedSlice from "./slices/sellerSideSelectedSlice.js"
import userSidebarSelectedSlice from "./slices/userSidebarSelectedSlice.js"
import checkoutSlice from "./slices/checkoutSlice.js"
import cartCheckoutSlice from "./slices/cartCheckoutSlice.js"

const store = configureStore({
    reducer: {
        user: userReducer,
        authModal: authModalSlice,
        listProducts: listProductsSlice,
        adminSideSelected: adminSideSelectedSlice,
        sellerSideSelected: sellerSideSelectedSlice,
        userSideSelected: userSidebarSelectedSlice,
        checkout: checkoutSlice,
        cartCheckout: cartCheckoutSlice
    }
})

export default store;
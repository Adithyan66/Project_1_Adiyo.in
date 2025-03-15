

import { configureStore } from '@reduxjs/toolkit';

import userReducer from './slices/userSlice';
import authModalSlice from './slices/authModalSlice.js';
import listProductsSlice from "./slices/listProductsSlice.js"
import adminSideSelectedSlice from './slices/adminSideSelectedSlice.js';
import sellerSideSelectedSlice from "./slices/sellerSideSelectedSlice.js"
import userSidebarSelectedSlice from "./slices/userSidebarSelectedSlice.js"


const store = configureStore({
    reducer: {
        user: userReducer,
        authModal: authModalSlice,
        listProducts: listProductsSlice,
        adminSideSelected: adminSideSelectedSlice,
        sellerSideSelected: sellerSideSelectedSlice,
        userSideSelected: userSidebarSelectedSlice
    }
})

export default store;
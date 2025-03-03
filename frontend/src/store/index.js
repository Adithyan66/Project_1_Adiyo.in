

import { configureStore } from '@reduxjs/toolkit';

import userReducer from './slices/userSlice';
import authModalSlice from './slices/authModalSlice.js';
import listProductsSlice from "./slices/listProductsSlice.js"



const store = configureStore({
    reducer: {
        user: userReducer,
        authModal: authModalSlice,
        listProducts: listProductsSlice
    }
})

export default store;
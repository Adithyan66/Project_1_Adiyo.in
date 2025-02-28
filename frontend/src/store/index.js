

import { configureStore } from '@reduxjs/toolkit';

import userReducer from './slices/userSlice';
import authModalSlice from './slices/authModalSlice.js';



const store = configureStore({
    reducer: {
        user: userReducer,
        authModal: authModalSlice,
    }
})

export default store;
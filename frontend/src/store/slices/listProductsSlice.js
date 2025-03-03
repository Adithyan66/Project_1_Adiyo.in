

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    productlist: []
}

const listProductsSlice = createSlice({
    name: "listProducts",
    initialState,
    reducers: {
        setProductList: (state, action) => {
            state.productlist = action.payload
        }
    }
})

export const { setProductList } = listProductsSlice.actions;
export default listProductsSlice.reducer
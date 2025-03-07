import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    activeSelection: "dashboard",
    editProductID: null
}

const sellerSideSelectedSlice = createSlice({
    name: "sellerSideSelection",
    initialState,
    reducers: {
        setActiveSelection: (state, action) => {
            state.activeSelection = action.payload
        },
        setEditProductID: (state, action) => {
            state.editProductID = action.payload
        }
    }
})

export const { setActiveSelection, setEditProductID } = sellerSideSelectedSlice.actions;

export default sellerSideSelectedSlice.reducer;
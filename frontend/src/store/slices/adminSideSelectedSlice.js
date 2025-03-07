import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    activeSelection: "dashboard"
}

const adiminSideSelectedSlice = createSlice({
    name: "adminSideSellection",
    initialState,
    reducers: {
        setActiveSelection: (state, action) => {
            state.activeSelection = action.payload
        }
    }
})

export const { setActiveSelection } = adiminSideSelectedSlice.actions;

export default adiminSideSelectedSlice.reducer;
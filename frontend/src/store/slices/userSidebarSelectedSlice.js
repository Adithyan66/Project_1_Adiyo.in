
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    activeSelection: "profile"
}

const userSidebarSelectedSlice = createSlice({
    name: "userSidebarSelected",
    initialState,
    reducers: {
        setActiveSelection: (state, action) => {
            state.activeSelection = action.payload
        }
    }
})

export const { setActiveSelection } = userSidebarSelectedSlice.actions;

export default userSidebarSelectedSlice.reducer;
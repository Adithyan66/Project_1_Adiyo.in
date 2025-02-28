import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loginPopup: false,
    activeForm: "login", // options: "login", "signup", "forgot", "reset"
};

const authModalSlice = createSlice({
    name: "authModal",
    initialState,
    reducers: {
        setLoginPopup: (state, action) => {
            state.loginPopup = action.payload;
        },
        setActiveForm: (state, action) => {
            state.activeForm = action.payload;
        },
    },
});

export const { setLoginPopup, setActiveForm } = authModalSlice.actions;
export default authModalSlice.reducer;
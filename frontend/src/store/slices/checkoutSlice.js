

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentStep: 'address',
    address: [],
    order: {
        productDetails: null,
        productColor: "",
        productSize: "",
        quantity: 1,
    },
    payment: {
        selectedMethod: 'COD',
        status: 'idle'
    },
};

const getSizeKey = (size) => {
    switch (size.toLowerCase()) {
        case 'small': return 'small';
        case 's': return 'small';
        case 'medium': return 'medium';
        case 'm': return 'medium';
        case 'large': return 'large';
        case 'l': return 'large';
        case 'extra large': return 'extraLarge';
        case 'xl': return 'extraLarge';
        default: return size.toLowerCase();
    }
};

const checkoutSlice = createSlice({
    name: "checkout",
    initialState,
    reducers: {
        setCurrentStep: (state, action) => {
            state.currentStep = action.payload;
        },
        setSelectedAddress: (state, action) => {
            state.address = action.payload;
        },
        setProduct: (state, action) => {
            const { product, productColor, productSize } = action.payload;

            // Store the entire product object but with additional computed properties
            state.order.productDetails = product;
            state.order.productColor = productColor;
            state.order.productSize = productSize;
            state.order.quantity = 1;
        },
        updateQuantity: (state, action) => {
            const newQuantity = state.order.quantity + action.payload;

            // Find the color variant
            const colorVariant = state.order.productDetails.colors.find(
                c => c.color === state.order.productColor
            );

            if (!colorVariant) return;

            // Get the correct size key
            const sizeKey = getSizeKey(state.order.productSize);

            // Get the variant
            const variant = colorVariant.variants[sizeKey];

            // Update quantity if within stock limits
            if (variant && newQuantity > 0 && newQuantity <= parseInt(variant.stock, 10)) {
                state.order.quantity = newQuantity;
            }
        }
    }
});

export const { setCurrentStep, setSelectedAddress, setProduct, updateQuantity } = checkoutSlice.actions;

export default checkoutSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentStep: 'address',
    address: [],
    order: [],
    payment: {
        selectedMethod: 'COD',
        status: 'idle'
    },
    confirmationData: null
};

const getSizeKey = (size) => {
    switch (size.toLowerCase()) {
        case 'small':
        case 's':
            return 'small';
        case 'medium':
        case 'm':
            return 'medium';
        case 'large':
        case 'l':
            return 'large';
        case 'extra large':
        case 'xl':
            return 'extraLarge';
        default:
            return size.toLowerCase();
    }
};

const cartCheckoutSlice = createSlice({
    name: "cartCheckout",
    initialState,
    reducers: {
        setCartCurrentStep: (state, action) => {
            state.currentStep = action.payload;
        },
        setCartSelectedAddress: (state, action) => {
            state.address = action.payload;
        },

        addProducts: (state, action) => {
            console.log("Dispatching addProducts with:", action.payload);
            action.payload.forEach(item => {
                console.log("Processing item:", item);
                state.order.push({
                    productDetails: item.product,
                    productColor: item.selectedColor,
                    productSize: item.selectedSize,
                    quantity: item.quantity,
                });
            });
        },
        updateQuantity: (state, action) => {
            const { index, amount } = action.payload;
            if (index < 0 || index >= state.order.length) return;
            const orderItem = state.order[index];
            const newQuantity = orderItem.quantity + amount;

            const colorVariant = orderItem.productDetails.colors.find(
                c => c.color === orderItem.productColor
            );
            if (!colorVariant) return;
            const sizeKey = getSizeKey(orderItem.productSize);
            const variant = colorVariant.variants[sizeKey];
            if (variant && newQuantity > 0 && newQuantity <= parseInt(variant.stock, 10)) {
                orderItem.quantity = newQuantity;
            }
        },
        removeProduct: (state, action) => {
            const index = action.payload;
            if (index >= 0 && index < state.order.length) {
                state.order.splice(index, 1);
            }
        },
        setCartConfirmationData: (state, action) => {
            state.confirmationData = action.payload;
        },
        clearCart: (state, action) => {
            state.order = [];
        }
    }
});

export const {
    setCartCurrentStep,
    setCartSelectedAddress,
    addProduct,
    addProducts,
    updateQuantity,
    removeProduct,
    setCartConfirmationData,
    clearCart
} = cartCheckoutSlice.actions;
export default cartCheckoutSlice.reducer;

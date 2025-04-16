import httpClient from "./httpClient";

export const getWalletDetails = async (queryParams) => {
    try {
        const response = await httpClient.get("/user/wallet?${queryParams}");
        return response;
    } catch (error) {
        console.error("Error fetching wallet details:", error);
        throw error;
    }
}



export const addMoneyRazorpay = async (amount) => {
    try {
        const response = await httpClient.post(
            `/user/add-money-razopay`,
            { amount: parseInt(amount), paymentMethod: 'razorpay' }
        );
        return response;
    } catch (error) {
        console.error("Error adding money via Razorpay:", error);
        throw error;
    }
}



export const verifyWalletRecharge = async (paymentNow, paymentResponse, amount) => {
    try {
        const response = await httpClient.post(`/user/wallet-recharge`, {
            paymentMethod: paymentNow,
            razorpay_order_id: paymentResponse.razorpay_order_id,
            razorpay_payment_id: paymentResponse.razorpay_payment_id,
            razorpay_signature: paymentResponse.razorpay_signature,
            amount: parseInt(amount),
        });
        return response;
    } catch (error) {
        console.error("Error verifying wallet recharge:", error);
        throw error;
    }
};


export const walletRecharge = async (orderData) => {
    try {
        const response = await httpClient.post(`/user/wallet-recharge`, orderData);
        return response;
    } catch (error) {
        console.error("Error during wallet recharge:", error);
        throw error;
    }
};


export const getWalletBalance = async () => {
    try {
        const response = await httpClient.get(`/user/get-wallet-balance`);
        return response;
    } catch (error) {
        console.error("Error fetching wallet balance:", error);
        throw error;
    }
};


export const initiateRazorpayPayment = async (orderTotal) => {
    try {
        const response = await httpClient.post(`/user/add-money-razopay`, {
            amount: parseInt(orderTotal),
            paymentMethod: 'razorpay',
        });
        return response;
    } catch (error) {
        console.error("Error initiating Razorpay payment:", error);
        throw error;
    }
};

import axios from "axios"

import dotenv from 'dotenv';
dotenv.config();


const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_API_URL = "https://api.sandbox.paypal.com"

// process.env.NODE_ENV === 'production'

//     ? 'https://api.paypal.com'
//     : 'https://api.sandbox.paypal.com';


const getAccessToken = async () => {
    try {
        const response = await axios({
            url: `${PAYPAL_API_URL}/v1/oauth2/token`,
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            auth: {
                username: PAYPAL_CLIENT_ID,
                password: PAYPAL_CLIENT_SECRET
            },
            data: 'grant_type=client_credentials'
        });

        return response.data.access_token;
    } catch (error) {
        console.error('Error getting PayPal access token:', error);
        throw new Error('Failed to authenticate with PayPal');
    }
};




export const capturePayPalPayment = async (paypalOrderID) => {

    try {
        const accessToken = await getAccessToken();

        const response = await axios({

            url: `${PAYPAL_API_URL}/v2/checkout/orders/${paypalOrderID}/capture`,
            method: 'post',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.data.status !== 'COMPLETED') {
            throw new Error(`Failed to capture payment. Status: ${response.data.status}`);
        }

        return {
            transactionId: response.data.purchase_units[0].payments.captures[0].id,
            status: response.data.status,
            payerEmail: response.data.payer?.email_address,
            amount: response.data.purchase_units[0].payments.captures[0].amount,
            createTime: response.data.purchase_units[0].payments.captures[0].create_time,
            updateTime: response.data.purchase_units[0].payments.captures[0].update_time
        };

    } catch (error) {
        console.error('Error capturing PayPal payment:', error);
        throw new Error(error.response?.data?.message || 'Failed to capture PayPal payment');
    }
};



export const verifyPayPalOrder = async (paypalOrderID) => {
    try {
        console.log(`Verifying PayPal order: ${paypalOrderID}`);
        const accessToken = await getAccessToken();

        // Log the endpoint we're hitting for debugging
        const endpoint = `${PAYPAL_API_URL}/v2/checkout/orders/${paypalOrderID}`;
        console.log(`Making request to: ${endpoint}`);

        const response = await axios({
            url: endpoint,
            method: 'get',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('PayPal order verification successful:', response.data.status);

        // Check if the order status is valid
        if (response.data.status !== 'COMPLETED' && response.data.status !== 'APPROVED') {
            throw new Error(`PayPal order status is ${response.data.status}, not COMPLETED or APPROVED`);
        }

        return response.data;
    } catch (error) {
        // Enhanced error logging for better debugging
        if (error.response) {
            console.error(`PayPal API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);

            if (error.response.status === 404) {
                throw new Error(`PayPal order ID ${paypalOrderID} not found. Please check if the order ID is correct and hasn't expired.`);
            } else if (error.response.status === 401) {
                throw new Error('PayPal authentication failed. Please check your API credentials.');
            }
        }

        console.error('Error verifying PayPal order:', error);
        throw new Error(error.response?.data?.message || 'Failed to verify PayPal payment');
    }
};
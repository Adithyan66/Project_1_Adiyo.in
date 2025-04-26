

import { useNavigate } from "react-router"
import httpClient from "./httpClient"

export const login = async (credentials) => {
    try {
        const response = await httpClient.post("/user/login", credentials)
        return response
    } catch (error) {
        console.error("Error during login:", error)
        throw error
    }
}

// export const googleLogin = async (credential) => {
//     try {
//         const response = await httpClient.post("/user/google-login", { token: credential })
//         return response
//     } catch (error) {
//         console.error("Error during login:", error)
//         throw error
//     }
// }

export const googleLogin = (credential) => {
    const referralCode = localStorage.getItem('referralCode');
    return httpClient.post('/user/google-login', {
        token: credential,
        referralCode
    });
};

export const sentOtp = async (email) => {
    try {
        const response = await httpClient.post("/user/signup-send-otp", { email })
        return response
    } catch (error) {
        console.error("Error sending OTP:", error)
        throw error
    }
}

export const signup = async (userData) => {
    try {
        const response = await httpClient.post("/user/signup", userData)
        return response
    } catch (error) {
        console.error("Error during signup:", error)
        throw error
    }
}

export const forgotPassword = async (email) => {
    try {
        const response = await httpClient.post("/user/forgot-password", { email })
        return response
    } catch (error) {
        console.error("Error in forgot password:", error)
        throw error
    }
}

export const resetPassword = async (data) => {
    try {
        const response = await httpClient.post("/user/reset-password", data)
        return response
    } catch (error) {
        console.error("Error during password reset:", error)
        throw error
    }
}

export const validateOtp = async (data) => {
    try {
        const response = await httpClient.post("/user/validate-otp", data)
        return response
    } catch (error) {
        console.error("Error validating OTP:", error)
        throw error
    }
}

export const logout = async () => {
    try {
        const response = await httpClient.post("/user/logout",)
        localStorage.removeItem("accessToken");
        return response
    } catch (error) {
        console.error("Error during logout:", error)
        throw error
    }
}

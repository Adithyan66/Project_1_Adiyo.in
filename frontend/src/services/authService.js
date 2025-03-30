
import httpClient from "./httpClient"

export const login = async (credentials) => {
    const response = await httpClient.post("/user/login",
        credentials
    )
    return response
}

export const sentOtp = async (email) => {
    const response = await httpClient.post("/user/signup-send-otp",
        { email }
    )
    return response
}


export const signup = async (userData) => {
    const response = await httpClient.post("/user/signup",
        userData
    )
    return response
}


export const forgotPassword = async (email) => {
    const response = await httpClient.post("/user/forgot-password",
        { email }
    )
    return response
}

export const resetPassword = async (data) => {
    const response = await httpClient.post("/user/reset-password",
        data
    )
    return response
}

export const validateOtp = async (data) => {
    const response = await httpClient.post("/user/validate-otp",
        data
    )
    return response
}

export const logout = async () => {
    const response = await httpClient.post("/user/logout")
    return response
}




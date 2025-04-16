
// import httpClient from "./httpClient"

// export const login = async (credentials) => {
//     const response = await httpClient.post("/user/login",
//         credentials
//     )
//     return response
// }

// export const sentOtp = async (email) => {
//     const response = await httpClient.post("/user/signup-send-otp",
//         { email }
//     )
//     return response
// }


// export const signup = async (userData) => {
//     const response = await httpClient.post("/user/signup",
//         userData
//     )
//     return response
// }


// export const forgotPassword = async (email) => {
//     const response = await httpClient.post("/user/forgot-password",
//         { email }
//     )
//     return response
// }

// export const resetPassword = async (data) => {
//     const response = await httpClient.post("/user/reset-password",
//         data
//     )
//     return response
// }

// export const validateOtp = async (data) => {
//     const response = await httpClient.post("/user/validate-otp",
//         data
//     )
//     return response
// }

// export const logout = async () => {
//     const response = await httpClient.post("/user/logout")
//     return response
// }



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

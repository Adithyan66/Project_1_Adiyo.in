import httpClient from "./httpClient";

export const updateAddress = async (formData) => {
    try {
        const response = await httpClient.put("/user/update-address", formData);
        return response;
    } catch (error) {
        throw error;
    }
}

export const createAddress = async (formData) => {
    try {
        const response = await httpClient.post("/user/save-address", formData);
        return response;
    } catch (error) {
        throw error;
    }
}

export const changeEmailOTP = async (userId, password, newEmail) => {
    try {
        const response = await httpClient.post(`/user/${userId}/change-email/otp-request`, {
            password,
            newEmail
        });
        return response;
    } catch (error) {
        throw error;
    }
}


export const changeEmail = async (userId, otp, newEmail) => {
    try {
        const response = await httpClient.post(`/user/${userId}/change-emailid`, {
            otp,
            newEmail
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export const setDefaultAddress = async (id) => {
    try {
        const response = await httpClient.put(`/user/set-default-address/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
}

export const deleteAddress = async (id) => {
    try {
        const response = await httpClient.delete(`/user/delete-address/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
}


export const getAddress = async () => {
    try {
        const response = await httpClient.get("/user/address");
        return response;
    } catch (error) {
        throw error;
    }
}

export const changePassword = async (userId, currentPassword, newPassword) => {
    try {
        const response = await httpClient.put(`/user/${userId}/change-password`, {
            currentPassword,
            newPassword
        });
        return response;
    } catch (error) {
        throw error;
    }
}


export const userDetails = async () => {
    try {
        const response = await httpClient.get(`/user/user-details`);
        return response;
    } catch (error) {
        throw error;
    }
}

export const updateProfile = async (formData) => {
    try {
        const response = await httpClient.post("/user/update-profile", formData);
        return response;
    } catch (error) {
        throw error;
    }
}



import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const httpClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
})


httpClient.interceptors.request.use(
    (config) => {
        if (config.data instanceof FormData) {
            config.headers["content-type"] = "multipart/form-data";
        } else {
            config.headers["content-type"] = "application/json";
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

export default httpClient;
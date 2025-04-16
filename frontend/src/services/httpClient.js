
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const httpClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
})


httpClient.interceptors.request.use(

    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);



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


httpClient.interceptors.response.use(

    response => response,

    async error => {

        const originalRequest = error.config;


        if (error.response && error.response.status === 401 && !originalRequest._retry) {

            console.log("401 detected, attempting to refresh token...");

            originalRequest._retry = true;

            try {

                const { data } = await httpClient.get('/user/refresh-token');

                localStorage.setItem('accessToken', data.accessToken);

                originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;

                return httpClient(originalRequest);

            } catch (refreshError) {

                localStorage.removeItem('accessToken');

                return Promise.reject(refreshError);

            }
        }

        return Promise.reject(error);
    }
);



export default httpClient;

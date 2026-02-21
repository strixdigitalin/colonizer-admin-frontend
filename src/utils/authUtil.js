import axios from "axios";

export const axiosInstance = axios.create();

export const setupInterceptors = (logoutFunc) => {
    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            // console.log("akash:,", error);
            // Check if unauthorized (token invalid/expired)
            if (error?.response?.status === 401) {
                // console.warn("Unauthorized! Auto-logging out...");
                logoutFunc(); // Redirect or clear tokens
            }

            return Promise.reject(error);
        }
    );
};

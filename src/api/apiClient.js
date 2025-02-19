import axios from "axios";
import { getToken } from "../utils/auth";

// Create Axios instance
const apiClient = axios.create({
    baseURL: "http://localhost:5000/api", // Backend URL
    headers: {
        "Content-Type": "application/json",
    },
});

// Add Authorization Header for Protected Routes
apiClient.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default apiClient;
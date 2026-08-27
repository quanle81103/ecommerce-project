import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://13.212.248.63:8080/api/v1",
    headers: { "Content-Type": "application/json" },
    timeout: 10000
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("Token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) localStorage.removeItem("Token");
        return Promise.reject(error);
    }
);

export default api;

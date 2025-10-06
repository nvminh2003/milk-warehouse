import axios from "axios";

const api = axios.create({
    baseURL: "https://localhost:5000/api", // hoặc domain thực tế của BE C#
    headers: {
        "Content-Type": "application/json",
    },
});

// Optional: Interceptor để tự động gắn token hoặc log error
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API error:", error);
        throw error;
    }
);

export default api;

import axios from "axios";

console.log("Backend URL:", process.env.REACT_APP_BACKEND_DEPLOYED_URL);

const API = axios.create({
    baseURL:
        process.env.NODE_ENV === "production"
            ? process.env.REACT_APP_BACKEND_DEPLOYED_URL
            : "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default API;

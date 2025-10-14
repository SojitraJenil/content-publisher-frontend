import axios from "axios";


console.log("Backend URL:", process.env.BACKEND_DEPLOYED_URL);
const API = axios.create({
    baseURL: process.env.BACKEND_DEPLOYED_URL,
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default API;

import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

console.log("Backend API URL:", API_BASE_URL);
export default api;

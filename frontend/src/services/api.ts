// import axios from "axios";

// const API_BASE_URL = "http://127.0.0.1:5000"; // Directly set backend URL

// const api = axios.create({
//     baseURL: API_BASE_URL,
//     headers: {
//         "Content-Type": "application/json",
//     },
// });

// console.log("Backend API URL:", API_BASE_URL); // Debugging log

// export default api;


import axios from "axios";

// Use the environment variable from Vite
const API_BASE_URL = import.meta.env.REACT_APP_API_URL || "http://127.0.0.1:5000"; // Fallback to local if no env variable set

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

console.log("Backend API URL:", API_BASE_URL); // Debugging log

export default api;

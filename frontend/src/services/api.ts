// import axios from "axios";

// const API_BASE_URL = "http://127.0.0.1:5000"; // Change when deploying

// const api = axios.create({
//     baseURL: API_BASE_URL,
//     headers: {
//         "Content-Type": "application/json",
//     },
// });

// export default api;

// import axios from "axios";

// // Set base URL to work both locally and in deployment
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/";

// const api = axios.create({
//     baseURL: API_BASE_URL,
//     headers: {
//         "Content-Type": "application/json",
//     },
// });

// export default api;

import axios from "axios";

const API_BASE_URL =  process.env.REACT_APP_API_URL; // Backend API URL

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
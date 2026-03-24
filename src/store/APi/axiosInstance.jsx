// // src/utils/axiosInstance.js
// import axios from "axios";
// // import api from "../../store/APi/axiosInstance";  // ← Your dual-backend axios


// // 🔥 BACKEND URLs
// const AUTH_BASE = import.meta.env.VITE_API_BASE_URL;

// // const PRODUCT_BASE = import.meta.env.VITE_PRODUCT_API_BASE;
// const PRODUCT_BASE = "http://localhost:3000/api";

// const CART_BASE = import.meta.env.VITE_CART_API_BASE;
// // Create axios instance
// const api = axios.create({
//   withCredentials: true,
// });

// // 🔥 SMART BACKEND ROUTE SELECTOR
// api.interceptors.request.use(
//   (config) => {
//     const url = config.url || "";

//     // 🔐 AUTH / ADMIN BACKEND
//     if (
//       url.startsWith("/auth") ||          // buyer/seller auth
//       url.startsWith("/admin")            // admin APIs
//     ) {
//       config.baseURL = AUTH_BASE;
//     }
//     else if (
//       url.startsWith("/cart") ||
//       url.startsWith("/checkout")
//     ) {
//       config.baseURL = CART_BASE;
//     }

//     // 📦 PRODUCT BACKEND (BUYER / SELLER / SUPPLIER)
//     else {
//       config.baseURL = PRODUCT_BASE;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default api;
// src/utils/axiosInstance.js


import axios from "axios";

// 🔥 BACKEND URLs
const AUTH_BASE = import.meta.env.VITE_API_BASE_URL;
const PRODUCT_BASE = import.meta.env.VITE_PRODUCT_API_BASE; // 🔥 env se
const CART_BASE = import.meta.env.VITE_CART_API_BASE;

// Create axios instance
const api = axios.create({
  withCredentials: true,
});

// 🔥 SMART BACKEND ROUTE SELECTOR
api.interceptors.request.use(
  (config) => {
    const url = config.url || "";

    // 🔐 AUTH / ADMIN BACKEND
    if (
      url.startsWith("/auth") ||          // buyer/seller auth
      url.startsWith("/admin")            // admin APIs
    ) {
      config.baseURL = AUTH_BASE;
    }

    // 🛒 CART / CHECKOUT BACKEND
    else if (
      url.startsWith("/cart") ||
      url.startsWith("/checkout")
    ) {
      config.baseURL = CART_BASE;
    }

    // 📦 PRODUCT BACKEND (BUYER / SELLER / SUPPLIER)
    else {
      config.baseURL = PRODUCT_BASE;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

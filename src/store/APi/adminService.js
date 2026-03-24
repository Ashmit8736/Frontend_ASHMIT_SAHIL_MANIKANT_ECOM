import axios from "axios";

const adminService = axios.create({
    baseURL: "http://localhost:3000/api/admin",
});

adminService.interceptors.request.use((config) => {
    const token = localStorage.getItem("adminToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default adminService;

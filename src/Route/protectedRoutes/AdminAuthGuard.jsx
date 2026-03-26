// src/Route/protectedRoutes/AdminAuthGuard.jsx

import { Navigate, Outlet } from "react-router-dom";

export function AdminProtectedRoute() {
    const token = localStorage.getItem("adminToken");

    // ❌ No token → redirect to login page
    if (!token) return <Navigate to="/admin/login" replace />;

    // ✅ If logged in → allow access
    return <Outlet />;
}

import { Navigate, Outlet } from "react-router-dom";

export const SupplierProtectedRoute = () => {
    const token = localStorage.getItem("supplierToken");
    const supplierStatus = localStorage.getItem("supplierStatus");
    // approved | pending | rejected

    if (!token) {
        //return <Navigate to="/supplier/login" replace />;
        return <Navigate to="/supplier/login" replace />;
    }

    if (supplierStatus === "pending" || supplierStatus === "rejected") {
        return <Navigate to="/supplier/account-pending" replace />;
    }

    return <Outlet />;
};

export const SupplierSignInRoute = () => {
    const token = localStorage.getItem("supplierToken");
    const supplierStatus = localStorage.getItem("supplierStatus");

    if (token && supplierStatus === "approved") {
        return <Navigate to="/supplier/dashboard" replace />;
    }

    if (token && (supplierStatus === "pending" || supplierStatus === "rejected")) {
        return <Navigate to="/supplier/account-pending" replace />;
    }

    return <Outlet />;
};

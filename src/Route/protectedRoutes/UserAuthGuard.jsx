import { Navigate, Outlet } from "react-router-dom";

/* ==============================
   ⭐ USER SIGN-IN ROUTE (/auth/*)
================================ */
export const UserSignInRoute = () => {
    const isLoggedIn = localStorage.getItem("buyerLoggedIn") === "true";

    // already logged in → dashboard
    if (isLoggedIn) {
        return <Navigate to="/app" replace />;
    }

    return <Outlet />;
};

/* ==============================
   ⭐ USER PROTECTED ROUTE (/app/*)
================================ */
export const UserProtectedRoute = () => {
    const isLoggedIn = localStorage.getItem("buyerLoggedIn") === "true";

    if (!isLoggedIn) {
        return <Navigate to="/auth/login" replace />;
    }

    return <Outlet />;
};

// import { Navigate, Outlet } from "react-router-dom";

// // ⭐ USER SIGN-IN ROUTE
// // Ab yeh token check nahi karega.
// // Har baar /auth/* par LOGIN / OTP pages dikhne denge.
// export const UserSignInRoute = () => {
//     return <Outlet />;
// };

// // ⭐ USER PROTECTED ROUTE
// // /app wale sab pages sirf logged-in user hi dekh sakta hai.
// export const UserProtectedRoute = () => {
//     const user = localStorage.getItem("userToken");

//     if (!user) return <Navigate to="/auth/login" replace />;

//     return <Outlet />;
// };

// export default UserSignInRoute;
import { Navigate, Outlet } from "react-router-dom";

/* ==============================
   ⭐ USER SIGN-IN ROUTE
   /auth/*
   (login / signup / otp / forget)
================================ */
export const UserSignInRoute = () => {
    return <Outlet />;
};

/* ==============================
   ⭐ USER PROTECTED ROUTE
   /app/*
================================ */
export const UserProtectedRoute = () => {
    const isLoggedIn = localStorage.getItem("buyerLoggedIn") === "true";

    if (!isLoggedIn) {
        return <Navigate to="/auth/login" replace />;
    }

    return <Outlet />;
};

export default UserSignInRoute;

// import { Navigate, Outlet } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// // ❌ Logged-in seller auth pages access na kare
// export const SellerSignInRoute = () => {
//     const token = localStorage.getItem("sellerToken");
//     if (token) return <Navigate to="/seller/dashboard" replace />;
//     return <Outlet />;
// };

// // ✅ Dashboard guard
// export const SellerProtectedRoute = () => {
//     const token = localStorage.getItem("sellerToken");

//     if (!token) {
//         return <Navigate to="/seller/login" replace />;
//     }

//     try {
//         const decoded = jwtDecode(token);

//         // 🔴 NOT APPROVED → PENDING PAGE
//         if (decoded.approval_status !== "approved") {
//             return <Navigate to="/seller/auth/account-pending" replace />;
//         }

//         return <Outlet />;
//     } catch (err) {
//         localStorage.removeItem("sellerToken");
//         return <Navigate to="/seller/login" replace />;
//     }
// };

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

/* ===============================
   SELLER SIGN-IN ROUTE
================================ */
export const SellerSignInRoute = () => {
  const token = localStorage.getItem("sellerToken");
  const location = useLocation();

  // ✅ These pages are allowed even when logged in
  const allowWhenLoggedIn = [
    "/seller/auth/register",
    "/seller/auth/forget",
    "/seller/auth/verify-otp",
    "/seller/auth/reset-password",
    "/seller/auth/account-pending"
  ];

  if (token && !allowWhenLoggedIn.includes(location.pathname)) {
    return <Navigate to="/seller/dashboard" replace />;
  }

  return <Outlet />;
};


/* ===============================
   SELLER PROTECTED ROUTE
================================ */
export const SellerProtectedRoute = () => {
  const token = localStorage.getItem("sellerToken");

  if (!token) {
    return <Navigate to="/seller/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    // 🔴 NOT APPROVED → ACCOUNT PENDING
    if (decoded.approval_status !== "approved") {
      return <Navigate to="/seller/auth/account-pending" replace />;
    }

    return <Outlet />;
  } catch (err) {
    localStorage.removeItem("sellerToken");
    return <Navigate to="/seller/login" replace />;
  }
};
  
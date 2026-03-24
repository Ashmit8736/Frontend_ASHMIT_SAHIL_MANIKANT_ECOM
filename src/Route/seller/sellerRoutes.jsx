
import React from "react";

// SELLER AUTH PAGES
import SellerLogin from "../../pages/seller/sellerLogIn/SellerLogin.jsx";
import SellerRegister from "../../pages/seller/sellerRegister/SellerRegister.jsx";
import ForGetPassword from "../../pages/seller/sellerForgetPassword/sendotp/ForGetPassword.jsx";
import SellerVerfyOtp from "../../pages/seller/sellerForgetPassword/sellerVerifyotp/SellerVerfyOtp.jsx";
import ResetPassword from "../../pages/seller/sellerForgetPassword/ResetPassword/ResetPassword.jsx";

// DASHBOARD LAYOUT + PAGES
import SellerDashboardLayout from "../../layout/SellerDashboard/SellerDashboardLayout.jsx";
import Dashboard from "../../pages/Seller/Dashboard.jsx";
import Products from "../../pages/Seller/Products.jsx";
import Orders from "../../pages/Seller/Orders.jsx";
import Inventory from "../../pages/Seller/Inventory.jsx";
import Payments from "../../pages/Seller/Payments.jsx";
import Settings from "../../pages/Seller/Settings.jsx";
import MyProfile from "../../pages/seller/MyProfile.jsx";

// AUTH GUARDS
import {
  SellerProtectedRoute,
  SellerSignInRoute
} from "../../Route/protectedRoutes/SellerAuthGuard.jsx";

import SellerAccountPending
  from "../../pages/seller/AccountPending/AccountPending.jsx";
import SellerQA from "../../components/sellerDashboard/SellerQA.jsx";



// ⭐ SELLER AUTH ROUTES (REGISTER / LOGIN)
const sellerAuthRoutes = {
  path: "/seller/auth",
  element: <SellerSignInRoute />,
  children: [
    { path: "login", element: <SellerLogin /> },
    { path: "register", element: <SellerRegister /> },
    { path: "forget", element: <ForGetPassword /> },
    { path: "verify-otp", element: <SellerVerfyOtp /> },
    { path: "reset-password", element: <ResetPassword /> },
    { path: "account-pending", element: <SellerAccountPending /> }

  ]
};


// ⭐ DIRECT LOGIN ROUTE (Shortcut)
const sellerDirectLoginRoute = {
  path: "/seller/login",
  element: <SellerLogin />
};



// ⭐ MAIN SELLER DASHBOARD ROUTES (PROTECTED)
const sellerDashboardRoutes = {
  path: "/seller",
  element: <SellerProtectedRoute />,  // seller token guard
  children: [
    {
      element: <SellerDashboardLayout />, // Sidebar + Header Layout
      children: [
        { index: true, element: <Dashboard /> },
        { path: "dashboard", element: <Dashboard /> },
        { path: "products", element: <Products /> },
        { path: "orders", element: <Orders /> },
        { path: "inventory", element: <Inventory /> },
        { path: "payments", element: <Payments /> },
        { path: "settings", element: <Settings /> },
        { path: "qa", element: <SellerQA /> },
        { path: "myprofile", element: <MyProfile /> }
      ]
    }
  ]
};


// EXPORT ALL ROUTES
export {
  sellerAuthRoutes,
  sellerDashboardRoutes,
  sellerDirectLoginRoute
};

import React from "react";

// 🔐 AUTH GUARDS
import {
  SupplierProtectedRoute,
  SupplierSignInRoute
} from "../protectedRoutes/SupplierAuthGuard";

// AUTH PAGES
import Signup from "../../pages/SupplierSignup/Signup";
import SupplierLogin from "../../pages/SupplierSignup/SupplierLogin/SupplierLogin";
import SupplierForgotPassword from "../../pages/SupplierSignup/SupplierForgotPassword/SupplierForgotPassword";
import SupplierVerifyOtp from "../../pages/SupplierSignup/SupplierForgotPassword/SupplierVerifyOtp";
import SupplierResetPassword from "../../pages/SupplierSignup/SupplierForgotPassword/SupplierResetPassword";
// import SupplierAccountPending from "../../pages/SupplierSignup/SupplierAccountPending/SupplierAccountPending";
import SupplierAccountApproved from "../../pages/SupplierSignup/SupplierRegister/SupplierAccountApproved";

// DASHBOARD LAYOUT + PAGES
import SupplierLayout from "../../layout/SupplierDashboard/SupplierLayout";
import DashboardHome from "../../components/SupplierDashboardComponents/DashboardOverview";
import ProductManagement from "../../components/SupplierDashboardComponents/ProductManagement";
import OrderManagement from "../../components/SupplierDashboardComponents/OrderManagement";
import MarketplaceInsights from "../../components/SupplierDashboardComponents/MarketplaceInsights";
import FinancePayouts from "../../components/SupplierDashboardComponents/FinancePayouts";
import TradeAssurance from "../../components/SupplierDashboardComponents/TradeAssurance";
import SupplierProfileSettings from "../../components/SupplierDashboardComponents/SupplierProfile";
import MessagingCenter from "../../components/SupplierDashboardComponents/MessagingCenter";
import Settings from "../../components/SupplierDashboardComponents/Settings";
import SupplierQA from "../../components/SupplierDashboardComponents/SupplierQA";


const supplierRoutes = {
  path: "/supplier",
  children: [

    // 🔓 AUTH ROUTES (NO TOKEN)
    {
      element: <SupplierSignInRoute />,
      children: [
        { path: "login", element: <SupplierLogin /> },
        { path: "signup", element: <Signup /> },
        { path: "forgot-password", element: <SupplierForgotPassword /> },
        { path: "verify-forgot-otp", element: <SupplierVerifyOtp /> },
        { path: "reset-password", element: <SupplierResetPassword /> }
      ]
    },

    // ⏳ PENDING / REJECTED
    // { path: "account-pending", element: <SupplierAccountPending /> },
    { path: "account-approved", element: <SupplierAccountApproved /> },

    // 🔐 PROTECTED DASHBOARD
    {
      element: <SupplierProtectedRoute />,
      children: [
        {
          element: <SupplierLayout />,
          children: [
            { index: true, element: <DashboardHome /> },
            { path: "dashboard", element: <DashboardHome /> },
            { path: "product", element: <ProductManagement /> },
            { path: "order", element: <OrderManagement /> },
            { path: "insights", element: <MarketplaceInsights /> },
            { path: "finance", element: <FinancePayouts /> },
            { path: "assurance", element: <TradeAssurance /> },
            { path: "profile", element: <SupplierProfileSettings /> },
            { path: "messaging", element: <MessagingCenter /> },
            { path: "settings", element: <Settings /> },
            { path: "qa", element: <SupplierQA /> },
          ]
        }
      ]
    }
  ]
};

export default supplierRoutes;

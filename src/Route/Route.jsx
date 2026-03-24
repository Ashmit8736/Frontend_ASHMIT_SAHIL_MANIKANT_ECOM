// import { createBrowserRouter } from "react-router-dom";

// // Landing (Buyer choose page)
// import LandingPage from "../pages/Landing/LandingPage.jsx";

// // USER AUTH ROUTES (Login/Register/OTP/Forget)
// import authRoutes from "./auth/authRoutes.jsx";
// import { UserSignInRoute, UserProtectedRoute } from "../Route/protectedRoutes/UserAuthGuard.jsx";

// // BUYER LOGGED-IN ROUTES
// import userRoutes from "./user/userRoutes.jsx";

// // SELLER ROUTES
// import {
//   sellerAuthRoutes,
//   sellerDashboardRoutes,
//   sellerDirectLoginRoute
// } from "./seller/sellerRoutes.jsx";

// // SUPPLIER ROUTES
// import supplierRoutes from "./supplier/supplierRoutes.jsx";

// // ADMIN ROUTES
// import adminRoutes from "./admin/adminRoutes.jsx";

// import Layout from "../layout/Layout.jsx";


// const router = createBrowserRouter([

//   // ⭐ Landing page
//   { path: "/", element: <LandingPage /> },

//   // ⭐ Buyer login/register/otp pages
//   {
//     path: authRoutes.path,
//     element: <UserSignInRoute />,
//     children: authRoutes.children,
//   },

//   // ⭐ Seller login
//   sellerAuthRoutes,

//   // ⭐ Seller direct login
//   sellerDirectLoginRoute,

//   // ⭐ Seller dashboard
//   sellerDashboardRoutes,

//   // ⭐ Supplier routes
//   supplierRoutes,

//   // ⭐ BUYER LOGGED-IN AREA (Full Website)
//   {
//     path: "/app",
//     element: <UserProtectedRoute />,
//     children: [
//       {
//         element: <Layout />,
//         children: userRoutes.children
//       }
//     ]
//   },
//   // ⭐ Admin
//   adminRoutes,
// ]);

// export default router;

// src/Route/Route.jsx

import { createBrowserRouter } from "react-router-dom";

import LandingPage from "../pages/Landing/LandingPage.jsx";

import authRoutes from "./auth/authRoutes.jsx";
import { UserSignInRoute, UserProtectedRoute } from "../Route/protectedRoutes/UserAuthGuard.jsx";

import userRoutes from "./user/userRoutes.jsx";

import {
  sellerAuthRoutes,
  sellerDashboardRoutes,
  sellerDirectLoginRoute
} from "./seller/sellerRoutes.jsx";

import supplierRoutes from "./supplier/supplierRoutes.jsx";

import adminRoutes from "./admin/adminRoutes.jsx";
import footerRoutes from "./footer/footerRoutes.jsx";  // ⭐ admin routing
import Layout from "../layout/Layout.jsx";
// import AuthLayout from "../layout/AuthLayout.jsx";
import AuthLayout from "../layout/AuthLayout.jsx";
import AccountPending from "../pages/Buyer_Auth/AccountPending.jsx";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop.jsx";


{/* <ScrollToTop /> */ }
const router = createBrowserRouter([

  // ⭐ Landing page
  { path: "/", element: <LandingPage /> },

  // ⭐ Buyer Auth Routes
  {
    path: authRoutes.path,
    element: <UserSignInRoute />,
    children: authRoutes.children,

  },

  sellerAuthRoutes,
  sellerDirectLoginRoute,
  sellerDashboardRoutes,
  supplierRoutes,
  // ...footerRoutes,

  // ⭐ Buyer Logged-in website
  {
    path: "/app",
    element: <UserProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          ...userRoutes.children,
          ...footerRoutes,   // ✅ YAHI MAIN FIX
        ],
      },
    ],
  },


  // {
  //   path: "/account-pending",
  //   element: <UserProtectedRoute />,
  //   children: [
  //     {
  //       element: <AccountPending />
  //     }
  //   ]
  // },

  // ⭐ ADMIN (spreading admin routes)
  ...adminRoutes,
]);

export default router;

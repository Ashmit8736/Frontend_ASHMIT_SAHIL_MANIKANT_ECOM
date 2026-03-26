// src/Route/admin/adminRoutes.jsx

import React from "react";
import AdminLayout from "../../layout/admin_dashboard/AdminLayout.jsx";

import Dashboard from "../../pages/adminDashboard/Admin.jsx";
import AdminOrders from "../../pages/adminDashboard/AdminOrders.jsx";
import AdminProducts from "../../pages/adminDashboard/AdminProducts.jsx";
import AdminUsers from "../../pages/adminDashboard/AdminUsers.jsx";
import AdminSellers from "../../pages/adminDashboard/AdminSellers.jsx";
import AdminAnalytics from "../../pages/adminDashboard/AdminAnalytics.jsx";
import AdminInventory from "../../pages/adminDashboard/AdminInventory.jsx";
import AdminTransactions from "../../pages/adminDashboard/AdminTransactions.jsx";
import AdminSettings from "../../pages/adminDashboard/AdminSettings.jsx";
import AdminProfile from "../../pages/adminDashboard/AdminProfile.jsx";

import AdminLogin from "../../pages/adminDashboard/admin_auth/AdminLogin.jsx";
import AdminRegister from "../../pages/adminDashboard/admin_auth/AdminRegister.jsx";

import { AdminProtectedRoute } from "../../Route/protectedRoutes/AdminAuthGuard.jsx";

import AdminBuyers from "../../pages/adminDashboard/AdminBuyers.jsx";
import AdminSuppliers from "../../pages/adminDashboard/AdminSuppliers.jsx";

import AdminCategories from "../../pages/adminDashboard/AdminCategories.jsx";

const adminRoutes = [

  // ⭐ PUBLIC ROUTES (NO LOGIN REQUIRED)
  { path: "/admin/login", element: <AdminLogin /> },
  { path: "/admin/register", element: <AdminRegister /> },

  // ⭐ PROTECTED ADMIN AREA
  {
    path: "/admin/dashboard",
    element: <AdminProtectedRoute />,  // protect everything inside /admin
    children: [
      {
        element: <AdminLayout />, // admin UI wrapper
        children: [
          { index: true, element: <Dashboard /> },       // /admin
          // { path: "dashboard", element: <Dashboard /> }, // /admin/dashboard
          { path: "orders", element: <AdminOrders /> },
          { path: "products", element: <AdminProducts /> },
          { path: "users", element: <AdminUsers /> },
          { path: "categories", element: <AdminCategories /> },
          { path: "sellers", element: <AdminSellers /> },
          { path: "analytics", element: <AdminAnalytics /> },
          { path: "inventory", element: <AdminInventory /> },
          { path: "transactions", element: <AdminTransactions /> },
          { path: "settings", element: <AdminSettings /> },
          { path: "profile", element: <AdminProfile /> },
          { path: "buyers", element: <AdminBuyers /> },
          { path: "suppliers", element: <AdminSuppliers /> },

        ],
      },
    ],
  },
];

export default adminRoutes;

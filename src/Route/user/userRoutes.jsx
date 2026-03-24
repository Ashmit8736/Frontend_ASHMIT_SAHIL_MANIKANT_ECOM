

import React from "react";
import Layout from "../../layout/Layout.jsx";

import Home from "../../pages/Home.jsx";
import AllProducts from "../../pages/AllProducts.jsx";
import AllCategories from "../../pages/AllCategories.jsx"; // ✅ ADD THIS

import MyProfile from "../../pages/MyProfile.jsx";
import Orders from "../../pages/Orders.jsx";
import WishList from "../../pages/WishList.jsx";
import Notification from "../../pages/Notification.jsx";

import Suppliers from "../../pages/Suppliers.jsx";
import SupplierProfile from "../../components/SupplierProfile/SupplierProfile.jsx";
import SupplierDashboard from "../../pages/SupplierDashboard.jsx";

import ProductDetails from "../../components/ProductDetails/ProductDetails.jsx";
import PartnerDetails from "../../components/PartnerDetails/PartnerDetails.jsx";

import Cart from "../../components/Cart/Cart.jsx";
import Checkout from "../../components/Cart/Checkout.jsx";
import OrderSuccess from "../../components/OrderSuccess/OrderSuccess.jsx";
import CategoryProducts from "../../components/Category/CategoryProducts.jsx";

// import CategoryProducts from "../../components/Category/CategoryProducts.jsx";

import ScrollToTop from "../../components/ScrollToTop/ScrollToTop.jsx";


{/* <ScrollToTop /> */ }
const userRoutes = {

  path: "/app",
  element: <Layout />,
  children: [
    // 🏠 HOME
    { index: true, element: <Home /> },

    // 📂 CATEGORIES
    { path: "categories", element: <AllCategories /> },   // View All Categories
    { path: "category/:id", element: <CategoryProducts /> },
    // { path: "category/:id", element: <AllProducts /> }, // Category wise products

    // 🛍️ PRODUCTS
    { path: "allproducts", element: <AllProducts /> },
    { path: "product/:id", element: <ProductDetails /> },

    // 👤 USER
    { path: "myprofile", element: <MyProfile /> },
    { path: "orders", element: <Orders /> },
    { path: "wishlist", element: <WishList /> },
    { path: "notification", element: <Notification /> },

    // 🏭 SUPPLIERS
    { path: "suppliers", element: <Suppliers /> },
    { path: "details/:role/:id", element: <PartnerDetails /> },
    { path: "supplierprofile", element: <SupplierProfile /> },
    { path: "supplierdashboard", element: <SupplierDashboard /> },

    // 🛒 CART & CHECKOUT
    { path: "cart", element: <Cart /> },
    { path: "checkout", element: <Checkout /> },
    { path: "order-success", element: <OrderSuccess /> },
  ],
};


export default userRoutes;

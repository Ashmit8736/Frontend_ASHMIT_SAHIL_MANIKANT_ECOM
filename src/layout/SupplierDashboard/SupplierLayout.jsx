import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../../components/SupplierDashboardComponents/Sidebar.jsx";
import Header from "../../components/SupplierDashboardComponents/Header.jsx";
import styles from "./SupplierLayout.module.css";

const SupplierLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activePage, setActivePage] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Mapping routes to active page
  const routeMap = {
    "/supplier/dashboard": "dashboard",
    "/supplier/product": "product",
    "/supplier/order": "order",
    "/supplier/insights": "insights",
    "/supplier/finance": "finance",
    "/supplier/assurance": "assurance",
    "/supplier/profile": "profile",
    "/supplier/messaging": "messaging",
    "/supplier/settings": "settings",
    "/supplier/qa": "qa",
  };

  // Sync page with URL
  useEffect(() => {
    const page = routeMap[location.pathname];
    if (page) setActivePage(page);
  }, [location.pathname]);

  const handleNavigation = (page) => {
    setActivePage(page);
    const path = Object.keys(routeMap).find((key) => routeMap[key] === page);
    if (path) navigate(path);
    setIsSidebarOpen(false);
  };

  return (
    <div className={styles.supplierLayout}>
      <Sidebar
        activePage={activePage}
        setActivePage={handleNavigation}
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className={styles.mainContent}>
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className={styles.pageContent}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SupplierLayout;

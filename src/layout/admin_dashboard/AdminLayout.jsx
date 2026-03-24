import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/adminDeshbord/Sidebar/Sidebar";
import Navbar from "../../components/adminDeshbord/Navbar/Navbar";
import styles from "./AdminLayout.module.css";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className={styles.adminLayout}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={styles.mainContent}>
        <Navbar toggleSidebar={toggleSidebar} />
        <div className={styles.pageContent}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

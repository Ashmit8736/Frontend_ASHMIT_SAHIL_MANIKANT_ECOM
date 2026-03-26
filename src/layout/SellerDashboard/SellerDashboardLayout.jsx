import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import SellerNavbar from "../../components/sellerDashboard/SellerNavbar.jsx";
import SellerSidebar from "../../components/sellerDashboard/SellerSidebar.jsx";
import SellerFooter from "../../components/sellerDashboard/SellerFooter.jsx";

import styles from "./SellerDashboardLayout.module.css";

const SellerDashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => setSidebarOpen((p) => !p);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className={styles.layoutContainer}>

            {/* 🔥 MOBILE OVERLAY */}
            {sidebarOpen && (
                <div
                    className={styles.overlay}
                    onClick={closeSidebar}
                />
            )}

            {/* SIDEBAR */}
            <SellerSidebar isOpen={sidebarOpen} />

            {/* RIGHT AREA */}
            <div className={styles.rightSection}>
                {/* NAVBAR */}
                <SellerNavbar toggleSidebar={toggleSidebar} />

                {/* PAGE CONTENT */}
                <div className={styles.contentArea}>
                    <Outlet />
                </div>

                {/* FOOTER */}
                <SellerFooter />
            </div>
        </div>
    );
};

export default SellerDashboardLayout;

import React from "react";
import styles from "./SellerSidebar.module.css";
import { NavLink } from "react-router-dom";

const SellerSidebar = ({ isOpen = true, onClose }) => {
    return (
        <>
            {/* OVERLAY (ONLY MOBILE) */}
            {isOpen && (
                <div
                    className={styles.sidebarOverlay}
                    onClick={onClose}
                />
            )}

            <aside className={isOpen ? styles.sidebarOpen : styles.sidebarClosed}>
                <div className={styles.profileBox}>
                    <h3>Your Store</h3>
                </div>

                <nav className={styles.menu}>
                    <NavLink to="/seller" className={styles.link}>🏠 Dashboard</NavLink>
                    <NavLink to="/seller/products" className={styles.link}>🛍 Products</NavLink>
                    <NavLink to="/seller/orders" className={styles.link}>📦 Orders</NavLink>
                    <NavLink to="/seller/qa" className={styles.link}>💬 Q&A</NavLink> {/* ✅ ADD KARO */}
                    <NavLink to="/seller/inventory" className={styles.link}>📊 Inventory</NavLink>
                    <NavLink to="/seller/settings" className={styles.link}>⚙ Settings</NavLink>
                </nav>
            </aside>
        </>
    );
};

export default SellerSidebar;

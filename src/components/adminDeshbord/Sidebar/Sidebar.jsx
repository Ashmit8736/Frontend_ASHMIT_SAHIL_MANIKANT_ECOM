import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";
import {
  FaTachometerAlt,
  FaShoppingCart,
  FaBoxOpen,
  FaUsers,
  FaStore,
  FaChartBar,
  FaWarehouse,
  FaExchangeAlt,
  FaCog,
  FaHome,
  FaTags
} from "react-icons/fa";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FaTachometerAlt /> },
    { name: "Orders", path: "/admin/dashboard/orders", icon: <FaShoppingCart /> },
    { name: "Products", path: "/admin/dashboard/products", icon: <FaBoxOpen /> },
    { name: "Users", path: "/admin/dashboard/users", icon: <FaUsers /> },
    { name: "Categories", path: "/admin/dashboard/categories", icon: <FaTags /> },
    { name: "Buyers", path: "/admin/dashboard/buyers", icon: <FaUsers /> },
    { name: "Suppliers", path: "/admin/dashboard/suppliers", icon: <FaStore /> },
    { name: "Sellers", path: "/admin/dashboard/sellers", icon: <FaStore /> },
    // { name: "Analytics", path: "/admin/dashboard/analytics", icon: <FaChartBar /> },
    { name: "Inventory", path: "/admin/dashboard/inventory", icon: <FaWarehouse /> },
    // { name: "Transactions", path: "/admin/dashboard/transactions", icon: <FaExchangeAlt /> },
    // { name: "Settings", path: "/admin/dashboard/settings", icon: <FaCog /> },
  ];

  return (
    <>
      {/* 🔹 Overlay for mobile */}
      <div
        className={`${styles.sidebarOverlay} ${isOpen ? styles.active : ""}`}
        onClick={toggleSidebar}
      ></div>

      {/* 🔹 Sidebar */}
      <aside className={`${styles.sidebar} ${isOpen ? styles.active : ""}`}>
        {/* <div className={styles.logo}>
          <FaHome className={styles.homeIcon} />
          <span>B2B Admin</span>
        </div> */}

        <ul className={styles.menu}>
          {menuItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                end
                onClick={toggleSidebar}
                className={({ isActive }) =>
                  isActive
                    ? `${styles.link} ${styles.activeLink}`
                    : styles.link
                }
              >
                <span className={styles.icon}>{item.icon}</span>
                <span className={styles.linkText}>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;

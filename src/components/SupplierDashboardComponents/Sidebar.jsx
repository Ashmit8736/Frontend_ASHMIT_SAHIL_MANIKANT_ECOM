

import React from "react";
import styles from "./Sidebar.module.css";
import {
  FaTachometerAlt,
  FaBox,
  FaClipboardList,
  FaChartLine,
  FaMoneyBill,
  FaHandshake,
  FaStore,
  FaComments,
  FaCog,
  FaTimes,
} from "react-icons/fa";

const Sidebar = ({ activePage, setActivePage, isOpen, toggleSidebar }) => {
  const items = [
    { key: "dashboard", icon: <FaTachometerAlt />, label: "Dashboard" },
    { key: "product", icon: <FaBox />, label: "Product Management" },
    { key: "order", icon: <FaClipboardList />, label: "Order Management" },
    { key: "qa", icon: <FaComments />, label: "Q&A" }, // ✅ YAHAN ADD KARO
    // { key: "insights", icon: <FaChartLine />, label: "Marketplace Insights" },
    // { key: "finance", icon: <FaMoneyBill />, label: "Finance & Payouts" },
    // { key: "assurance", icon: <FaHandshake />, label: "Trade Assurance" },
    { key: "profile", icon: <FaStore />, label: "Supplier Profile" },
    // { key: "messaging", icon: <FaComments />, label: "Messaging Center" },
    // { key: "settings", icon: <FaCog />, label: "Settings" },
  ];

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.active : ""}`}
        onClick={toggleSidebar}
      ></div>

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <div className={styles.header}>
          <span className={styles.logo}>B2B</span>
          <FaTimes className={styles.closeBtn} onClick={toggleSidebar} />
        </div>

        <nav>
          <ul>
            {items.map((item) => (
              <li
                key={item.key}
                className={`${styles.sidebarItem} ${activePage === item.key ? styles.active : ""
                  }`}
                onClick={() => setActivePage(item.key)}
              >
                {item.icon}
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

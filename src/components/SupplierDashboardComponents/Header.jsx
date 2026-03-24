import React, { useEffect, useState, useRef } from "react";
import styles from "./Header.module.css";
import { FaBars, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:3000/api/supplier";

const Header = ({ toggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [supplierName, setSupplierName] = useState("Supplier");

  const dropdownRef = useRef();
  const navigate = useNavigate();

  // =========================
  // FETCH SUPPLIER NAME
  // =========================
  useEffect(() => {
    const fetchSupplierName = async () => {
      try {
        const res = await axios.get(`${API_BASE}/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("supplierToken")}`,
          },
        });

        setSupplierName(res.data.profile.fullname);
      } catch (err) {
        console.error("Header Profile Error:", err);
      }
    };

    fetchSupplierName();
  }, []);

  // =========================
  // INITIALS (A D)
  // =========================
  const initials = supplierName
    .split(" ")
    .map(n => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // =========================
  // CLOSE DROPDOWN
  // =========================
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // const handleLogout = () => {
  //  // localStorage.clear();
  //   navigate("/");
  // };

const handleLogout = () => {
  localStorage.removeItem("supplierToken");
  localStorage.removeItem("supplierStatus");

  localStorage.setItem("logout", Date.now());

  navigate("/", { replace: true });
};



  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <FaBars className={styles.menuToggle} onClick={toggleSidebar} />
        <h2 className={styles.logoText}>B2B Supplier</h2>
      </div>

      <div className={styles.userSection} ref={dropdownRef}>
        <div
          className={styles.profileWrapper}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {/* 🔥 AVATAR */}
          <div className={styles.avatar}>{initials}</div>

          <span className={styles.username}>{supplierName}</span>
        </div>

        {dropdownOpen && (
          <ul className={styles.profileDropdown}>
            <li onClick={() => navigate("/supplier/profile")}>
              Profile
            </li>
            {/* <li onClick={() => navigate("/supplier/settings")}>
              <FaCog /> Settings
            </li> */}
            <li onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </li>
          </ul>
        )}
      </div>
    </header>
  );
};

export default Header;

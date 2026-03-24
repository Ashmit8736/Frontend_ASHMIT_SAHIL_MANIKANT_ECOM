

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./SellerNavbar.module.css";

const API_BASE = "http://localhost:3000/api/auth/seller";

const SellerNavbar = ({ toggleSidebar }) => {
    const navigate = useNavigate();

    const [openNotif, setOpenNotif] = useState(false);
    const [openProfile, setOpenProfile] = useState(false);
    const [seller, setSeller] = useState({
        fullname: "Seller",
        profile_image: null,
    });

    /* ================= FETCH SELLER PROFILE ================= */
    useEffect(() => {
        const token = localStorage.getItem("sellerToken");
        if (!token) return;

        axios
            .get(`${API_BASE}/seller-data`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setSeller(res.data.seller);
            })
            .catch((err) => {
                console.error("Seller Navbar Error:", err);
            });
    }, []);

    /* ================= INITIALS ================= */
    const initials = seller.fullname
        ?.split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <nav className={styles.navbar}>
            {/* Sidebar Toggle */}
            <button className={styles.menuBtn} onClick={toggleSidebar}>☰</button>

            <h2 className={styles.title}>Seller Dashboard</h2>

            <div className={styles.rightMenu}>
                {/* 🔔 Notifications */}
                <div className={styles.dropdownWrapper}>
                    {/* <span
                        className={styles.icon}
                        onClick={() => {
                            setOpenNotif(!openNotif);
                            setOpenProfile(false);
                        }}
                    >
                        🔔
                    </span> */}

                    {openNotif && (
                        <div className={styles.notifDropdown}>
                            <h4>Notifications</h4>
                            <p className={styles.notifItem}>No new notifications</p>
                        </div>
                    )}
                </div>

                {/* 💬 Messages */}
                {/* <span className={styles.icon}>💬</span> */}

                {/* 👤 PROFILE */}
                <div className={styles.dropdownWrapper}>
                    <div
                        className={styles.profileBox}
                        onClick={() => {
                            setOpenProfile(!openProfile);
                            setOpenNotif(false);
                        }}
                    >
                        {seller.profile_image ? (
                            <img
                                src={seller.profile_image}
                                className={styles.profileImg}
                                alt="profile"
                            />
                        ) : (
                            <div className={styles.avatar}>{initials}</div>
                        )}

                        <span className={styles.username}>{seller.fullname}</span>
                    </div>

                    {openProfile && (
                        <div className={styles.profileDropdown}>
                            <button onClick={() => navigate("/seller/myprofile")}>
                                My Profile
                            </button>
                            <button onClick={() => navigate("/seller/settings")}>
                                Settings
                            </button>
                            <button
                                onClick={() => {
                                    localStorage.removeItem("sellerToken");
                                    window.location.href = "/";
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default SellerNavbar;
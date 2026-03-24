import React, { useEffect, useState } from "react";
import styles from "./AdminProfile.module.css";
import {
    FaEnvelope, FaPhone, FaMapMarkerAlt,
    FaBriefcase, FaUserShield
} from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";

// Default avatar
import AdminImg from "../../../src/assets/admin.png";

const AdminProfile = () => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🔥 Fetch Admin Profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("adminToken");

                const res = await axios.get(
                    "http://localhost:3000/api/admin/profile",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                setAdmin(res.data.admin);
            } catch (err) {
                console.error("Profile fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) return <p className={styles.loading}>Loading profile...</p>;
    if (!admin) return <p className={styles.error}>Could not load profile</p>;

    const profileImageSrc = AdminImg;

    return (
        <motion.div
            className={styles.profileContainer}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className={styles.profileCard}>

                {/* ---------- Header ---------- */}
                <div className={styles.profileHeader}>
                    <img
                        src={profileImageSrc}
                        alt="Admin"
                        className={styles.profileAvatarImg}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                                "https://placehold.co/120x120/3b82f6/ffffff?text=AD";
                        }}
                    />

                    <h1>{admin.name}</h1>
                    <p className={styles.profileRole}>Admin</p>

                    {/* <p className={styles.profileSubRole}>
                        <FaBriefcase className={styles.headerIcon} />
                        IT & Operations
                    </p> */}
                </div>

                {/* ---------- Two Column Grid ---------- */}
                <div className={styles.profileDetailsGrid}>

                    {/* --- Contact Section --- */}
                    <div className={styles.detailsSection}>
                        <h3><FaEnvelope className={styles.sectionTitleIcon} /> Contact Information</h3>

                        <div className={styles.detailItem}>
                            <p>Email:</p>
                            <span>{admin.email}</span>
                        </div>

                        {/* <div className={styles.detailItem}>
                            <p>Phone:</p>
                            <span>Not Set</span>
                        </div> */}

                        {/* <div className={styles.detailItem}>
                            <p>Location:</p>
                            <span>India</span>
                        </div> */}
                    </div>

                    {/* --- System Section --- */}
                    <div className={styles.detailsSection}>
                        <h3><FaUserShield className={styles.sectionTitleIcon} /> System & Access</h3>

                        {/* <div className={styles.detailItem}>
                            <p>Role:</p>
                            <span>Administrator</span>
                        </div> */}

                        <div className={styles.detailItem}>
                            <p>Joined On:</p>
                            <span>{new Date(admin.created_at).toDateString()}</span>
                        </div>

                        <div className={styles.detailItem}>
                            <p>Last Login:</p>
                            <span>{new Date().toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminProfile;

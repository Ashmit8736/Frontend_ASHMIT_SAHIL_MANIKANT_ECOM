import React, { useState, useEffect } from "react";
import { Save, Shield, UserCog } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import styles from "./AdminSettings.module.css";

const AdminSettings = () => {
    const [activeTab, setActiveTab] = useState("General");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const [settings, setSettings] = useState({
        siteName: "",
        email: "",
        language: "",
        twoFactor: false,
        maintenanceMode: "Off",
    });

    // ===============================
    // 🔥 LOAD SETTINGS FROM BACKEND
    // ===============================
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const token = localStorage.getItem("adminToken");

                const res = await axios.get(
                    "http://localhost:3000/api/admin/settings",
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setSettings({
                    siteName: res.data.settings?.site_name || "",
                    email: res.data.admin?.email || "",        // ⭐ correct admin email
                    language: res.data.settings?.language || "",
                    twoFactor: res.data.settings?.two_factor || false,
                    maintenanceMode: res.data.settings?.maintenance_mode || "Off",
                });

                setLoading(false);

            } catch (err) {
                console.log("SETTINGS FETCH ERROR:", err);
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);


    // ===============================
    // 📝 HANDLE INPUT CHANGE
    // ===============================
    const handleChange = (field, value) => {
        setSettings((prev) => ({ ...prev, [field]: value }));
    };

    // ===============================
    // 💾 SAVE SETTINGS TO BACKEND
    // ===============================
    const handleSave = async () => {
        try {
            setSaving(true);
            setMessage("");

            const token = localStorage.getItem("adminToken");

            await axios.put(
                "http://localhost:3000/api/admin/settings",
                settings,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSaving(false);
            setMessage("✅ Settings saved successfully!");

            setTimeout(() => setMessage(""), 2500);
        } catch (err) {
            console.log("SAVE SETTINGS ERROR:", err);
            setSaving(false);
            setMessage("❌ Failed to save settings.");
        }
    };

    const tabs = [
        { name: "General", icon: <UserCog size={16} /> },
        { name: "Security", icon: <Shield size={16} /> },
    ];

    if (loading) return <p className={styles.loading}>Loading settings...</p>;

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <h2 className={styles.title}>Admin Settings</h2>

                <button
                    onClick={handleSave}
                    className={styles.saveBtn}
                    disabled={saving}
                >
                    <Save size={16} />
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            {message && <div className={styles.alertBox}>{message}</div>}

            {/* Tabs */}
            <div className={styles.tabs}>
                {tabs.map((tab) => (
                    <button
                        key={tab.name}
                        className={`${styles.tabBtn} ${activeTab === tab.name ? styles.activePage : ""
                            }`}
                        onClick={() => setActiveTab(tab.name)}
                    >
                        {tab.icon} {tab.name}
                    </button>
                ))}
            </div>

            {/* TAB CONTENT */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.tabContent}
            >
                {/* GENERAL TAB */}
                {activeTab === "General" && (
                    <div className={styles.settingsBox}>
                        <label>
                            Site Name:
                            <input
                                type="text"
                                value={settings.siteName}
                                onChange={(e) => handleChange("siteName", e.target.value)}
                            />
                        </label>

                        <label>
                            Admin Email:
                            <input
                                type="email"
                                value={settings.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                            />
                        </label>

                        <label>
                            Language:
                            <select
                                value={settings.language}
                                onChange={(e) => handleChange("language", e.target.value)}
                            >
                                <option>English</option>
                                <option>Hindi</option>
                                <option>French</option>
                            </select>
                        </label>
                    </div>
                )}

                {/* SECURITY TAB */}
                {activeTab === "Security" && (
                    <div className={styles.settingsBox}>
                        <label className={styles.switchLabel}>
                            <input
                                type="checkbox"
                                checked={settings.twoFactor}
                                onChange={(e) => handleChange("twoFactor", e.target.checked)}
                            />
                            Enable Two-Factor Authentication
                        </label>

                        <label>
                            Change Password:
                            <input type="password" placeholder="Enter new password" />
                        </label>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default AdminSettings;

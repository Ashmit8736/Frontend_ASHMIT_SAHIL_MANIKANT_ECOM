
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Settings.module.css';

const Settings = () => {
    const [loading, setLoading] = useState(true);

    // -------------------------------
    // EDIT MODES FOR SECTIONS
    // -------------------------------
    const [editMode, setEditMode] = useState({
        profile: false,
        owner: false,
        business: false,
        bank: false,
        password: false,
    });

    // -------------------------------
    // PROFILE STATE
    // -------------------------------
    const [profile, setProfile] = useState({
        fullname: "",
        email: "",
        phone: "",
        owner_name: "",
        owner_phone: "",
        owner_email: "",
        gst_no: "",
        company_name: "",
        warehouse_full_address: "",
        warehouse_state: "",
        warehouse_pincode: "",
        bank_account_no: "",
        bank_IFCS: "",
        bank_name: "",
    });

    // -------------------------------
    // PASSWORD STATE
    // -------------------------------
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // -------------------------------
    // LOAD PROFILE FROM BACKEND
    // -------------------------------
    useEffect(() => {
        const token = localStorage.getItem("sellerToken");

        axios.get("http://localhost:3000/api/auth/seller/seller-data", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                setProfile(res.data.seller);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    // -------------------------------
    // HANDLE INPUT CHANGE
    // -------------------------------
    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    // -------------------------------
    // UPDATE SECTIONS INDIVIDUALLY
    // -------------------------------
    const handleUpdate = async (key) => {
        const token = localStorage.getItem("sellerToken");

        try {
            await axios.put(
                "http://localhost:3000/api/auth/seller/seller-update-profile",
                profile,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert(`${key} updated successfully!`);
            setEditMode((prev) => ({ ...prev, [key]: false })); // Lock after save
        } catch (err) {
            alert("Update failed!");
            console.log(err);
        }
    };

    // -------------------------------
    // PASSWORD UPDATE
    // -------------------------------
    const handlePasswordUpdate = async () => {
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            alert("Please fill all fields");
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("New passwords do not match");
            return;
        }

        const token = localStorage.getItem("sellerToken");

        try {
            await axios.put(
                "http://localhost:3000/api/auth/seller/change-password",
                {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Password updated successfully!");

            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

        } catch (err) {
            alert(err.response?.data?.message || "Failed to update password");
        }
    };

    if (loading) return <h2>Loading Settings...</h2>;

    // ===============================================================
    // UI STARTS HERE
    // ===============================================================
    return (
        <div className={styles.settingsContainer}>
            <h1 className={styles.heading}>Settings</h1>

            {/* ------------------------- PROFILE SECTION ------------------------- */}
            <section className={styles.section}>
                <h2 className={styles.title}>Seller Profile</h2>

                {!editMode.profile && (
                    <button
                        className={styles.editBtn}
                        onClick={() => setEditMode({ ...editMode, profile: true })}
                    >
                        Edit
                    </button>
                )}

                <div className={styles.form}>
                    <div className={styles.group}>
                        <label>Full Name</label>
                        <input name="fullname" value={profile.fullname} disabled={!editMode.profile} onChange={handleChange} />
                    </div>

                    <div className={styles.group}>
                        <label>Email</label>
                        <input name="email" value={profile.email} disabled={!editMode.profile} onChange={handleChange} />
                    </div>

                    <div className={styles.group}>
                        <label>Phone</label>
                        <input name="phone" value={profile.phone} disabled={!editMode.profile} onChange={handleChange} />
                    </div>

                    {editMode.profile && (
                        <button className={styles.updateBtn} onClick={() => handleUpdate("profile")}>
                            Save Changes
                        </button>
                    )}
                </div>
            </section>

            {/* ------------------------- OWNER INFO ------------------------- */}
            <section className={styles.section}>
                <h2 className={styles.title}>Business Owner Information</h2>

                {!editMode.owner && (
                    <button
                        className={styles.editBtn}
                        onClick={() => setEditMode({ ...editMode, owner: true })}
                    >
                        Edit
                    </button>
                )}

                <div className={styles.form}>
                    <div className={styles.group}>
                        <label>Owner Name</label>
                        <input name="owner_name" value={profile.owner_name} disabled={!editMode.owner} onChange={handleChange} />
                    </div>

                    <div className={styles.group}>
                        <label>Owner Phone</label>
                        <input name="owner_phone" value={profile.owner_phone} disabled={!editMode.owner} onChange={handleChange} />
                    </div>

                    <div className={styles.group}>
                        <label>Owner Email</label>
                        <input name="owner_email" value={profile.owner_email} disabled={!editMode.owner} onChange={handleChange} />
                    </div>

                    {editMode.owner && (
                        <button className={styles.updateBtn} onClick={() => handleUpdate("owner")}>
                            Save Owner Info
                        </button>
                    )}
                </div>
            </section>

            {/* ------------------------- BUSINESS INFO ------------------------- */}
            <section className={styles.section}>
                <h2 className={styles.title}>Business Information</h2>

                {!editMode.business && (
                    <button
                        className={styles.editBtn}
                        onClick={() => setEditMode({ ...editMode, business: true })}
                    >
                        Edit
                    </button>
                )}

                <div className={styles.form}>
                    <div className={styles.group}>
                        <label>GST Number</label>
                        <input name="gst_no" value={profile.gst_no} disabled={!editMode.business} onChange={handleChange} />
                    </div>

                    <div className={styles.group}>
                        <label>Company Name</label>
                        <input name="company_name" value={profile.company_name} disabled={!editMode.business} onChange={handleChange} />
                    </div>

                    <div className={styles.group}>
                        <label>Warehouse Address</label>
                        <textarea name="warehouse_full_address" value={profile.warehouse_full_address} disabled={!editMode.business} onChange={handleChange} />
                    </div>

                    <div className={styles.group}>
                        <label>State</label>
                        <input name="warehouse_state" value={profile.warehouse_state} disabled={!editMode.business} onChange={handleChange} />
                    </div>

                    <div className={styles.group}>
                        <label>Pincode</label>
                        <input name="warehouse_pincode" value={profile.warehouse_pincode} disabled={!editMode.business} onChange={handleChange} />
                    </div>

                    {editMode.business && (
                        <button className={styles.updateBtn} onClick={() => handleUpdate("business")}>
                            Save Business Info
                        </button>
                    )}
                </div>
            </section>

            {/* ------------------------- BANK DETAILS ------------------------- */}
            <section className={styles.section}>
                <h2 className={styles.title}>Bank Details</h2>

                {!editMode.bank && (
                    <button
                        className={styles.editBtn}
                        onClick={() => setEditMode({ ...editMode, bank: true })}
                    >
                        Edit
                    </button>
                )}

                <div className={styles.form}>
                    <div className={styles.group}>
                        <label>Account Number</label>
                        <input name="bank_account_no" value={profile.bank_account_no} disabled={!editMode.bank} onChange={handleChange} />
                    </div>

                    <div className={styles.group}>
                        <label>IFSC Code</label>
                        <input name="bank_IFCS" value={profile.bank_IFCS} disabled={!editMode.bank} onChange={handleChange} />
                    </div>

                    <div className={styles.group}>
                        <label>Bank Name</label>
                        <input name="bank_name" value={profile.bank_name} disabled={!editMode.bank} onChange={handleChange} />
                    </div>

                    {editMode.bank && (
                        <button className={styles.updateBtn} onClick={() => handleUpdate("bank")}>
                            Save Bank Details
                        </button>
                    )}
                </div>
            </section>

            {/* ------------------------- PASSWORD ------------------------- */}
            {/* ------------------------- PASSWORD ------------------------- */}
            <section className={styles.section}>
                <h2 className={styles.title}>Change Password</h2>

                {!editMode.password && (
                    <button
                        className={styles.editBtn}
                        onClick={() => setEditMode({ ...editMode, password: true })}
                    >
                        Edit
                    </button>
                )}

                <div className={styles.form}>
                    <div className={styles.group}>
                        <label>Current Password</label>
                        <input
                            type="password"
                            disabled={!editMode.password}
                            value={passwordData.currentPassword}
                            onChange={(e) =>
                                setPasswordData({ ...passwordData, currentPassword: e.target.value })
                            }
                        />
                    </div>

                    <div className={styles.group}>
                        <label>New Password</label>
                        <input
                            type="password"
                            disabled={!editMode.password}
                            value={passwordData.newPassword}
                            onChange={(e) =>
                                setPasswordData({ ...passwordData, newPassword: e.target.value })
                            }
                        />
                    </div>

                    <div className={styles.group}>
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            disabled={!editMode.password}
                            value={passwordData.confirmPassword}
                            onChange={(e) =>
                                setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                            }
                        />
                    </div>

                    {editMode.password && (
                        <button className={styles.updateBtn} onClick={() => {
                            handlePasswordUpdate();
                            setEditMode({ ...editMode, password: false });
                        }}>
                            Save Password
                        </button>
                    )}
                </div>
            </section>

        </div>
    );
};

export default Settings;

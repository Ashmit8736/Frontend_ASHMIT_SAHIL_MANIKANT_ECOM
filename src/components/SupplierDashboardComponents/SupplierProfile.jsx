import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./SupplierProfile.module.css";
import {
  Edit3,
  Save,
  User,
  Building,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";

const SupplierProfile = () => {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
  });

  // =========================
  // FETCH SUPPLIER PROFILE
  // =========================
  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/supplier/profile",
        { withCredentials: true } // ⭐ COOKIE AUTH
      );

      const p = res.data.profile;

      setProfile({
        companyName: p.company_name || "",
        contactPerson: p.fullname || "",
        email: p.email || "",
        phone: p.phone || "",
        address: p.address || "",
      });
    } catch (err) {
      console.error("❌ Fetch Profile Error:", err);
      alert("Session expired. Please login again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // =========================
  // SAVE PROFILE
  // =========================
  const handleSave = async () => {
    try {
      await axios.put(
        "http://localhost:3000/api/supplier/profile",
        {
          company_name: profile.companyName,
          fullname: profile.contactPerson,
          phone: profile.phone,
          address: profile.address,
        },
        { withCredentials: true } // ⭐ COOKIE AUTH
      );

      setEditMode(false);
      alert("✅ Profile updated successfully");
    } catch (err) {
      console.error("❌ Update Profile Error:", err);
      alert("Failed to update profile");
    }
  };

  // =========================
  // PROFILE COMPLETION %
  // =========================
  const completionFields = [
    profile.companyName,
    profile.contactPerson,
    profile.email,
    profile.phone,
    profile.address,
  ];

  const completion =
    Math.round(
      (completionFields.filter(v => v && v.trim() !== "").length /
        completionFields.length) * 100
    ) || 0;

  if (loading) {
    return <div className={styles.contentArea}>Loading profile...</div>;
  }

  return (
    <div className={styles.contentArea}>
      <div className={styles.profileCard}>
        {/* HEADER */}
        <div className={styles.header}>
          <h2>Supplier Profile</h2>
          <button
            className={styles.editBtn}
            onClick={() => (editMode ? handleSave() : setEditMode(true))}
          >
            {editMode ? <Save size={18} /> : <Edit3 size={18} />}
            {editMode ? "Save" : "Edit"}
          </button>
        </div>

        <p className={styles.subtitle}>
          Manage your company and business details.
        </p>

        {/* PROFILE HEALTH */}
        <div className={styles.profileHealth}>
          <p>Profile Health</p>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${completion}%` }}
            />
          </div>
          <span>{completion}% Complete</span>
        </div>

        {/* FORM */}
        <div className={styles.form}>
          <label>
            <Building size={16} />
            Company Name
            <input
              name="companyName"
              value={profile.companyName}
              onChange={handleChange}
              disabled={!editMode}
            />
          </label>

          <label>
            <User size={16} />
            Contact Person
            <input
              name="contactPerson"
              value={profile.contactPerson}
              onChange={handleChange}
              disabled={!editMode}
            />
          </label>

          <label>
            <Mail size={16} />
            Email
            <input value={profile.email} disabled />
          </label>

          <label>
            <Phone size={16} />
            Phone
            <input
              name="phone"
              value={profile.phone}
              disabled
            />
          </label>

          <label>
            <MapPin size={16} />
            Address
            <textarea
              name="address"
              value={profile.address}
              onChange={handleChange}
              disabled={!editMode}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default SupplierProfile;

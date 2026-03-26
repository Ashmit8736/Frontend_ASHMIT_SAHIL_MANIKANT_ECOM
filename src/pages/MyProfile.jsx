import React, { useState, useEffect } from "react";
import styles from "../PagesStyles/MyProfile.module.css";
import api from "../store/APi/axiosInstance.jsx";
import { useNavigate } from "react-router-dom";

/* ================= HELPERS ================= */
const getInitials = (first = "", last = "") =>
  `${first?.[0] || ""}${last?.[0] || ""}`.toUpperCase();

const normalizeGender = (g) => {
  if (!g) return "";
  const map = {
    male: "Male",
    female: "Female",
    other: "Other",
  };
  return map[g.toLowerCase()] || "";
};

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/* ================= COMPONENT ================= */
const MyProfile = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    phone: "",
    approval_status: "",
  });

  const [editing, setEditing] = useState({
    profile: false,
    email: false,
  });

  const [errors, setErrors] = useState({});

  /* ================= FETCH PROFILE ================= */
  const getUserProfile = async () => {
    try {
      setLoading(true);

      const res = await api.get("/auth/me");
      const u = res.data.user;

      const parts = (u.username || "").split(" ");

      setUser({
        firstName: parts[0] || "",
        lastName: parts.slice(1).join(" ") || "",
        gender: normalizeGender(u.gender),
        email: u.email || "",
        phone: u.phone || "",
        approval_status: u.approval_status,
      });
    } catch (err) {
      console.error("Profile load failed", err);
      navigate("/auth/login", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  /* ================= VALIDATION ================= */
  const validateProfile = () => {
    const e = {};

    if (!user.firstName.trim()) e.firstName = "First name is required";
    if (!user.lastName.trim()) e.lastName = "Last name is required";
    if (!["Male", "Female", "Other"].includes(user.gender))
      e.gender = "Please select gender";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ================= UPDATE PROFILE ================= */
  const updateProfile = async () => {
    if (!validateProfile()) return;

    try {
      await api.put("/auth/update-profile", {
        firstName: user.firstName.trim(),
        lastName: user.lastName.trim(),
        gender: user.gender.toLowerCase(),
      });

      setEditing((p) => ({ ...p, profile: false }));
      setErrors({});
      getUserProfile();
    } catch (err) {
      alert(err.response?.data?.message || "Profile update failed");
    }
  };

  /* ================= UPDATE EMAIL ================= */
  const updateEmail = async () => {
    if (!isValidEmail(user.email)) {
      alert("Enter a valid email address");
      return;
    }

    try {
      await api.put("/auth/update-email", {
        email: user.email.trim(),
      });

      setEditing((p) => ({ ...p, email: false }));
      getUserProfile();
    } catch (err) {
      alert(err.response?.data?.message || "Email update failed");
    }
  };

  /* ================= LOGOUT ================= */
  const logoutUser = async () => {
    try {
      await api.get("/auth/logout");
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      localStorage.clear();
      navigate("/", { replace: true });
    }
  };

  if (loading) return <p className={styles.loading}>Loading profile…</p>;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.profileCard}>
        {/* AVATAR */}
        <div className={styles.avatarSection}>
          <div className={styles.avatarCircle}>
            {getInitials(user.firstName, user.lastName)}
          </div>

          <h2 className={styles.name}>
            {user.firstName} {user.lastName}
          </h2>

          <span className={`${styles.status} ${styles[user.approval_status]}`}>
            {user.approval_status}
          </span>
        </div>

        {/* ================= BASIC INFO ================= */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>Basic Information</h3>

            {!editing.profile ? (
              <button
                className={styles.editBtn}
                onClick={() => {
                  setUser((p) => ({
                    ...p,
                    gender: normalizeGender(p.gender) || "Male",
                  }));
                  setEditing((p) => ({ ...p, profile: true }));
                }}
              >
                Edit
              </button>
            ) : (
              <button
                className={styles.cancelBtn}
                onClick={() => {
                  setEditing((p) => ({ ...p, profile: false }));
                  setErrors({});
                  getUserProfile();
                }}
              >
                Cancel
              </button>
            )}
          </div>

          {/* NAME */}
          <div className={styles.row}>
            <label>Full Name</label>
            <div className={styles.inline}>
              <input
                value={user.firstName}
                readOnly={!editing.profile}
                onChange={(e) =>
                  setUser({ ...user, firstName: e.target.value })
                }
                placeholder="First name"
              />
              <input
                value={user.lastName}
                readOnly={!editing.profile}
                onChange={(e) =>
                  setUser({ ...user, lastName: e.target.value })
                }
                placeholder="Last name"
              />
            </div>
            {errors.firstName && (
              <span className={styles.error}>{errors.firstName}</span>
            )}
            {errors.lastName && (
              <span className={styles.error}>{errors.lastName}</span>
            )}
          </div>

          {/* GENDER */}
          <div className={styles.row}>
            <label>Gender</label>

            {!editing.profile ? (
              <p className={styles.staticText}>
                {user.gender || "Not specified"}
              </p>
            ) : (
              <div className={styles.genderChips}>
                {["Male", "Female", "Other"].map((g) => (
                  <div
                    key={g}
                    className={`${styles.genderChip} ${
                      user.gender === g ? styles.active : ""
                    }`}
                    onClick={() => setUser({ ...user, gender: g })}
                  >
                    {g}
                  </div>
                ))}
              </div>
            )}
            {errors.gender && (
              <span className={styles.error}>{errors.gender}</span>
            )}
          </div>

          {editing.profile && (
            <div className={styles.saveArea}>
              <button className={styles.primaryBtn} onClick={updateProfile}>
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* ================= CONTACT INFO ================= */}
        <div className={styles.section}>
          <h3>Contact Information</h3>

          {/* EMAIL */}
          <div className={styles.row}>
            <label>Email Address</label>
            <input
              type="email"
              value={user.email}
              readOnly={!editing.email}
              onChange={(e) =>
                setUser({ ...user, email: e.target.value })
              }
            />

            {!editing.email ? (
              <span
                className={styles.linkEdit}
                onClick={() => setEditing((p) => ({ ...p, email: true }))}
              >
                Change
              </span>
            ) : (
              <button className={styles.smallSave} onClick={updateEmail}>
                Save
              </button>
            )}
          </div>

          {/* PHONE */}
          <div className={styles.row}>
            <label>Mobile Number</label>
            <input value={user.phone} readOnly />
            <span className={styles.lockedText}>Cannot be changed</span>
          </div>
        </div>

        {/* LOGOUT */}
        <div className={styles.logoutArea}>
          <button className={styles.logoutBtn} onClick={logoutUser}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;

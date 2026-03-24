import React, { useState, useEffect } from "react";
import styles from "./Navbar.module.css";
import { FaBell, FaSearch, FaUser, FaSignOutAlt, FaCog, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = ({ toggleSidebar, onSearch }) => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [admin, setAdmin] = useState(null);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const token = localStorage.getItem("adminToken");

  // -----------------------------
  // ADMIN PROFILE LOAD
  // -----------------------------
  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/admin/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmin(res.data.admin);
    } catch (err) {
      console.log("Profile load error", err);
    }
  };

  // -----------------------------
  // LOAD NOTIFICATIONS & COUNT
  // -----------------------------
  const loadNotifications = async () => {
    try {
      const [countRes, listRes] = await Promise.all([
        axios.get("http://localhost:3000/api/admin/notifications/count", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:3000/api/admin/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setUnreadCount(countRes.data.count || 0);
      setNotifications(listRes.data.notifications || []);
    } catch (err) {
      console.warn("Using fallback notifications");
      setUnreadCount(0);
      setNotifications([]);
    }
  };

  // -----------------------------
  // MARK NOTIFICATION AS READ
  // -----------------------------
  const markAsRead = async (id) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/admin/notifications/read/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      loadNotifications();
    } catch (err) {
      console.log("Mark-as-read error");
    }
  };

  useEffect(() => {
    fetchProfile();
    loadNotifications();
  }, []);

  // -----------------------------
  // LOGOUT
  // -----------------------------
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login", { replace: true });
  };

  // -----------------------------
  // SEARCH HANDLER (WORKING)
  // -----------------------------
  // const handleSearch = (value) => {
  //   setSearchTerm(value);
  //   if (onSearch) onSearch(value);  // parent component ko result send
  // };

  const initials = admin?.name
    ? admin.name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "A";

  return (
    <nav className={styles.navbar}>

      {/* LEFT SIDE */}
      <div className={styles.leftSection}>
        <FaBars className={styles.menuToggle} onClick={toggleSidebar} />
        <div className={styles.logoIcon}>B2B</div>
        <span className={styles.logoTitle}>Admin</span>
      </div>

      {/* SEARCH BAR */}
      {/* <div className={styles.searchBox}>
        <FaSearch className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search anything..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className={styles.searchInput}
        />
      </div> */}

      {/* RIGHT SIDE */}
      <div className={styles.rightSection}>

        {/* NOTIFICATION ICON */}
        {/* <div
          className={styles.notification}
          onClick={() => {
            setShowNotifications(!showNotifications);
            setShowProfile(false);
          }}
        >
          <FaBell className={styles.icon} />
          {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
        </div> */}

        {/* NOTIFICATION DROPDOWN */}
        {/* {showNotifications && (
          <div className={styles.notificationDropdown}>
            <h4>Notifications</h4>

            {notifications.length === 0 && (
              <p className={styles.emptyNote}>No new notifications</p>
            )}

            {notifications.map((note) => (
              <div
                key={note.id}
                className={`${styles.notificationItem} ${note.is_read ? styles.read : styles.unread
                  }`}
                onClick={() => markAsRead(note.id)}
              >
                <p className={styles.message}>{note.message}</p>
                <span className={styles.time}>
                  {new Date(note.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )} */}

        {/* PROFILE */}
        <div
          className={styles.userProfile}
          onClick={() => {
            setShowProfile(!showProfile);
            setShowNotifications(false);
          }}
        >
          <div className={styles.userAvatar}>{initials}</div>
          <span className={styles.userName}>{admin?.name || "Admin"}</span>

          {showProfile && (
            <div className={styles.dropdownMenu}>
              <div
                onClick={() => navigate("/admin/dashboard/profile")}
                className={styles.dropdownItem}
              >
                <FaUser /> Profile
              </div>


              <div onClick={handleLogout} className={styles.dropdownItem}>
                <FaSignOutAlt /> Logout
              </div>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;

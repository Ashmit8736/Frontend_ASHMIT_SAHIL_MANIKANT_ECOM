import React from "react";
import styles from "./SupplierProfile.module.css";
import { FaUserCircle, FaEnvelope, FaPhoneAlt, FaBuilding, FaMapMarkerAlt } from "react-icons/fa";

const SupplierProfile = () => {
  const user = {
    name: "Ashish Dhimaan",
    email: "ashishdhimaan70@gmail.com",
    phone: "+91 9876543210",
    company: "Kaira Jeweller Pvt. Ltd.",
    location: "Delhi, India",
    role: "Supplier",
    joinDate: "March 2021",
    businessType: "Jewellery Manufacturing",
    gst: "07AABCK1234P1Z9",
    website: "www.kairajewellers.com",
    verified: true,
  };

  return (
    <div className={styles.profileContainer}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.profilePic}>
          <FaUserCircle className={styles.avatar} />
        </div>
        <div>
          <h2 className={styles.name}>{user.name}</h2>
          <p className={styles.role}>{user.role}</p>
          {user.verified && <span className={styles.verified}>Verified</span>}
        </div>
      </div>

      {/* Details Section */}
      <div className={styles.detailsCard}>
        <h3 className={styles.sectionTitle}>Personal Details</h3>
        <div className={styles.infoGrid}>
          <p><FaEnvelope className={styles.icon} /> <span>{user.email}</span></p>
          <p><FaPhoneAlt className={styles.icon} /> <span>{user.phone}</span></p>
          <p><FaMapMarkerAlt className={styles.icon} /> <span>{user.location}</span></p>
          <p><FaBuilding className={styles.icon} /> <span>{user.company}</span></p>
        </div>
      </div>

      {/* Business Info */}
      <div className={styles.detailsCard}>
        <h3 className={styles.sectionTitle}>Business Information</h3>
        <div className={styles.infoGrid}>
          <p><b>Business Type:</b> {user.businessType}</p>
          <p><b>GST Number:</b> {user.gst}</p>
          <p><b>Website:</b> <a href={`https://${user.website}`} target="_blank" rel="noreferrer">{user.website}</a></p>
          <p><b>Member Since:</b> {user.joinDate}</p>
        </div>
      </div>

      {/* Account Settings */}
      <div className={styles.detailsCard}>
        <h3 className={styles.sectionTitle}>Account Settings</h3>
        <div className={styles.btnGroup}>
          <button className={styles.editBtn}>Edit Profile</button>
          <button className={styles.logoutBtn}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default SupplierProfile;

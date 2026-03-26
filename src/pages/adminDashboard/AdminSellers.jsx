import React from "react";
import styles from "./AdminPages.module.css";
import AdminSellerVerification from '../../components/adminDeshbord/AdminSellerVerification/AdminSellerVerification.jsx';

const AdminSellers = () => {
    return (
        <div className={styles.AdminContainer}>
            <AdminSellerVerification />
        </div>
    );
};

export default AdminSellers;

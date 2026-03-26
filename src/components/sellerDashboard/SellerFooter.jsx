import React from "react";
import styles from "./SellerFooter.module.css";

const SellerFooter = () => {
    return (
        <footer className={styles.footer}>
            <p>© {new Date().getFullYear()} Mojija Seller Dashboard — All Rights Reserved</p>
        </footer>
    );
};

export default SellerFooter;

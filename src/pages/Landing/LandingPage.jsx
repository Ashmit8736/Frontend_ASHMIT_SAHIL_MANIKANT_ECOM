import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LandingPage.module.css";

import Logo from "../../assets/Logo.png";

// 🔥 Icons
import { FaUser, FaStore, FaTruck } from "react-icons/fa";
import { IoStorefrontSharp } from "react-icons/io5";

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>

            <div className={styles.card}>

                {/* <img src={Logo} alt="logo" className={styles.logoImg} /> */}
                <div className={styles.brandLogo}>
                    <span className={styles.brandMain}>Moji</span>
                    <span className={styles.brandAs}>ja </span>
                    <span className={styles.brandDot}>E Commerce </span>
                </div>

                <h1 className={styles.mainHeading}>Welcome To Mojija</h1>
                <p className={styles.subtitle}>Choose how you want to continue</p>

                {/* Login Buttons */}
                <div className={styles.buttons}>

                    {/* Buyer Login */}
                    <button className={styles.button} onClick={() => navigate("/auth/login")}>
                        <FaUser className={styles.icon} /> Buyer
                    </button>

                    {/* Seller Login */}
                    <button className={styles.button} onClick={() => navigate("/seller/login")}>
                        <FaStore className={styles.icon} /> Seller
                    </button>

                    {/* Supplier Login */}
                    <button className={styles.button} onClick={() => navigate("/supplier/login")}>
                        <FaTruck className={styles.icon} /> Supplier
                    </button>

                </div>

                {/* Create Account */}
                <div className={styles.createWrap}>
                    <p>Create Business Account</p>

                    <div className={styles.createButtonsRow}>

                        {/* Seller Signup */}
                        <button className={styles.createBtn} onClick={() => navigate("/seller/auth/register")}>
                            <IoStorefrontSharp className={styles.iconSmall} /> Become a Seller
                        </button>

                        {/* Supplier Signup */}
                        <button className={styles.createBtn} onClick={() => navigate("/supplier/signup")}>
                            <FaTruck className={styles.iconSmall} /> Become a Supplier
                        </button>

                    </div>
                </div>

            </div>

        </div>
    );
};

export default LandingPage;

import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AccountPending.module.css";
import { MdOutlineHourglassTop } from "react-icons/md";

const SellerAccountPending = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <MdOutlineHourglassTop className={styles.icon} />

                <h2>Seller Account Under Review</h2>

                <p>
                    Your <b>seller account</b> has been created successfully and is
                    currently under <b>admin review</b>.
                </p>

                <p>
                    Our verification team is reviewing your business details including
                    GST, bank and warehouse information.
                </p>

                <p className={styles.note}>
                    This process usually takes <b>24–48 hours</b>.
                </p>

                <p className={styles.subNote}>
                    Once approved, you can log in and start selling on the platform.
                </p>

                <div className={styles.actions}>
                    <button onClick={() => navigate("/")}>Go to Homepage</button>
                    <button
                        className={styles.secondary}
                        onClick={() => navigate("/seller/auth/login")}
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SellerAccountPending;

import { useNavigate } from "react-router-dom";
import styles from "./SupplierAccountApproved.module.css";

export default function SupplierAccountApproved() {
    const navigate = useNavigate();

    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <div className={styles.icon}>✅</div>

                <h1 className={styles.title}>Account Approved</h1>

                <p className={styles.message}>
                    Congratulations! 🎉 Your supplier account has been
                    <strong> approved</strong> by our admin team.
                </p>

                <p className={styles.message}>
                    You can now log in and start selling your products on our platform.
                </p>

                <div className={styles.infoBox}>
                    Welcome onboard! Let’s grow your business together 🚀
                </div>

                {/* 👇 LOGIN NAVIGATION */}
                <button
                    className={styles.loginBtn}
                    onClick={() => navigate("/supplier/login")}
                >
                    Go to Login
                </button>
            </div>
        </div>
    );
}

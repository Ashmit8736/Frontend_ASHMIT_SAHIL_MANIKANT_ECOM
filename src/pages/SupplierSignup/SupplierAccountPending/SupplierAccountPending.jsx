import { useNavigate } from "react-router-dom";
import styles from "./SupplierAccountPending.module.css";

const SupplierAccountPending = ({ status = "pending" }) => {
    const navigate = useNavigate();

    const isRejected = status === "rejected";

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1>
                    {isRejected ? "Account Rejected ❌" : "Account Under Review ⏳"}
                </h1>

                <p className={styles.message}>
                    {isRejected
                        ? "Your supplier account has been rejected by the admin. Please contact support for more details."
                        : "Your supplier account is pending admin approval. Once approved, you will be able to login and access your dashboard."}
                </p>

                <div className={styles.actions}>
                    <button onClick={() => navigate("/supplier/login")}>
                        Back to Login
                    </button>

                    {!isRejected && (
                        <button
                            className={styles.secondary}
                            onClick={() => window.location.reload()}
                        >
                            Refresh Status
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SupplierAccountPending;

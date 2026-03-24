import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./AccountPending.module.css";

const AccountPending = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const status = state?.status || "pending";
  const message = state?.message;

  const isRejected = status === "rejected";

  return (
    <div className={styles.container}>
      <div className={styles.card}>

        <div className={styles.icon}>
          {isRejected ? "❌" : "⏳"}
        </div>

        <h2>
          {isRejected ? "Account Rejected" : "Account Created Successfully"}
        </h2>

        <p className={styles.text}>
          {message ||
            (isRejected
              ? "Your account was rejected by our team."
              : "Your account has been created successfully.")}
        </p>

        {!isRejected && (
          <p className={styles.text}>
            Our team is reviewing your details.
            <br />
            Your account will be approved within <b>24 hours</b>.
          </p>
        )}

        <button
          className={styles.button}
          onClick={() => navigate("/")}
        >
          Go to Login
        </button>

      </div>
    </div>
  );
};

export default AccountPending;

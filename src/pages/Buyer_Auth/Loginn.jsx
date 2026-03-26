import styles from './Loginn.module.css'
import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'

const BASE_URL = "https://unilingual-ji-unlikely.ngrok-free.dev";

const Loginn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone || "";
  const [otp, setOtp] = useState("");

  const verifyLoginOtp = async () => {
    if (!otp) return alert("Enter OTP!");

    try {
      // STEP 1️⃣ VERIFY OTP
      const verifyRes = await axios.post(
        `${BASE_URL}/api/auth/verify-otp`,
        { phone, otp },
        { withCredentials: true }
      );

      if (!verifyRes.data?.otpVerified) {
        return alert("OTP verification failed");
      }

      // STEP 2️⃣ LOGIN WITH OTP
      const loginRes = await axios.post(
        `${BASE_URL}/api/auth/login-with-otp`,
        { phone },
        { withCredentials: true }
      );

      // ✅ LOGIN SUCCESS
      localStorage.setItem("buyerLoggedIn", "true");
      navigate("/app", { replace: true });

    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;

      // ⏳ Pending / ❌ Rejected
      if (status === 403 && data?.type === "account") {
        navigate("/auth/account-pending", {
          state: {
            status: data.status,
            message: data.message,
          },
        });
      } else {
        alert(data?.message || "Invalid or expired OTP!");
      }
    }
  };


  return (
    <div className={styles.mainLoginContainer}>
      <div className={styles.bgImage}></div>

      <div className={styles.LoginContainer}>
        <h1>Login with OTP</h1>

        <form
          className={styles.formGroup}
          onSubmit={(e) => {
            e.preventDefault();
            verifyLoginOtp();
          }}
        >
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button type="submit">Verify OTP</button>
        </form>

        <p className={styles.helperText}>
          OTP sent to <b>{phone}</b>.
          <br />
          Didn’t receive?
          <button type="button" onClick={() => navigate(-1)} className={styles.linkBtn}>
            Resend OTP
          </button>
        </p>
      </div>
    </div>
  );
};

export default Loginn;

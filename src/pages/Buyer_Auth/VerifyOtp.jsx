import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./VerifyOtp.module.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;



const OTP_TIME = 60; // seconds

const VerifyOtp = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const phone = location.state?.phone || "";
    const from = location.state?.from || "signup"; // signup | login-otp | forgot

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(OTP_TIME);
    const [resending, setResending] = useState(false);

    /* ======================
       OTP TIMER
    ====================== */
    useEffect(() => {
        if (timer === 0) return;

        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    /* ======================
       VERIFY OTP
    ====================== */
    const handleVerify = async () => {
        if (!otp) return alert("⚠️ Enter OTP");

        try {
            setLoading(true);

            if (from === "signup") {
                await axios.post(`${BASE_URL}/auth/verify-signup-otp`, { phone, otp });


                navigate("/auth/register", { state: { phone } });
                return;
            }

            if (from === "forgot") {
                await axios.post(
                    `${BASE_URL}/auth/verify-forgot-otp`,
                    { phone, otp }
                );

                navigate("/auth/forget", { state: { phone } });
                return;
            }

            alert("Invalid OTP flow");

        } catch (err) {
            alert(err.response?.data?.message || "Invalid or expired OTP");
        } finally {
            setLoading(false);
        }
    };

    /* ======================
       RESEND OTP
    ====================== */
    const handleResendOtp = async () => {
        if (timer > 0) return;

        try {
            setResending(true);

            if (from === "signup") {
                await axios.post(`${BASE_URL}/auth/send-signup-otp`, { phone });
            }

            if (from === "forgot") {
                await axios.post(`${BASE_URL}/auth/send-forgot-otp`, { phone });
            }

            alert("✅ OTP resent successfully");
            setTimer(OTP_TIME);
            setOtp("");

        } catch (err) {
            alert(err.response?.data?.message || "Failed to resend OTP");
        } finally {
            setResending(false);
        }
    };

    return (
        <div className={styles.mainSignInContainer}>
            <div className={styles.bgImage}></div>

            <div className={styles.verifyContainer}>
                <h1>Verify OTP</h1>

                <p>
                    OTP sent to <b>+91 {phone}</b>
                </p>

                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    maxLength={6}
                    inputMode="numeric"
                    onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, ""))
                    }
                />

                <button onClick={handleVerify} disabled={loading}>
                    {loading ? "Verifying..." : "Verify OTP"}
                </button>

                {/* 🔥 TIMER + RESEND */}
                <p className={styles.helperText}>
                    {timer > 0 ? (
                        <>Resend OTP in <b>{timer}s</b></>
                    ) : (
                        <button
                            type="button"
                            disabled={resending}
                            onClick={handleResendOtp}
                            className={styles.resendBtn}
                        >
                            {resending ? "Resending..." : "Resend OTP"}
                        </button>
                    )}
                </p>
            </div>
        </div>
    );
};

export default VerifyOtp;

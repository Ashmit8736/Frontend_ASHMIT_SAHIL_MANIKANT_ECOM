import { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import style from "./SupplierVerifyOtp.module.css";

const SupplierVerifyOtp = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const phone = state?.phone;

    const inputRefs = useRef([]);

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [timer, setTimer] = useState(60); // ⏱ 60 sec expiry
    const [resendCooldown, setResendCooldown] = useState(60);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    /* ================= SAFETY ================= */
    useEffect(() => {
        if (!phone) {
            toast.error("Invalid session. Please retry forgot password.");
            navigate("/supplier/forgot-password");
        }
    }, [phone, navigate]);

    /* ================= OTP TIMER ================= */
    useEffect(() => {
        if (timer <= 0) return;
        const t = setInterval(() => setTimer((p) => p - 1), 1000);
        return () => clearInterval(t);
    }, [timer]);

    /* ================= RESEND COOLDOWN ================= */
    useEffect(() => {
        if (resendCooldown <= 0) return;
        const t = setInterval(() => setResendCooldown((p) => p - 1), 1000);
        return () => clearInterval(t);
    }, [resendCooldown]);

    /* ================= INPUT CHANGE ================= */
    const handleChange = (e, index) => {
        const value = e.target.value.replace(/\D/g, "");
        if (value.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError("");

        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }

        const otpValue = newOtp.join("");
        if (otpValue.length === 6) {
            verifyOtp(otpValue);
        }
    };

    /* ================= BACKSPACE ================= */
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    /* ================= VERIFY OTP ================= */
    const verifyOtp = async (otpValue) => {
        if (timer <= 0) {
            setError("OTP expired. Please resend OTP.");
            return;
        }

        try {
            setLoading(true);

            await axios.post(
                "http://localhost:3000/api/auth/supplier/forgot-password/verify-otp",
                { phone, otp: otpValue }
            );

            toast.success("OTP verified successfully");
            navigate("/supplier/reset-password", {
                state: { phone },
                replace: true,
            });

        } catch (err) {
            setError(err.response?.data?.message || "Invalid OTP");
            setOtp(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    /* ================= RESEND OTP ================= */
    const handleResendOtp = async () => {
        if (resendCooldown > 0) return;

        try {
            await axios.post(
                "http://localhost:3000/api/auth/supplier/forgot-password/send-otp",
                { phone }
            );

            toast.success("OTP resent successfully");
            setOtp(["", "", "", "", "", ""]);
            setTimer(60);
            setResendCooldown(60);
            inputRefs.current[0]?.focus();

        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to resend OTP");
        }
    };

    /* ================= FORMAT TIMER ================= */
    const formatTime = (sec) => `0:${sec.toString().padStart(2, "0")}`;

    return (
        <div className={style.container}>
            <div className={style.bgImage}></div>

            <div className={style.card}>
                <h1>Verify OTP</h1>
                <p className={style.subtitle}>
                    Enter the 6-digit OTP sent to +91 {phone}
                </p>

                <div className={style.otpGroup}>
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            disabled={loading}
                            className={`${style.otpInput} ${error ? style.inputError : ""}`}
                        />
                    ))}
                </div>

                {/* ERROR / TIMER */}
                {error ? (
                    <span className={style.errorText}>{error}</span>
                ) : (
                    <span className={style.helperText}>
                        OTP expires in <b>{formatTime(timer)}</b>
                    </span>
                )}

                {/* RESEND */}
                <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendCooldown > 0}
                    className={style.resendBtn}
                >
                    {resendCooldown > 0
                        ? `Resend OTP in ${resendCooldown}s`
                        : "Resend OTP"}
                </button>
            </div>
        </div>
    );
};

export default SupplierVerifyOtp;

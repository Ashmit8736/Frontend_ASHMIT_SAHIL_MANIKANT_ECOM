// import React, { useState } from "react";
// import styles from "./Forget.module.css";
// import { useNavigate, useLocation } from "react-router-dom";
// // import axios from "axios";
// import api from "../../store/APi/axiosInstance.jsx";


// // const BASE_URL = "https://unilingual-ji-unlikely.ngrok-free.dev/api";

// const Forget = () => {
//     const navigate = useNavigate();
//     const location = useLocation();

//     const [step, setStep] = useState(1); // 1: phone, 2: otp, 3: reset
//     const [phone, setPhone] = useState(location.state?.phone || "");
//     const [otp, setOtp] = useState("");
//     const [newPassword, setNewPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");
//     const [showNewPassword, setShowNewPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//     const cleanPhone = phone.replace(/\D/g, "").slice(-10);
//     const isStrongPassword = (password) => {
//         return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);
//     };

//     /* ======================
//        STEP 1: SEND OTP
//     ====================== */
//     const handleSendOtp = async () => {
//         if (!cleanPhone || cleanPhone.length !== 10) {
//             return alert("📱 Enter valid phone number");
//         }

//         try {
//             await api.post("/auth/send-forgot-otp", {
//                 phone: cleanPhone,
//             });


//             alert("✅ OTP sent successfully");
//             setStep(2);
//         } catch (err) {
//             alert(err.response?.data?.message || "Failed to send OTP");
//         }
//     };

//     /* ======================
//        STEP 3: RESET PASSWORD
//        (OTP verify happens here)
//     ====================== */
//     const handleResetPassword = async () => {
//         if (!otp) return alert("⚠️ Enter OTP");
//         if (!newPassword || !confirmPassword)
//             return alert("⚠️ Fill all fields");

//         if (newPassword !== confirmPassword) {
//             return alert("❌ Passwords do not match");
//         }

//         if (!isStrongPassword(newPassword)) {
//             return alert(
//                 "Password must be at least 8 characters and include uppercase, lowercase, number & special character"
//             );
//         }
//         try {
//             await api.post("/auth/reset-password", {
//                 phone: cleanPhone,
//                 otp,
//                 newPassword,
//             });

//             alert("🎉 Password reset successful!");
//             navigate("/auth/login");
//         } catch (err) {
//             alert(err.response?.data?.message || "Failed to reset password");
//         }
//     };

//     return (
//         <div className={styles.mainLoginContainer}>
//             <div className={styles.bgImage}></div>

//             <div className={styles.LoginContainer}>
//                 {step === 1 && (
//                     <>
//                         <h1>Forgot Password</h1>
//                         <form className={styles.formGroup}>
//                             <input
//                                 type="text"
//                                 placeholder="Phone number"
//                                 value={phone}
//                                 maxLength={10}
//                                 inputMode="numeric"
//                                 onChange={(e) =>
//                                     setPhone(e.target.value.replace(/\D/g, ""))
//                                 }
//                             />
//                             <button
//                                 onClick={(e) => {
//                                     e.preventDefault();
//                                     handleSendOtp();
//                                 }}
//                             >
//                                 Send OTP
//                             </button>
//                         </form>
//                     </>
//                 )}

//                 {step === 2 && (
//                     <>
//                         <h1>Enter OTP</h1>
//                         <form className={styles.formGroup}>
//                             <input
//                                 type="text"
//                                 placeholder="Enter OTP"
//                                 value={otp}
//                                 maxLength={6}
//                                 inputMode="numeric"
//                                 onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
//                             />
//                             <button
//                                 onClick={(e) => {
//                                     e.preventDefault();
//                                     setStep(3); // 🔥 no verify API
//                                 }}
//                             >
//                                 Continue
//                             </button>
//                         </form>
//                     </>
//                 )}

//                 {step === 3 && (
//                     <>
//                         <h1>Reset Password</h1>

//                         <form className={styles.formGroup}>

//                             {/* NEW PASSWORD */}
//                             <div className={styles.passwordWrap}>
//                                 <input
//                                     type={showNewPassword ? "text" : "password"}
//                                     placeholder="New password"
//                                     value={newPassword}
//                                     onChange={(e) => setNewPassword(e.target.value)}
//                                 />
//                                 <span
//                                     className={styles.eyeIcon}
//                                     onClick={() => setShowNewPassword(!showNewPassword)}
//                                 >
//                                     {showNewPassword ? "🙈" : "👁️"}
//                                 </span>
//                             </div>

//                             {/* CONFIRM PASSWORD */}
//                             <div className={styles.passwordWrap}>
//                                 <input
//                                     type={showConfirmPassword ? "text" : "password"}
//                                     placeholder="Confirm password"
//                                     value={confirmPassword}
//                                     onChange={(e) => setConfirmPassword(e.target.value)}
//                                 />
//                                 <span
//                                     className={styles.eyeIcon}
//                                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                                 >
//                                     {showConfirmPassword ? "🔒" : "🔒"}
//                                 </span>
//                             </div>

//                             <button
//                                 onClick={(e) => {
//                                     e.preventDefault();
//                                     handleResetPassword();
//                                 }}
//                             >
//                                 Reset Password
//                             </button>
//                         </form>

//                         <p style={{ fontSize: "0.8rem", color: "#777", marginTop: "0.5rem" }}>
//                             Password must be at least 8 characters and include:
//                             <br />• Uppercase letter
//                             <br />• Lowercase letter
//                             <br />• Number
//                             <br />• Special character
//                         </p>
//                     </>
//                 )}

//                 <p className={styles.helperText}>
//                     <button
//                         className={styles.linkBtn}
//                         onClick={() => navigate("/auth/login")}
//                     >
//                         ← Back to Login
//                     </button>
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default Forget;


import React, { useEffect, useState } from "react";
import styles from "./Forget.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../store/APi/axiosInstance.jsx";

const OTP_TIME = 60; // seconds

const Forget = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [step, setStep] = useState(1);
    const [phone, setPhone] = useState(location.state?.phone || "");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [timer, setTimer] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const cleanPhone = phone.replace(/\D/g, "").slice(-10);

    const isStrongPassword = (password) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);

    /* ======================
       OTP TIMER
    ====================== */
    useEffect(() => {
        if (timer <= 0) return;
        const interval = setInterval(() => {
            setTimer((t) => t - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

    /* ======================
       SEND OTP
    ====================== */
    const handleSendOtp = async () => {
        if (cleanPhone.length !== 10) {
            return setError("Enter valid phone number");
        }

        try {
            setError("");
            setLoading(true);

            await api.post("/auth/send-forgot-otp", { phone: cleanPhone });

            setTimer(OTP_TIME);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    /* ======================
       RESET PASSWORD
    ====================== */
    const handleResetPassword = async () => {
        setError("");

        if (!otp || !newPassword || !confirmPassword) {
            return setError("All fields are required");
        }

        if (newPassword !== confirmPassword) {
            return setError("Passwords do not match");
        }

        if (!isStrongPassword(newPassword)) {
            return setError(
                "Password must be 8+ chars with uppercase, lowercase, number & special character"
            );
        }

        try {
            setLoading(true);

            await api.post("/auth/reset-password", {
                phone: cleanPhone,
                otp,
                newPassword,
            });

            alert("🎉 Password reset successful!");
            navigate("/auth/login");
        } catch (err) {
            // 🔥 SAME PASSWORD / OTP / BACKEND MESSAGE
            setError(err.response?.data?.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.mainLoginContainer}>
            <div className={styles.bgImage}></div>

            <div className={styles.LoginContainer}>
                <h1>
                    {step === 1 && "Forgot Password"}
                    {step === 2 && "Enter OTP"}
                    {step === 3 && "Reset Password"}
                </h1>

                {error && (
                    <p style={{ color: "red", fontSize: "0.85rem", marginBottom: "10px" }}>
                        {error}
                    </p>
                )}

                {/* STEP 1 */}
                {step === 1 && (
                    <form className={styles.formGroup}>
                        <input
                            type="text"
                            placeholder="Phone number"
                            value={phone}
                            maxLength={10}
                            inputMode="numeric"
                            onChange={(e) =>
                                setPhone(e.target.value.replace(/\D/g, ""))
                            }
                        />
                        <button disabled={loading} onClick={(e) => {
                            e.preventDefault();
                            handleSendOtp();
                        }}>
                            {loading ? "Sending..." : "Send OTP"}
                        </button>
                    </form>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <form className={styles.formGroup}>
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            maxLength={6}
                            inputMode="numeric"
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        />

                        <button onClick={(e) => {
                            e.preventDefault();
                            setStep(3);
                        }}>
                            Continue
                        </button>

                        <button
                            type="button"
                            disabled={timer > 0}
                            onClick={handleSendOtp}
                            style={{ background: timer > 0 ? "#999" : "black" }}
                        >
                            {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
                        </button>
                    </form>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                    <form className={styles.formGroup}>
                        <div className={styles.passwordWrap}>
                            <input
                                type={showNewPassword ? "text" : "password"}
                                placeholder="New password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <span
                                className={styles.eyeIcon}
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                👁️
                            </span>
                        </div>

                        <div className={styles.passwordWrap}>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <span
                                className={styles.eyeIcon}
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                            >
                                👁️
                            </span>
                        </div>

                        <button disabled={loading} onClick={(e) => {
                            e.preventDefault();
                            handleResetPassword();
                        }}>
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>

                        <p style={{ fontSize: "0.75rem", color: "#777" }}>
                            Password must contain uppercase, lowercase, number & special character
                        </p>
                    </form>
                )}

                <button
                    className={styles.linkBtn}
                    onClick={() => navigate("/auth/login")}
                >
                    ← Back to Login
                </button>
            </div>
        </div>
    );
};

export default Forget;

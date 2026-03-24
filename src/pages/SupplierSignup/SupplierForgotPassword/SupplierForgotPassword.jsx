// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import style from "./SupplierForgotPassword.module.css";

// const SupplierForgotPassword = () => {
//     const navigate = useNavigate();

//     const [phone, setPhone] = useState("");
//     const [phoneError, setPhoneError] = useState("");
//     const [loading, setLoading] = useState(false);

//     /* ================= PHONE CHANGE ================= */
//     const handlePhoneChange = (e) => {
//         const value = e.target.value.replace(/\D/g, "").slice(-10);
//         setPhone(value);

//         if (!value) {
//             setPhoneError("Phone number is required");
//         } else if (value.length !== 10) {
//             setPhoneError("Enter valid 10 digit phone number");
//         } else {
//             setPhoneError("");
//         }
//     };

//     /* ================= SEND OTP ================= */
//     const handleSendOtp = async (e) => {
//         e.preventDefault();

//         if (phone.length !== 10) {
//             toast.error("Enter valid registered phone number");
//             return;
//         }

//         try {
//             setLoading(true);

//             const res = await axios.post(
//                 "http://localhost:3000/api/auth/supplier/forgot-password/send-otp",
//                 { phone }
//             );

//             toast.success(res.data?.message || "OTP sent successfully");

//             navigate("/supplier/verify-forgot-otp", {
//                 state: { phone },
//                 replace: true,
//             });

//         } catch (err) {

//             const msg = err.response?.data?.message;

//             // 🔴 BACKEND STATUS HANDLING
//             if (msg?.includes("not approved")) {
//                 toast.info("Your account is not approved yet");
//                 return;
//             }

//             if (msg?.includes("rejected")) {
//                 toast.error("Your account has been rejected by admin");
//                 return;
//             }

//             toast.error(msg || "Failed to send OTP");

//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className={style.container}>
//             {/* Background */}
//             <div className={style.bgImage}></div>

//             {/* Card */}
//             <div className={style.card}>
//                 <h1>Forgot Password</h1>
//                 <p className={style.subtitle}>
//                     Enter your registered phone number to receive OTP
//                 </p>

//                 <form onSubmit={handleSendOtp}>
//                     <input
//                         type="text"
//                         className={`${style.input} ${phoneError ? style.inputError : ""
//                             }`}
//                         placeholder="Enter registered phone number"
//                         value={phone}
//                         maxLength={10}
//                         onChange={handlePhoneChange}
//                     />

//                     {/* 🔴 / 🟢 VALIDATION MESSAGE */}
//                     {phoneError ? (
//                         <span className={style.errorText}>{phoneError}</span>
//                     ) : phone.length === 10 ? (
//                         <span className={style.successText}>
//                             Phone number looks good ✔
//                         </span>
//                     ) : (
//                         <span className={style.helperText}>
//                             Enter 10 digit registered mobile number
//                         </span>
//                     )}

//                     <button
//                         type="submit"
//                         className={style.button}
//                         disabled={loading || phone.length !== 10}
//                     >
//                         {loading ? "Sending OTP..." : "Send OTP"}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default SupplierForgotPassword;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import style from "./SupplierForgotPassword.module.css";

const SupplierForgotPassword = () => {
    const navigate = useNavigate();

    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);

    const [phoneError, setPhoneError] = useState("");
    const [loading, setLoading] = useState(false);

    /* ================= PHONE CHANGE ================= */
    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, "").slice(-10);
        setPhone(value);

        if (!value) setPhoneError("Phone number is required");
        else if (value.length !== 10) setPhoneError("Enter valid 10 digit phone number");
        else setPhoneError("");
    };

    /* ================= SEND OTP ================= */
    const handleSendOtp = async (e) => {
        e.preventDefault();

        if (phone.length !== 10) {
            toast.error("Enter valid registered phone number");
            return;
        }

        try {
            setLoading(true);

            const res = await axios.post(
                "http://localhost:3000/api/auth/supplier/forgot-password/send-otp",
                { phone }
            );

            toast.success(res.data?.message || "OTP sent successfully");
            setOtpSent(true);

        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    /* ================= VERIFY OTP ================= */
    const handleVerifyOtp = async (e) => {
        e.preventDefault();

        if (!otp || otp.length !== 6) {
            toast.error("Enter valid 6 digit OTP");
            return;
        }

        try {
            setLoading(true);

            await axios.post(
                "http://localhost:3000/api/auth/supplier/forgot-password/verify-otp",
                { phone, otp }
            );

            toast.success("OTP verified successfully");

            // 👉 RESET PASSWORD PAGE
            navigate("/supplier/reset-password", {
                state: { phone, otp },
                replace: true,
            });

        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={style.container}>
            <div className={style.bgImage}></div>

            <div className={style.card}>
                <h1>Forgot Password</h1>
                <p className={style.subtitle}>
                    Enter your registered phone number
                </p>

                {/* PHONE FORM */}
                {!otpSent && (
                    <form onSubmit={handleSendOtp}>
                        <input
                            type="text"
                            className={`${style.input} ${phoneError ? style.inputError : ""}`}
                            placeholder="Enter registered phone number"
                            value={phone}
                            maxLength={10}
                            onChange={handlePhoneChange}
                        />

                        {phoneError ? (
                            <span className={style.errorText}>{phoneError}</span>
                        ) : (
                            <span className={style.helperText}>
                                OTP will be sent to this number
                            </span>
                        )}

                        <button
                            type="submit"
                            className={style.button}
                            disabled={loading}
                        >
                            {loading ? "Sending OTP..." : "Send OTP"}
                        </button>
                    </form>
                )}

                {/* OTP FORM */}
                {otpSent && (
                    <form onSubmit={handleVerifyOtp}>
                        <input
                            type="text"
                            className={style.input}
                            placeholder="Enter 6 digit OTP"
                            value={otp}
                            maxLength={6}
                            onChange={(e) =>
                                setOtp(e.target.value.replace(/\D/g, ""))
                            }
                        />

                        <span className={style.helperText}>
                            Enter OTP sent on your phone
                        </span>

                        <button
                            type="submit"
                            className={style.button}
                            disabled={loading}
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default SupplierForgotPassword;

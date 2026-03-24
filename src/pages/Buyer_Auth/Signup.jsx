// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import styles from "./Signup.module.css";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const OTP_TIMER = 60; // seconds

// const Signup = () => {
//     const navigate = useNavigate();

//     const [phone, setPhone] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");
//     const [timer, setTimer] = useState(0);
//     const [otpSent, setOtpSent] = useState(false);

//     // 📱 normalize phone
//     const cleanPhone = phone.replace(/\D/g, "").slice(-10);

//     /* ======================
//        OTP TIMER
//     ====================== */
//     useEffect(() => {
//         if (timer === 0) return;

//         const interval = setInterval(() => {
//             setTimer((prev) => prev - 1);
//         }, 1000);

//         return () => clearInterval(interval);
//     }, [timer]);

//     /* ======================
//        SEND OTP
//     ====================== */
//     const sendOtp = async () => {
//         setError("");

//         if (!cleanPhone || cleanPhone.length !== 10) {
//             return setError("Enter valid 10-digit mobile number");
//         }

//         try {
//             setLoading(true);

//             await axios.post(`${BASE_URL}/auth/send-signup-otp`, {
//                 phone: cleanPhone,
//             });

//             setOtpSent(true);
//             setTimer(OTP_TIMER);

//             navigate("/auth/verify-otp", {
//                 state: {
//                     phone: cleanPhone,
//                     from: "signup",
//                 },
//             });
//         } catch (err) {
//             const status = err.response?.status;
//             const message = err.response?.data?.message;

//             if (status === 409) {
//                 // 🔥 OTP SE PEHLE HI BLOCK
//                 setError(message || "This number is already registered. Please login.");
//                 return;
//             }

//             setError(message || "Failed to send OTP. Try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className={styles.mainSignupContainer}>
//             <div className={styles.bgImage}></div>

//             <div className={styles.card}>
//                 <h1>Create Account</h1>

//                 {error && <p className={styles.errorText}>{error}</p>}

//                 {/* PHONE INPUT */}
//                 <input
//                     type="text"
//                     placeholder="Phone number"
//                     value={phone}
//                     maxLength={10}
//                     inputMode="numeric"
//                     pattern="[0-9]*"
//                     onChange={(e) =>
//                         setPhone(e.target.value.replace(/\D/g, ""))
//                     }
//                 />

//                 {/* SEND / RESEND OTP */}
//                 <button
//                     onClick={sendOtp}
//                     disabled={loading || timer > 0}
//                 >
//                     {loading
//                         ? "Sending OTP..."
//                         : timer > 0
//                             ? `Resend OTP in ${timer}s`
//                             : otpSent
//                                 ? "Resend OTP"
//                                 : "Send OTP"}
//                 </button>

//                 <p
//                     className={styles.link}
//                     onClick={() => navigate("/auth/login")}
//                 >
//                     ← Back to Login
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default Signup;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Signup.module.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const OTP_TIMER = 60;

const Signup = () => {
    const navigate = useNavigate();
    const isValidIndianPhone = (phone) => /^[6-9]\d{9}$/.test(phone);


    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [timer, setTimer] = useState(0);
    const [otpSent, setOtpSent] = useState(false);

    const cleanPhone = phone.replace(/\D/g, "").slice(-10);

    useEffect(() => {
        if (timer === 0) return;
        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const sendOtp = async () => {
        setError("");

        if (!isValidIndianPhone(cleanPhone)) {
            return setError("Mobile number must start with 6, 7, 8 or 9");
        }

        try {
            setLoading(true);

            await axios.post(`${BASE_URL}/auth/send-signup-otp`, {
                phone: cleanPhone,
            });

            setOtpSent(true);
            setTimer(OTP_TIMER);

            navigate("/auth/verify-otp", {
                state: { phone: cleanPhone, from: "signup" },
            });
        } catch (err) {
            const status = err.response?.status;
            const message = err.response?.data?.message;

            if (status === 409) {
                setError(message || "This number is already registered. Please login.");
                return;
            }

            setError(message || "Failed to send OTP. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.mainSignupContainer}>
            <div className={styles.bgImage}></div>

            <div className={styles.card}>
                <h1>Create Account</h1>

                {error && <p className={styles.errorText}>{error}</p>}

                {/* ✅ FORM ADDED */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        sendOtp();
                    }}
                >
                    <input
                        type="text"
                        placeholder="Phone number"
                        value={phone}
                        maxLength={10}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        onChange={(e) =>
                            setPhone(e.target.value.replace(/\D/g, ""))
                        }
                    />

                    <button type="submit" disabled={loading || timer > 0}>
                        {loading
                            ? "Sending OTP..."
                            : timer > 0
                                ? `Resend OTP in ${timer}s`
                                : otpSent
                                    ? "Resend OTP"
                                    : "Send OTP"}
                    </button>
                </form>

                <p
                    className={styles.link}
                    onClick={() => navigate("/auth/login")}
                >
                    ← Back to Login
                </p>
            </div>
        </div>
    );
};

export default Signup;

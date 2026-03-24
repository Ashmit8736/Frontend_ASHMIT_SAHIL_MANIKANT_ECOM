import { useState } from "react";
import axios from "axios";
import styles from "./Step1_CreateAccount.module.css";
import { Eye, EyeOff } from "lucide-react";

export default function Step1_CreateAccount({ next, updateData, formData }) {
  const [fullname, setFullname] = useState(formData.fullname || "");
  const [email, setEmail] = useState(formData.email || "");
  const [phone, setPhone] = useState(formData.phone || "");

  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpVerified, setEmailOtpVerified] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");

  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtpVerified, setPhoneOtpVerified] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 🔥 NEW
  const [errors, setErrors] = useState({});

  const isValidIndianPhone = (v) => /^[6-9]\d{9}$/.test(v);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  const onEnter = (e, cb) => {
    if (e.key === "Enter") {
      e.preventDefault();
      cb();
    }
  };

  /* ================= EMAIL OTP ================= */
  const sendEmailOtp = async () => {
    if (!emailRegex.test(email)) {
      setErrors((p) => ({ ...p, email: "Enter valid email address" }));
      return;
    }
    await axios.post(
      "http://localhost:3000/api/auth/supplier/register-send-email-otp",
      { email: email.trim() }
    );
    setEmailOtpSent(true);
  };

  const verifyEmailOtp = async () => {
    const res = await axios.post(
      "http://localhost:3000/api/auth/supplier/register-verify-email-otp",
      { email: email.trim(), otp: emailOtp.trim() }
    );
    if (res.data?.verifyEmail) setEmailOtpVerified(true);
  };

  /* ================= PHONE OTP ================= */
  const sendPhoneOtp = async () => {
    if (!isValidIndianPhone(phone)) {
      setErrors((p) => ({ ...p, phone: "Enter valid 10 digit mobile number" }));
      return;
    }
    await axios.post(
      "http://localhost:3000/api/auth/supplier/register-send-otp",
      { phone }
    );
    setPhoneOtpSent(true);
  };

  const verifyPhoneOtp = async () => {
    const res = await axios.post(
      "http://localhost:3000/api/auth/supplier/register-verify-otp",
      { phone, otp: phoneOtp.trim() }
    );
    if (res.data?.verifyPhone) setPhoneOtpVerified(true);
  };

  const isFormValid =
    fullname.trim().length >= 2 &&
    emailRegex.test(email) &&
    emailOtpVerified &&
    isValidIndianPhone(phone) &&
    phoneOtpVerified &&
    passwordRegex.test(password) &&
    password === confirmPassword;

  const handleSubmit = () => {
    if (!isFormValid) return;
    updateData({ fullname, email, phone, password });
    next();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Create Account</h2>

      {/* FULL NAME */}
      <div className={styles["input-box"]}>
        <label>Full Name *</label>
        <input
          value={fullname}
          onChange={(e) => {
            const v = e.target.value.replace(/[^A-Za-z ]/g, "");
            setFullname(v);
            setErrors((p) => ({
              ...p,
              fullname: v.length < 2 ? "Minimum 2 characters required" : "",
            }));
          }}
        />
        {errors.fullname && <p className={styles.error}>{errors.fullname}</p>}
      </div>

      {/* EMAIL */}
      <div className={styles["input-box"]}>
        <label>Email *</label>
        <input
          value={email}
          onChange={(e) => {
            const v = e.target.value;
            setEmail(v);
            setEmailOtpSent(false);
            setEmailOtpVerified(false);
            setEmailOtp("");
            setErrors((p) => ({
              ...p,
              email: emailRegex.test(v) ? "" : "Invalid email format",
            }));
          }}
        />
        {errors.email && <p className={styles.error}>{errors.email}</p>}
        {!emailOtpVerified && (
          <button className={styles.btn} onClick={sendEmailOtp}>
            Send Email OTP
          </button>
        )}
      </div>

      {!emailOtpVerified && emailOtpSent && (
        <div className={styles.otpBox}>
          <input
            placeholder="Enter Email OTP"
            value={emailOtp}
            onChange={(e) => setEmailOtp(e.target.value)}
            onKeyDown={(e) => onEnter(e, verifyEmailOtp)}
          />
          <button className={styles.verifyBtn} onClick={verifyEmailOtp}>
            Verify
          </button>
        </div>
      )}

      {/* PHONE */}
      <div className={styles["input-box"]}>
        <label>Phone *</label>
        <input
          value={phone}
          maxLength={10}
          disabled={!emailOtpVerified}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, "");
            setPhone(v);
            setPhoneOtpSent(false);
            setPhoneOtpVerified(false);
            setPhoneOtp("");
            setErrors((p) => ({
              ...p,
              phone: isValidIndianPhone(v)
                ? ""
                : "Enter valid 10 digit number",
            }));
          }}
        />
        {errors.phone && <p className={styles.error}>{errors.phone}</p>}
        {emailOtpVerified && !phoneOtpVerified && (
          <button className={styles.btn} onClick={sendPhoneOtp}>
            Send Phone OTP
          </button>
        )}
      </div>

      {!phoneOtpVerified && phoneOtpSent && (
        <div className={styles.otpBox}>
          <input
            placeholder="Enter Phone OTP"
            value={phoneOtp}
            onChange={(e) => setPhoneOtp(e.target.value)}
            onKeyDown={(e) => onEnter(e, verifyPhoneOtp)}
          />
          <button className={styles.verifyBtn} onClick={verifyPhoneOtp}>
            Verify
          </button>
        </div>
      )}

      {/* PASSWORD */}
      <div className={styles["input-box"]}>
        <label>Password *</label>

        <div className={styles.passwordWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            disabled={!phoneOtpVerified}
            value={password}
            onChange={(e) => {
              const v = e.target.value;
              setPassword(v);
              setErrors((p) => ({
                ...p,
                password: passwordRegex.test(v)
                  ? ""
                  : "Min 8 chars, 1 uppercase, 1 number",
              }));
            }}
          />
          <span
            className={styles.eyeIcon}
            onClick={() => setShowPassword((p) => !p)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>
        {errors.password && <p className={styles.error}>{errors.password}</p>}

        <div className={styles.passwordWrapper}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            disabled={!phoneOtpVerified}
            value={confirmPassword}
            onChange={(e) => {
              const v = e.target.value;
              setConfirmPassword(v);
              setErrors((p) => ({
                ...p,
                confirmPassword:
                  v === password ? "" : "Passwords do not match",
              }));
            }}
            onKeyDown={(e) => onEnter(e, handleSubmit)}
          />
          <span
            className={styles.eyeIcon}
            onClick={() => setShowConfirmPassword((p) => !p)}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>
        {errors.confirmPassword && (
          <p className={styles.error}>{errors.confirmPassword}</p>
        )}
      </div>

      <button
        type="button"
        className={`${styles.submitBtn} ${!isFormValid ? styles.disabledBtn : ""
          }`}
        disabled={!isFormValid}
        onClick={handleSubmit}
      >
        Continue
      </button>
    </div>
  );
}

// import { useState } from "react";
// import axios from "axios";
// import styles from "./Step1_CreateAccount.module.css";

// export default function Step1_CreateAccount({ next, updateData, formData }) {
//   const [fullname, setFullname] = useState(formData.fullname || "");
//   const [email, setEmail] = useState(formData.email || "");
//   const [phone, setPhone] = useState(formData.phone || "");

//   const [emailOtpSent, setEmailOtpSent] = useState(false);
//   const [emailOtpVerified, setEmailOtpVerified] = useState(false);
//   const [emailOtp, setEmailOtp] = useState("");

//   const [phoneOtpSent, setPhoneOtpSent] = useState(false);
//   const [phoneOtpVerified, setPhoneOtpVerified] = useState(false);
//   const [phoneOtp, setPhoneOtp] = useState("");

//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   /* ================= REGEX ================= */
//   const isValidIndianPhone = (v) => /^[6-9]\d{9}$/.test(v);
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

//   const onEnter = (e, cb) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       cb();
//     }
//   };

//   /* ================= EMAIL OTP ================= */
//   const sendEmailOtp = async () => {
//     if (!emailRegex.test(email)) return alert("Invalid email");

//     try {
//       await axios.post(
//         "http://localhost:3000/api/auth/supplier/register-send-email-otp",
//         { email: email.trim() }
//       );
//       setEmailOtpSent(true);
//       alert("Email OTP Sent");
//     } catch (err) {
//       alert(err.response?.data?.message || "Email OTP failed");
//     }
//   };

//   const verifyEmailOtp = async () => {
//     try {
//       const res = await axios.post(
//         "http://localhost:3000/api/auth/supplier/register-verify-email-otp",
//         { email: email.trim(), otp: emailOtp.trim() }
//       );
//       if (res.data?.verifyEmail) {
//         setEmailOtpVerified(true);
//         alert("Email Verified");
//       }
//     } catch {
//       alert("Invalid Email OTP");
//     }
//   };

//   /* ================= PHONE OTP ================= */
//   const sendPhoneOtp = async () => {
//     const cleanPhone = phone.replace(/\D/g, "");
//     if (!isValidIndianPhone(cleanPhone)) return alert("Invalid phone");

//     try {
//       await axios.post(
//         "http://localhost:3000/api/auth/supplier/register-send-otp",
//         { phone: cleanPhone }
//       );
//       setPhoneOtpSent(true);
//       alert("Phone OTP Sent");
//     } catch (err) {
//       alert(err.response?.data?.message || "Phone OTP failed");
//     }
//   };

//   const verifyPhoneOtp = async () => {
//     try {
//       const res = await axios.post(
//         "http://localhost:3000/api/auth/supplier/register-verify-otp",
//         { phone: phone.trim(), otp: phoneOtp.trim() }
//       );
//       if (res.data?.verifyPhone) {
//         setPhoneOtpVerified(true);
//         alert("Phone Verified");
//       }
//     } catch {
//       alert("Invalid Phone OTP");
//     }
//   };

//   /* ================= CONTINUE ================= */
//   const handleSubmit = () => {
//     if (!emailOtpVerified || !phoneOtpVerified) return;

//     updateData({
//       fullname: fullname.trim(),
//       email: email.trim(),
//       phone: phone.trim(),
//       password,
//     });

//     next();
//   };

//   const isFormValid =
//     fullname.trim().length >= 2 &&
//     emailRegex.test(email) &&
//     isValidIndianPhone(phone) &&
//     passwordRegex.test(password) &&
//     password === confirmPassword &&
//     emailOtpVerified &&
//     phoneOtpVerified;

//   /* ================= UI ================= */
//   return (
//     <div className={styles.container}>
//       <h2 className={styles.title}>Create Account</h2>

//       {/* FULL NAME */}
//       <div className={styles["input-box"]}>
//         <label>Full Name *</label>
//         <input
//           value={fullname}
//           onChange={(e) =>
//             setFullname(e.target.value.replace(/[^A-Za-z ]/g, ""))
//           }
//         />
//       </div>

//       {/* EMAIL */}
//       <div className={styles["input-box"]}>
//         <label>Email *</label>
//         <input
//           value={email}
//           onChange={(e) => {
//             setEmail(e.target.value);
//             setEmailOtpSent(false);
//             setEmailOtpVerified(false);
//             setEmailOtp("");
//           }}
//         />
//         <button
//           type="button"
//           onClick={sendEmailOtp}
//           disabled={!emailRegex.test(email)}
//         >
//           Send Email OTP
//         </button>
//       </div>

//       {/* EMAIL OTP (always visible) */}
//       <div className={styles.otpBox}>
//         <input
//           placeholder="Enter Email OTP"
//           value={emailOtp}
//           disabled={!emailOtpSent}
//           onChange={(e) => setEmailOtp(e.target.value)}
//           onKeyDown={(e) => onEnter(e, verifyEmailOtp)}
//         />
//         <button
//           type="button"
//           onClick={verifyEmailOtp}
//           disabled={!emailOtpSent || !emailOtp.trim()}
//         >
//           Verify Email OTP
//         </button>
//       </div>

//       {/* PHONE */}
//       <div className={styles["input-box"]}>
//         <label>Phone *</label>
//         <input
//           value={phone}
//           maxLength={10}
//           disabled={!emailOtpVerified}
//           onChange={(e) => {
//             setPhone(e.target.value.replace(/\D/g, ""));
//             setPhoneOtpSent(false);
//             setPhoneOtpVerified(false);
//             setPhoneOtp("");
//           }}
//         />
//         <button
//           type="button"
//           onClick={sendPhoneOtp}
//           disabled={!emailOtpVerified || !isValidIndianPhone(phone)}
//         >
//           Send Phone OTP
//         </button>
//       </div>

//       {/* PHONE OTP */}
//       <div className={styles.otpBox}>
//         <input
//           placeholder="Enter Phone OTP"
//           value={phoneOtp}
//           disabled={!phoneOtpSent}
//           onChange={(e) => setPhoneOtp(e.target.value)}
//           onKeyDown={(e) => onEnter(e, verifyPhoneOtp)}
//         />
//         <button
//           type="button"
//           onClick={verifyPhoneOtp}
//           disabled={!phoneOtpSent || !phoneOtp.trim()}
//         >
//           Verify Phone OTP
//         </button>
//       </div>

//       {/* PASSWORD */}
//       <input
//         type="password"
//         placeholder="Password"
//         disabled={!phoneOtpVerified}
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />

//       <input
//         type="password"
//         placeholder="Confirm Password"
//         disabled={!phoneOtpVerified}
//         value={confirmPassword}
//         onChange={(e) => setConfirmPassword(e.target.value)}
//         onKeyDown={(e) => onEnter(e, handleSubmit)}
//       />

//       <button disabled={!isFormValid} onClick={handleSubmit}>
//         Continue
//       </button>
//     </div>
//   );
// }

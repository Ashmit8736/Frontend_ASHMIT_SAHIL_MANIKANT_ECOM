// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import styles from "./Register.module.css";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// /* ================= VALIDATORS ================= */
// const isStrongPassword = (password) =>
//   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);

// const isValidEmail = (email) =>
//   /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// const isValidIndianPhone = (phone) =>
//   /^[6-9]\d{9}$/.test(phone);

// const Register = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // phone from OTP step (readonly)
//   const phone = location.state?.phone || "";

//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [gender, setGender] = useState("Male");

//   const [showPassword, setShowPassword] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);

//   /* ================= REGISTER ================= */
//   const handleRegister = async () => {
//     const newErrors = {};

//     const cleanPhone = phone.replace(/\D/g, "").slice(-10);

//     /* ---------- VALIDATION ---------- */
//     if (!username.trim() || username.trim().length < 3) {
//       newErrors.username = "Full name must be at least 3 characters";
//     }

//     if (!email.trim() || !isValidEmail(email)) {
//       newErrors.email = "Enter a valid email address";
//     }

//     if (!isStrongPassword(password)) {
//       newErrors.password =
//         "Password must be 8+ chars with uppercase, lowercase, number & symbol";
//     }

//     if (!isValidIndianPhone(cleanPhone)) {
//       newErrors.phone = "Phone number must be 10 digits & start with 6–9";
//     }

//     if (!["Male", "Female", "Other"].includes(gender)) {
//       newErrors.gender = "Please select a valid gender";
//     }

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     /* ---------- API CALL ---------- */
//     try {
//       setLoading(true);
//       setErrors({});

//       const res = await axios.post(
//         `${BASE_URL}/auth/register`,
//         {
//           username: username.trim(),
//           email: email.trim(),
//           password,
//           phone: cleanPhone,
//           gender,
//         },
//         { withCredentials: true }
//       );

//       if (res.status === 201) {
//         navigate("/auth/account-pending", {
//           replace: true,
//           state: { email },
//         });
//       }
//     } catch (err) {
//       setErrors({
//         form:
//           err.response?.data?.message ||
//           "Registration failed. Please try again.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles.mainSignInContainer}>
//       <div className={styles.bgImage}></div>

//       <div className={styles.SignInContainer}>
//         <form className={styles.form} onSubmit={(e) => {
//           e.preventDefault();
//           handleRegister();
//         }}>

//           <h1>Create Account</h1>

//           {errors.form && (
//             <p className={styles.errorText}>{errors.form}</p>
//           )}

//           {/* FULL NAME */}
//           <input
//             type="text"
//             placeholder="Full name"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             className={errors.username ? styles.errorInput : ""}
//           />
//           {errors.username && (
//             <span className={styles.errorText}>{errors.username}</span>
//           )}

//           {/* EMAIL */}
//           <input
//             type="email"
//             placeholder="Email address"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className={errors.email ? styles.errorInput : ""}
//           />
//           {errors.email && (
//             <span className={styles.errorText}>{errors.email}</span>
//           )}

//           {/* PASSWORD */}
//           <div className={styles.passwordWrap}>
//             <input
//               type={showPassword ? "text" : "password"}
//               placeholder="Create password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className={errors.password ? styles.errorInput : ""}
//             />
//             <span
//               className={styles.eyeIcon}
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               👁️
//             </span>
//           </div>

//           {errors.password ? (
//             <span className={styles.errorText}>{errors.password}</span>
//           ) : (
//             <p className={styles.helperText}>
//               Min 8 chars, uppercase, lowercase, number & symbol
//             </p>
//           )}

//           {/* PHONE (READONLY) */}
//           <input
//             type="text"
//             value={phone}
//             readOnly
//             className={errors.phone ? styles.errorInput : ""}
//           />
//           {errors.phone && (
//             <span className={styles.errorText}>{errors.phone}</span>
//           )}

//           {/* GENDER */}
//           <select
//             className={`${styles.selectInput} ${errors.gender ? styles.errorInput : ""
//               }`}
//             value={gender}
//             onChange={(e) => setGender(e.target.value)}
//           >
//             <option value="Male">Male</option>
//             <option value="Female">Female</option>
//             <option value="Other">Other</option>
//           </select>
//           {errors.gender && (
//             <span className={styles.errorText}>{errors.gender}</span>
//           )}

//           <button type="submit" disabled={loading}>
//             {loading ? "Creating Account..." : "Register"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Register;

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Register.module.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const REGISTER_DRAFT_KEY = "buyer_register_draft";

/* ================= VALIDATORS ================= */
const isStrongPassword = (password) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidIndianPhone = (phone) =>
  /^[6-9]\d{9}$/.test(phone);

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // phone from OTP step (readonly)
  const phone = location.state?.phone || "";

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("Male");

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* ================= RESTORE DRAFT ================= */
  useEffect(() => {
    const savedDraft = localStorage.getItem(REGISTER_DRAFT_KEY);
    if (savedDraft) {
      const data = JSON.parse(savedDraft);
      setUsername(data.username || "");
      setEmail(data.email || "");
      setGender(data.gender || "Male");
    }
  }, []);

  /* ================= SAVE DRAFT (SAFE FIELDS ONLY) ================= */
  const saveDraft = (newData) => {
    const existing = JSON.parse(
      localStorage.getItem(REGISTER_DRAFT_KEY) || "{}"
    );

    localStorage.setItem(
      REGISTER_DRAFT_KEY,
      JSON.stringify({ ...existing, ...newData })
    );
  };

  /* ================= REGISTER ================= */
  const handleRegister = async () => {
    const newErrors = {};
    const cleanPhone = phone.replace(/\D/g, "").slice(-10);

    /* ---------- VALIDATION ---------- */
    if (!username.trim() || username.trim().length < 3) {
      newErrors.username = "Full name must be at least 3 characters";
    }

    if (!email.trim() || !isValidEmail(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!isStrongPassword(password)) {
      newErrors.password =
        "Password must be 8+ chars with uppercase, lowercase, number & symbol";
    }

    if (!isValidIndianPhone(cleanPhone)) {
      newErrors.phone = "Phone number must be 10 digits & start with 6–9";
    }

    if (!["Male", "Female", "Other"].includes(gender)) {
      newErrors.gender = "Please select a valid gender";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    /* ---------- API CALL ---------- */
    try {
      setLoading(true);
      setErrors({});

      const res = await axios.post(
        `${BASE_URL}/auth/register`,
        {
          username: username.trim(),
          email: email.trim(),
          password, // ❌ NOT saved in localStorage
          phone: cleanPhone,
          gender,
        },
        { withCredentials: true }
      );

      if (res.status === 201) {
        // 🔥 CLEAR LOCAL DRAFT AFTER SUCCESS
        localStorage.removeItem(REGISTER_DRAFT_KEY);

        navigate("/auth/account-pending", {
          replace: true,
          state: { email },
        });
      }
    } catch (err) {
      setErrors({
        form:
          err.response?.data?.message ||
          "Registration failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.mainSignInContainer}>
      <div className={styles.bgImage}></div>

      <div className={styles.SignInContainer}>
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
        >
          <h1>Create Account</h1>

          {errors.form && (
            <p className={styles.errorText}>{errors.form}</p>
          )}

          {/* FULL NAME */}
          <input
            type="text"
            placeholder="Full name"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              saveDraft({ username: e.target.value });
            }}
            className={errors.username ? styles.errorInput : ""}
          />
          {errors.username && (
            <span className={styles.errorText}>{errors.username}</span>
          )}

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              saveDraft({ email: e.target.value });
            }}
            className={errors.email ? styles.errorInput : ""}
          />
          {errors.email && (
            <span className={styles.errorText}>{errors.email}</span>
          )}

          {/* PASSWORD (NOT SAVED) */}
          <div className={styles.passwordWrap}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? styles.errorInput : ""}
            />
            <span
              className={styles.eyeIcon}
              onClick={() => setShowPassword(!showPassword)}
            >
              👁️
            </span>
          </div>

          {errors.password ? (
            <span className={styles.errorText}>{errors.password}</span>
          ) : (
            <p className={styles.helperText}>
              Min 8 chars, uppercase, lowercase, number & symbol
            </p>
          )}

          {/* PHONE (READONLY) */}
          <input
            type="text"
            value={phone}
            readOnly
            className={errors.phone ? styles.errorInput : ""}
          />
          {errors.phone && (
            <span className={styles.errorText}>{errors.phone}</span>
          )}

          {/* GENDER */}
          <select
            className={`${styles.selectInput} ${errors.gender ? styles.errorInput : ""
              }`}
            value={gender}
            onChange={(e) => {
              setGender(e.target.value);
              saveDraft({ gender: e.target.value });
            }}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && (
            <span className={styles.errorText}>{errors.gender}</span>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;

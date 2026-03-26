

import React, { useEffect, useState, useRef } from "react";
import style from "./AccountVerifications.module.css";
import { IoCallOutline } from "react-icons/io5";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { RiSecurePaymentFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import {
  sellerPhoneVerificatioBySendOtp,
  sellerVerifyPhoneOtp,
  sellerEmailVerificationBySendOtp,
  sellerVerifyEmailOtp,
} from "../../../store/actions/SellerAction";
import {
  updateSellerRegistrationField,
  setStepValid,
} from "../../../store/slices/Seller.slice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AccountVerification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const SIGNUP_PHONE_KEY = "seller_signup_phone";

  const clearAllSellerSignupLocal = () => {
    localStorage.removeItem("seller_signup_step1");
    localStorage.removeItem("seller_signup_step2");
    localStorage.removeItem("seller_signup_step3");
    localStorage.removeItem("seller_signup_step4");
  };

  const LS_KEY = "seller_signup_step1";

  const saveToLocal = (data) => {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  };

  const getFromLocal = () => {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY)) || null;
    } catch {
      return null;
    }
  };
  const getPasswordStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return { label: "Weak", color: "#e53935", level: 1 };
    if (score === 3 || score === 4)
      return { label: "Medium", color: "#f9a825", level: 2 };
    return { label: "Strong", color: "#2e7d32", level: 3 };
  };




  const isValidPhone = (v) => /^[6-9]\d{9}$/.test(v);
  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const {
    loading,
    registration: { sellerData },
  } = useSelector((state) => state.seller);

  const { fullname, password: reduxPassword, verifyPhone, verifyEmail } =
    sellerData;

  /* ================= REFS ================= */
  const fullnameRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const phoneRef = useRef();
  const phoneOtpRef = useRef();
  const emailRef = useRef();
  const emailOtpRef = useRef();

  const isValidName = (v) => /^[A-Za-z ]+$/.test(v);

  const [errors, setErrors] = useState({});
  const setFieldError = (f, m) => setErrors(p => ({ ...p, [f]: m }));
  const clearFieldError = (f) => setErrors(p => ({ ...p, [f]: "" }));

  /* ================= STATES ================= */
  const password = reduxPassword || "";
  const [confirmPassword, setConfirmPassword] = useState("");

  // const isPasswordMatched =
  //   confirmPassword && password && confirmPassword === password;


  const [phone, setPhone] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [email, setEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");

  const [showPhoneOtp, setShowPhoneOtp] = useState(false);
  const [showEmailOtp, setShowEmailOtp] = useState(false);


  const [phoneTimer, setPhoneTimer] = useState(0);
  const [emailTimer, setEmailTimer] = useState(0);

  useEffect(() => {
    const saved = getFromLocal();
    if (!saved) return;

    if (saved.fullname)
      dispatch(updateSellerRegistrationField({ field: "fullname", value: saved.fullname }));

    if (saved.password)
      dispatch(updateSellerRegistrationField({ field: "password", value: saved.password }));

    if (saved.phone) setPhone(saved.phone);
    if (saved.email) setEmail(saved.email);

    if (saved.verifyPhone)
      dispatch(updateSellerRegistrationField({ field: "verifyPhone", value: true }));

    if (saved.verifyEmail)
      dispatch(updateSellerRegistrationField({ field: "verifyEmail", value: true }));

    setShowPhoneOtp(!!saved.showPhoneOtp);
    setShowEmailOtp(!!saved.showEmailOtp);
  }, [dispatch]);

  // 5️⃣ AUTO SAVE EFFECT
  useEffect(() => {
    saveToLocal({
      fullname,
      phone,
      email,
      password,
      verifyPhone,
      verifyEmail,
      showPhoneOtp,
      showEmailOtp,
    });
  }, [fullname, phone, email, password, verifyPhone, verifyEmail, showPhoneOtp, showEmailOtp]);

  const normalize = (v) => v?.toString().trim();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isPasswordMatched = confirmPassword && password && confirmPassword === password;
  const [passwordError, setPasswordError] = useState("");
  const passwordStrength = getPasswordStrength(password || "");






  /* 🔒 LOCKS (MULTI CLICK FIX) */
  const [sendingPhoneOtp, setSendingPhoneOtp] = useState(false);
  const [verifyingPhoneOtp, setVerifyingPhoneOtp] = useState(false);
  const [sendingEmailOtp, setSendingEmailOtp] = useState(false);
  const [verifyingEmailOtp, setVerifyingEmailOtp] = useState(false);





  /* ================= PASSWORD ================= */
  const handlePasswordChange = (e) => {
    const val = e.target.value;
    dispatch(updateSellerRegistrationField({ field: "password", value: val }));

    if (val.length < 8) {
      setPasswordError("Minimum 8 characters required");
    } else if (confirmPassword && confirmPassword !== val) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };
  const handleConfirmPassword = (e) => {
    const val = e.target.value;
    setConfirmPassword(val);
    setPasswordError(val !== password ? "Passwords do not match" : "");
  };

  /* ================= TIMERS ================= */
  useEffect(() => {
    if (phoneTimer > 0) {
      const t = setInterval(() => setPhoneTimer((p) => p - 1), 1000);
      return () => clearInterval(t);
    }
  }, [phoneTimer]);

  useEffect(() => {
    if (emailTimer > 0) {
      const t = setInterval(() => setEmailTimer((p) => p - 1), 1000);
      return () => clearInterval(t);
    }
  }, [emailTimer]);

  /* ================= STEP VALID ================= */
  useEffect(() => {
    const hasErrors = Object.values(errors).some(Boolean);

    dispatch(
      setStepValid({
        step: "account",
        value:
          !hasErrors &&
          fullname?.trim().length >= 3 &&
          password.length >= 8 &&
          verifyPhone === true &&
          verifyEmail === true &&
          !passwordError,
      })
    );
  }, [errors, fullname, password, verifyPhone, verifyEmail, passwordError, dispatch]);




  const sendPhoneOtp = async () => {
    const cleanPhone = normalize(phone);

    if (sendingPhoneOtp || phoneTimer > 0) return;

    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return toast.error("Enter valid Indian phone number");
    }

    // 🔥 BLOCK ONLY AFTER REGISTRATION
    if (sellerData.isRegistered && sellerData.phone === cleanPhone) {
      return toast.info("Phone already verified");
    }

    try {
      setSendingPhoneOtp(true);

      await dispatch(
        sellerPhoneVerificatioBySendOtp({ phone: cleanPhone })
      ).unwrap();

      toast.success("OTP sent");
      setShowPhoneOtp(true);
      setPhoneTimer(60);

      setTimeout(() => phoneOtpRef.current?.focus(), 200);
    } catch (err) {
      toast.error(err?.message || "OTP failed");
    } finally {
      setSendingPhoneOtp(false);
    }
  };




  const verifyPhoneOtp = async () => {
    if (verifyingPhoneOtp) return;

    const cleanPhone = normalize(phone);
    const cleanOtp = normalize(phoneOtp);

    if (!cleanOtp || cleanOtp.length < 4) {
      return toast.error("Enter valid OTP");
    }

    try {
      setVerifyingPhoneOtp(true);

      await dispatch(
        sellerVerifyPhoneOtp({ phone: cleanPhone, otp: cleanOtp })
      ).unwrap();

      dispatch(updateSellerRegistrationField({ field: "phone", value: cleanPhone }));
      dispatch(updateSellerRegistrationField({ field: "verifyPhone", value: true }));

      toast.success("Phone verified");
      setShowPhoneOtp(false);
      setPhoneOtp("");

      setTimeout(() => emailRef.current?.focus(), 200);
    } catch (err) {
      toast.error(err?.message || "Invalid OTP");
    } finally {
      setVerifyingPhoneOtp(false);
    }
  };

  const sendEmailOtp = async () => {
    const cleanEmail = normalize(email);

    if (sendingEmailOtp || emailTimer > 0) return;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return toast.error("Invalid email");
    }

    // 🔥 BLOCK ONLY AFTER REGISTRATION
    if (sellerData.isRegistered && sellerData.email === cleanEmail) {
      return toast.info("Email already verified");
    }

    try {
      setSendingEmailOtp(true);

      // redux sync
      dispatch(
        updateSellerRegistrationField({
          field: "email",
          value: cleanEmail,
        })
      );

      await dispatch(
        sellerEmailVerificationBySendOtp({ email: cleanEmail })
      ).unwrap();

      toast.success("OTP sent");
      setShowEmailOtp(true);
      setEmailTimer(60);

      setTimeout(() => emailOtpRef.current?.focus(), 200);
    } catch (err) {
      toast.error(err?.message || "OTP failed");
    } finally {
      setSendingEmailOtp(false);
    }
  };



  const verifyEmailOtp = async () => {
    if (verifyingEmailOtp) return;

    const cleanOtp = normalize(emailOtp);
    const reduxEmail = sellerData.email;

    if (!reduxEmail) {
      return toast.error("Email missing, resend OTP");
    }

    if (!cleanOtp || cleanOtp.length < 4) {
      return toast.error("Enter valid OTP");
    }

    try {
      setVerifyingEmailOtp(true);

      await dispatch(
        sellerVerifyEmailOtp({ email: reduxEmail, otp: cleanOtp })
      ).unwrap();

      dispatch(updateSellerRegistrationField({ field: "verifyEmail", value: true }));
      toast.success("Email verified");

      setShowEmailOtp(false);
      setEmailOtp("");
    } catch (err) {
      toast.error(err?.message || "Invalid OTP");
    } finally {
      setVerifyingEmailOtp(false);
    }
  };


  /* ================= JSX (UI SAME) ================= */
  return (
    <div className={style.AccountVerificationContainer}>
      <header className={style.heading}>
        <h2>Account Setup & Verification</h2>
        <p>Create your seller account and verify your contact details</p>
      </header>

      {/* ACCOUNT */}
      <section className={style.UsernameSection}>
        <div className={style.UsernameForm}>
          <input
            ref={fullnameRef}
            placeholder="Enter First & Last Name"
            maxLength={40}
            value={fullname || ""}
            onChange={(e) => {
              let val = e.target.value;

              // 🔥 REMOVE EVERYTHING EXCEPT LETTERS + SPACE
              val = val.replace(/[^A-Za-z ]/g, "");

              // 🔥 REMOVE MULTIPLE SPACES
              val = val.replace(/\s+/g, " ");

              dispatch(
                updateSellerRegistrationField({
                  field: "fullname",
                  value: val,
                })
              );

              if (!val.trim()) {
                setFieldError("fullname", "Full name is required");
              } else if (val.trim().length < 6) {
                setFieldError("fullname", "Minimum 6 characters required");
              } else if (val.length > 40) {
                setFieldError("fullname", "Maximum 40 characters allowed");
              } else {
                clearFieldError("fullname");
              }
            }}
            onPaste={(e) => {
              e.preventDefault();

              // 🔥 PASTE CLEAN STRING ONLY
              const pasted = e.clipboardData
                .getData("text")
                .replace(/[^A-Za-z ]/g, "")
                .replace(/\s+/g, " ")
                .slice(0, 40);

              dispatch(
                updateSellerRegistrationField({
                  field: "fullname",
                  value: pasted,
                })
              );
            }}
            onKeyDown={(e) => {
              // 🔒 BLOCK NUMBER KEYS HARD
              if (/[0-9]/.test(e.key)) {
                e.preventDefault();
              }

              if (e.key === "Enter") {
                passwordRef.current?.focus();
              }
            }}
          />


          {errors.fullname && <p className={style.error}>{errors.fullname}</p>}




          <div className={style.UsernamePassword}>

            {/* PASSWORD */}
            <div className={style.passwordWrapper}>
              <input
                ref={passwordRef}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    confirmPasswordRef.current?.focus();
                  }
                }}
              />

              <span
                className={style.eye}
                onClick={() => setShowPassword((p) => !p)}
              >
                {showPassword ? "Hide" : "Show"}
              </span>

              {/* 🔥 PASSWORD STRENGTH */}
              {password && (
                <div className={style.passwordStrength}>
                  <div className={style.strengthBar}>
                    <span
                      style={{
                        width: `${passwordStrength.level * 33}%`,
                        backgroundColor: passwordStrength.color,
                      }}
                    />
                  </div>
                  <p style={{ color: passwordStrength.color }}>
                    {passwordStrength.label} password
                  </p>
                </div>
              )}
            </div>


            {/* CONFIRM PASSWORD */}
            <div className={style.passwordWrapper}>
              <input
                ref={confirmPasswordRef}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleConfirmPassword}
                onKeyDown={(e) => e.key === "Enter" && phoneRef.current?.focus()}
              />

              <span
                className={style.eye}
                onClick={() => setShowConfirmPassword((p) => !p)}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </span>

              {/* 🔥 MATCH STATUS */}
              {confirmPassword && (
                <p
                  className={
                    isPasswordMatched ? style.success : style.error
                  }
                >
                  {isPasswordMatched
                    ? "Passwords match "
                    : "Passwords do not match "}
                </p>
              )}
            </div>


          </div>
        </div>
      </section>


      {/* PHONE */}
      <section className={style.Verification}>
        <div className={style.IconsAndHeading}>
          <IoCallOutline className={style.Icon} />
          <h2>Phone Verification</h2>
        </div>

        <div className={style.form}>
          <div className={style.Input}>
            <input
              ref={phoneRef}
              maxLength={10}
              value={phone}
              placeholder="Phone"
              disabled={verifyPhone}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "").slice(0, 10);

                const savedPhone = localStorage.getItem("seller_signup_phone");

                // 🔥 PHONE CHANGE DETECT → CLEAR ALL OLD DATA
                if (savedPhone && savedPhone !== v) {
                  clearAllSellerSignupLocal();

                  dispatch(updateSellerRegistrationField({ field: "verifyPhone", value: false }));
                  dispatch(updateSellerRegistrationField({ field: "verifyEmail", value: false }));

                  setShowPhoneOtp(false);
                  setShowEmailOtp(false);
                }

                // 🔐 SAVE CURRENT PHONE
                localStorage.setItem("seller_signup_phone", v);

                setPhone(v);

                if (v && !isValidPhone(v)) {
                  setFieldError("phone", "Enter valid 10 digit phone");
                } else {
                  clearFieldError("phone");
                }
              }}

              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (!isValidPhone(phone)) {
                    setFieldError("phone", "Enter valid 10 digit phone");
                    return;
                  }
                  sendPhoneOtp();
                }
              }}
            />

            <button disabled={sendingPhoneOtp || phoneTimer > 0 || !isValidPhone(phone) || !!errors.phone} onClick={sendPhoneOtp}>
              {phoneTimer ? `Wait ${phoneTimer}s` : "Send OTP"}
            </button>
            {!errors.phone && isValidPhone(phone) && !verifyPhone && (
              <p className={style.success}>Phone looks good ✔</p>
            )}

            {verifyPhone && (
              <p className={style.success}>Phone verified ✔</p>
            )}
          </div>
        </div>

        {showPhoneOtp && (
          <div className={style.VerifyOtpform}>
            <div className={style.Input}>
              <input
                ref={phoneOtpRef}
                placeholder="OTP"
                value={phoneOtp}
                onChange={(e) => setPhoneOtp(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    verifyPhoneOtp();
                  }
                }}
              />
              <button disabled={verifyingPhoneOtp} onClick={verifyPhoneOtp}>
                Verify OTP
              </button>
            </div>
          </div>
        )}
      </section>

      {/* EMAIL */}
      <section className={style.Verification}>
        <div className={style.IconsAndHeading}>
          <MdOutlineMarkEmailRead className={style.Icon} />
          <h2>Email Verification</h2>
        </div>

        <div className={style.form}>
          <div className={style.Input}>
            <input
              ref={emailRef}
              value={email}
              placeholder="Email"
              disabled={verifyEmail}
              onChange={(e) => {
                const v = e.target.value;
                setEmail(v);

                if (v && !isValidEmail(v)) {
                  setFieldError("email", "Enter valid email");
                } else {
                  clearFieldError("email");
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (!isValidEmail(email)) {
                    setFieldError("email", "Enter valid email");
                    return;
                  }
                  sendEmailOtp();
                }
              }}
            />
            {errors.email && (
              <p className={style.error}>{errors.email}</p>
            )}

            {verifyEmail && (
              <p className={style.success}>Email verified ✔</p>
            )}

            <button disabled={sendingEmailOtp || emailTimer > 0 || !isValidEmail(email) || !!errors.email} onClick={sendEmailOtp}>
              {emailTimer ? `Wait ${emailTimer}s` : "Send OTP"}
            </button>

            {!errors.email && isValidEmail(email) && !verifyEmail && (
              <p className={style.success}>Email looks good ✔</p>
            )}
          </div>
        </div>

        {showEmailOtp && (
          <div className={style.VerifyOtpform}>
            <div className={style.Input}>
              <input
                ref={emailOtpRef}
                placeholder="OTP"
                value={emailOtp}
                onChange={(e) => setEmailOtp(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    verifyEmailOtp();
                  }
                }}
              />
              <button disabled={verifyingEmailOtp} onClick={verifyEmailOtp}>
                Verify OTP
              </button>
            </div>
          </div>
        )}
      </section>

      <section className={style.lastSection}>
        <RiSecurePaymentFill className={style.secureIcon} />
        <span>Your data is secure</span>
      </section>
    </div>
  );
};

export default AccountVerification;

// Current code 

// import React, { useEffect, useState, useRef } from "react";
// import style from "./AccountVerifications.module.css";
// import { IoCallOutline } from "react-icons/io5";
// import { MdOutlineMarkEmailRead } from "react-icons/md";
// import { RiSecurePaymentFill } from "react-icons/ri";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   sellerPhoneVerificatioBySendOtp,
//   sellerVerifyPhoneOtp,
//   sellerEmailVerificationBySendOtp,
//   sellerVerifyEmailOtp,
// } from "../../../store/actions/SellerAction";
// import {
//   updateSellerRegistrationField,
//   setStepValid,
// } from "../../../store/slices/Seller.slice";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";

// const STORAGE_KEY = "seller_account_verification"; // 🔹 FOR DATA SAVE

// const AccountVerification = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const getPasswordStrength = (pwd) => {
//     let score = 0;

//     if (pwd.length >= 8) score++;
//     if (/[A-Z]/.test(pwd)) score++;
//     if (/[a-z]/.test(pwd)) score++;
//     if (/[0-9]/.test(pwd)) score++;
//     if (/[^A-Za-z0-9]/.test(pwd)) score++;

//     if (score <= 2) return { label: "Weak", color: "#e53935", level: 1 };
//     if (score === 3 || score === 4)
//       return { label: "Medium", color: "#f9a825", level: 2 };
//     return { label: "Strong", color: "#2e7d32", level: 3 };
//   };



//   const isValidPhone = (v) => /^[6-9]\d{9}$/.test(v);
//   const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

//   const {
//     loading,
//     registration: { sellerData },
//   } = useSelector((state) => state.seller);

//   const { fullname, password: reduxPassword, verifyPhone, verifyEmail } =
//     sellerData;

//   /* ================= REFS ================= */
//   const fullnameRef = useRef();
//   const passwordRef = useRef();
//   const confirmPasswordRef = useRef();
//   const phoneRef = useRef();
//   const phoneOtpRef = useRef();
//   const emailRef = useRef();
//   const emailOtpRef = useRef();

//   const isValidName = (v) => /^[A-Za-z ]+$/.test(v);

//   const [errors, setErrors] = useState({});
//   const setFieldError = (f, m) => setErrors(p => ({ ...p, [f]: m }));
//   const clearFieldError = (f) => setErrors(p => ({ ...p, [f]: "" }));


//   const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};


//   /* ================= STATES ================= */


//   const password = reduxPassword || "";
//   const [confirmPassword, setConfirmPassword] = useState(savedData.confirmPassword || "");

//   // const isPasswordMatched =
//   //   confirmPassword && password && confirmPassword === password;


//   const [phone, setPhone] = useState(savedData.phone || "");
//   const [phoneOtp, setPhoneOtp] = useState("");
//   const [email, setEmail] = useState(savedData.email || "");
//   const [emailOtp, setEmailOtp] = useState("");

//   const [showPhoneOtp, setShowPhoneOtp] = useState(false);
//   const [showEmailOtp, setShowEmailOtp] = useState(false);


//   const [phoneTimer, setPhoneTimer] = useState(0);
//   const [emailTimer, setEmailTimer] = useState(0);



//   const normalize = (v) => v?.toString().trim();

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const isPasswordMatched = confirmPassword && password && confirmPassword === password;
//   const [passwordError, setPasswordError] = useState("");
//   const passwordStrength = getPasswordStrength(password || "");






//   /* 🔒 LOCKS (MULTI CLICK FIX) */
//   const [sendingPhoneOtp, setSendingPhoneOtp] = useState(false);
//   const [verifyingPhoneOtp, setVerifyingPhoneOtp] = useState(false);
//   const [sendingEmailOtp, setSendingEmailOtp] = useState(false);
//   const [verifyingEmailOtp, setVerifyingEmailOtp] = useState(false);

//   useEffect(() => {
//     localStorage.setItem(
//       STORAGE_KEY,
//       JSON.stringify({
//         fullname,
//         password,
//         confirmPassword,
//         phone,
//         email,
//       })
//     );
//   }, [fullname, password, confirmPassword, phone, email]);







//   /* ================= PASSWORD ================= */
//   const handlePasswordChange = (e) => {
//     const val = e.target.value;
//     dispatch(updateSellerRegistrationField({ field: "password", value: val }));

//     if (val.length < 8) {
//       setPasswordError("Minimum 8 characters required");
//     } else if (confirmPassword && confirmPassword !== val) {
//       setPasswordError("Passwords do not match");
//     } else {
//       setPasswordError("");
//     }
//   };
//   const handleConfirmPassword = (e) => {
//     const val = e.target.value;
//     setConfirmPassword(val);
//     setPasswordError(val !== password ? "Passwords do not match" : "");
//   };

//   /* ================= TIMERS ================= */
//   useEffect(() => {
//     if (phoneTimer > 0) {
//       const t = setInterval(() => setPhoneTimer((p) => p - 1), 1000);
//       return () => clearInterval(t);
//     }
//   }, [phoneTimer]);

//   useEffect(() => {
//     if (emailTimer > 0) {
//       const t = setInterval(() => setEmailTimer((p) => p - 1), 1000);
//       return () => clearInterval(t);
//     }
//   }, [emailTimer]);

//   /* ================= STEP VALID ================= */
//   useEffect(() => {
//     const hasErrors = Object.values(errors).some(Boolean);

//     dispatch(
//       setStepValid({
//         step: "account",
//         value:
//           !hasErrors &&
//           fullname?.trim().length >= 3 &&
//           password.length >= 8 &&
//           verifyPhone === true &&
//           verifyEmail === true &&
//           !passwordError,
//       })
//     );
//   }, [errors, fullname, password, verifyPhone, verifyEmail, passwordError, dispatch]);




//   const sendPhoneOtp = async () => {
//     const cleanPhone = normalize(phone);

//     if (sendingPhoneOtp || phoneTimer > 0) return;

//     if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
//       return toast.error("Enter valid Indian phone number");
//     }

//     // 🔥 BLOCK ONLY AFTER REGISTRATION
//     if (sellerData.isRegistered && sellerData.phone === cleanPhone) {
//       return toast.info("Phone already verified");
//     }

//     try {
//       setSendingPhoneOtp(true);

//       await dispatch(
//         sellerPhoneVerificatioBySendOtp({ phone: cleanPhone })
//       ).unwrap();

//       toast.success("OTP sent");
//       setShowPhoneOtp(true);
//       setPhoneTimer(60);

//       setTimeout(() => phoneOtpRef.current?.focus(), 200);
//     } catch (err) {
//       toast.error(err?.message || "OTP failed");
//     } finally {
//       setSendingPhoneOtp(false);
//     }
//   };




//   const verifyPhoneOtp = async () => {
//     if (verifyingPhoneOtp) return;

//     const cleanPhone = normalize(phone);
//     const cleanOtp = normalize(phoneOtp);

//     if (!cleanOtp || cleanOtp.length < 4) {
//       return toast.error("Enter valid OTP");
//     }

//     try {
//       setVerifyingPhoneOtp(true);

//       await dispatch(
//         sellerVerifyPhoneOtp({ phone: cleanPhone, otp: cleanOtp })
//       ).unwrap();

//       dispatch(updateSellerRegistrationField({ field: "phone", value: cleanPhone }));
//       dispatch(updateSellerRegistrationField({ field: "verifyPhone", value: true }));

//       toast.success("Phone verified");
//       setShowPhoneOtp(false);
//       setPhoneOtp("");

//       setTimeout(() => emailRef.current?.focus(), 200);
//     } catch (err) {
//       toast.error(err?.message || "Invalid OTP");
//     } finally {
//       setVerifyingPhoneOtp(false);
//     }
//   };

//   const sendEmailOtp = async () => {
//     const cleanEmail = normalize(email);

//     if (sendingEmailOtp || emailTimer > 0) return;

//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
//       return toast.error("Invalid email");
//     }

//     // 🔥 BLOCK ONLY AFTER REGISTRATION
//     if (sellerData.isRegistered && sellerData.email === cleanEmail) {
//       return toast.info("Email already verified");
//     }

//     try {
//       setSendingEmailOtp(true);

//       // redux sync
//       dispatch(
//         updateSellerRegistrationField({
//           field: "email",
//           value: cleanEmail,
//         })
//       );

//       await dispatch(
//         sellerEmailVerificationBySendOtp({ email: cleanEmail })
//       ).unwrap();

//       toast.success("OTP sent");
//       setShowEmailOtp(true);
//       setEmailTimer(60);

//       setTimeout(() => emailOtpRef.current?.focus(), 200);
//     } catch (err) {
//       toast.error(err?.message || "OTP failed");
//     } finally {
//       setSendingEmailOtp(false);
//     }
//   };



//   const verifyEmailOtp = async () => {
//     if (verifyingEmailOtp) return;

//     const cleanOtp = normalize(emailOtp);
//     const reduxEmail = sellerData.email;

//     if (!reduxEmail) {
//       return toast.error("Email missing, resend OTP");
//     }

//     if (!cleanOtp || cleanOtp.length < 4) {
//       return toast.error("Enter valid OTP");
//     }

//     try {
//       setVerifyingEmailOtp(true);

//       await dispatch(
//         sellerVerifyEmailOtp({ email: reduxEmail, otp: cleanOtp })
//       ).unwrap();

//       dispatch(updateSellerRegistrationField({ field: "verifyEmail", value: true }));
//       toast.success("Email verified");

//       setShowEmailOtp(false);
//       setEmailOtp("");
//     } catch (err) {
//       toast.error(err?.message || "Invalid OTP");
//     } finally {
//       setVerifyingEmailOtp(false);
//     }
//   };


//   /* ================= JSX (UI SAME) ================= */
//   return (
//     <div className={style.AccountVerificationContainer}>
//       <header className={style.heading}>
//         <h2>Account Setup & Verification</h2>
//         <p>Create your seller account and verify your contact details</p>
//       </header>

//       {/* ACCOUNT */}
//       <section className={style.UsernameSection}>
//         <div className={style.UsernameForm}>
//           <input
//             ref={fullnameRef}
//             placeholder="Enter First & Last Name"

//             maxLength={40}
//             value={fullname || ""}
//             onChange={(e) => {
//               let val = e.target.value;

//               // 🔥 REMOVE EVERYTHING EXCEPT LETTERS + SPACE
//               val = val.replace(/[^A-Za-z ]/g, "");

//               // 🔥 REMOVE MULTIPLE SPACES
//               val = val.replace(/\s+/g, " ");

//               dispatch(
//                 updateSellerRegistrationField({
//                   field: "fullname",
//                   value: val,
//                 })
//               );

//               if (!val.trim()) {
//                 setFieldError("fullname", "Full name is required");
//               } else if (val.trim().length < 6) {
//                 setFieldError("fullname", "Minimum 6 characters required");
//               } else if (val.length > 40) {
//                 setFieldError("fullname", "Maximum 40 characters allowed");
//               } else {
//                 clearFieldError("fullname");
//               }
//             }}
//             onPaste={(e) => {
//               e.preventDefault();

//               // 🔥 PASTE CLEAN STRING ONLY
//               const pasted = e.clipboardData
//                 .getData("text")
//                 .replace(/[^A-Za-z ]/g, "")
//                 .replace(/\s+/g, " ")
//                 .slice(0, 40);

//               dispatch(
//                 updateSellerRegistrationField({
//                   field: "fullname",
//                   value: pasted,
//                 })
//               );
//             }}
//             onKeyDown={(e) => {
//               // 🔒 BLOCK NUMBER KEYS HARD
//               if (/[0-9]/.test(e.key)) {
//                 e.preventDefault();
//               }

//               if (e.key === "Enter") {
//                 passwordRef.current?.focus();
//               }
//             }}
//           />


//           {errors.fullname && <p className={style.error}>{errors.fullname}</p>}




//           <div className={style.UsernamePassword}>

//             {/* PASSWORD */}
//             <div className={style.passwordWrapper}>
//               <input
//                 ref={passwordRef}
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Password"
//                 value={password}
//                 onChange={handlePasswordChange}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") {
//                     confirmPasswordRef.current?.focus();
//                   }
//                 }}
//               />

//               <span
//                 className={style.eye}
//                 onClick={() => setShowPassword((p) => !p)}
//               >
//                 {showPassword ? "Hide" : "Show"}
//               </span>

//               {/* 🔥 PASSWORD STRENGTH */}
//               {password && (
//                 <div className={style.passwordStrength}>
//                   <div className={style.strengthBar}>
//                     <span
//                       style={{
//                         width: `${passwordStrength.level * 33}%`,
//                         backgroundColor: passwordStrength.color,
//                       }}
//                     />
//                   </div>
//                   <p style={{ color: passwordStrength.color }}>
//                     {passwordStrength.label} password
//                   </p>
//                 </div>
//               )}
//             </div>


//             {/* CONFIRM PASSWORD */}
//             <div className={style.passwordWrapper}>
//               <input
//                 ref={confirmPasswordRef}
//                 type={showConfirmPassword ? "text" : "password"}
//                 placeholder="Confirm Password"
//                 value={confirmPassword}
//                 onChange={handleConfirmPassword}
//                 onKeyDown={(e) => e.key === "Enter" && phoneRef.current?.focus()}
//               />

//               <span
//                 className={style.eye}
//                 onClick={() => setShowConfirmPassword((p) => !p)}
//               >
//                 {showConfirmPassword ? "Hide" : "Show"}
//               </span>

//               {/* 🔥 MATCH STATUS */}
//               {confirmPassword && (
//                 <p
//                   className={
//                     isPasswordMatched ? style.success : style.error
//                   }
//                 >
//                   {isPasswordMatched
//                     ? "Passwords match "
//                     : "Passwords do not match "}
//                 </p>
//               )}
//             </div>


//           </div>
//         </div>
//       </section>


//       {/* PHONE */}
//       <section className={style.Verification}>
//         <div className={style.IconsAndHeading}>
//           <IoCallOutline className={style.Icon} />
//           <h2>Phone Verification</h2>
//         </div>

//         <div className={style.form}>
//           <div className={style.Input}>
//             <input
//               ref={phoneRef}
//               maxLength={10}
//               value={phone}
//               placeholder="Phone"
//               disabled={verifyPhone}
//               onChange={(e) => {
//                 const v = e.target.value.replace(/\D/g, "");
//                 setPhone(v);

//                 if (v && !isValidPhone(v)) {
//                   setFieldError("phone", "Enter valid 10 digit phone");
//                 } else {
//                   clearFieldError("phone");
//                 }
//               }}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                   if (!isValidPhone(phone)) {
//                     setFieldError("phone", "Enter valid 10 digit phone");
//                     return;
//                   }
//                   sendPhoneOtp();
//                 }
//               }}
//             />

//             <button disabled={sendingPhoneOtp || phoneTimer > 0 || !isValidPhone(phone) || !!errors.phone} onClick={sendPhoneOtp}>
//               {phoneTimer ? `Wait ${phoneTimer}s` : "Send OTP"}
//             </button>
//             {!errors.phone && isValidPhone(phone) && !verifyPhone && (
//               <p className={style.success}>Phone looks good ✔</p>
//             )}

//             {verifyPhone && (
//               <p className={style.success}>Phone verified ✔</p>
//             )}
//           </div>
//         </div>

//         {showPhoneOtp && (
//           <div className={style.VerifyOtpform}>
//             <div className={style.Input}>
//               <input
//                 ref={phoneOtpRef}
//                 placeholder="OTP"
//                 value={phoneOtp}
//                 onChange={(e) => setPhoneOtp(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") {
//                     verifyPhoneOtp();
//                   }
//                 }}
//               />
//               <button disabled={verifyingPhoneOtp} onClick={verifyPhoneOtp}>
//                 Verify OTP
//               </button>
//             </div>
//           </div>
//         )}
//       </section>

//       {/* EMAIL */}
//       <section className={style.Verification}>
//         <div className={style.IconsAndHeading}>
//           <MdOutlineMarkEmailRead className={style.Icon} />
//           <h2>Email Verification</h2>
//         </div>

//         <div className={style.form}>
//           <div className={style.Input}>
//             <input
//               ref={emailRef}
//               value={email}
//               placeholder="Email"
//               disabled={verifyEmail}
//               onChange={(e) => {
//                 const v = e.target.value;
//                 setEmail(v);

//                 if (v && !isValidEmail(v)) {
//                   setFieldError("email", "Enter valid email");
//                 } else {
//                   clearFieldError("email");
//                 }
//               }}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                   if (!isValidEmail(email)) {
//                     setFieldError("email", "Enter valid email");
//                     return;
//                   }
//                   sendEmailOtp();
//                 }
//               }}
//             />
//             {errors.email && (
//               <p className={style.error}>{errors.email}</p>
//             )}

//             {verifyEmail && (
//               <p className={style.success}>Email verified ✔</p>
//             )}

//             <button disabled={sendingEmailOtp || emailTimer > 0 || !isValidEmail(email) || !!errors.email} onClick={sendEmailOtp}>
//               {emailTimer ? `Wait ${emailTimer}s` : "Send OTP"}
//             </button>

//             {!errors.email && isValidEmail(email) && !verifyEmail && (
//               <p className={style.success}>Email looks good ✔</p>
//             )}
//           </div>
//         </div>

//         {showEmailOtp && (
//           <div className={style.VerifyOtpform}>
//             <div className={style.Input}>
//               <input
//                 ref={emailOtpRef}
//                 placeholder="OTP"
//                 value={emailOtp}
//                 onChange={(e) => setEmailOtp(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") {
//                     verifyEmailOtp();
//                   }
//                 }}
//               />
//               <button disabled={verifyingEmailOtp} onClick={verifyEmailOtp}>
//                 Verify OTP
//               </button>
//             </div>
//           </div>
//         )}
//       </section>

//       <section className={style.lastSection}>
//         <RiSecurePaymentFill className={style.secureIcon} />
//         <span>Your data is secure</span>
//       </section>
//     </div>
//   );
// };

// export default AccountVerification;
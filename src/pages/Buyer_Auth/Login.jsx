import React, { useState } from "react";
import style from "./Auth.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";



const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [useOtp, setUseOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(""); // ✅ popup error
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState("");
  const isValidIndianPhone = (phone) => /^[6-9]\d{9}$/.test(phone);



  /* ======================
     PASSWORD LOGIN
  ====================== */
  const loginUser = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    const cleanPhone = phone.replace(/\D/g, "").slice(-10);

    // 🔥 PHONE VALIDATION FIRST
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setErrorMsg("❌ Mobile number must start with 6, 7, 8 or 9");
      return;
    }

    if (!password) {
      setErrorMsg("❌ Please enter password");
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/auth/login`,
        { phone: cleanPhone, password },
        { withCredentials: true }
      );

      localStorage.setItem("buyerLoggedIn", "true");

      setSuccessMsg("✅ Login successful! Redirecting...");

      setTimeout(() => {
        navigate("/app", { replace: true });
      }, 1200);

    } catch (error) {
      const status = error.response?.status;
      const data = error.response?.data;

      if (status === 404) {
        setErrorMsg("❌ Account not found. Please signup first.");
      } else if (status === 401) {
        setErrorMsg("❌ Incorrect phone number or password.");
      } else if (status === 403 && data?.type === "account") {
        navigate("/auth/account-pending", {
          state: {
            status: data.status,
            message: data.message,
          },
        });
      } else {
        setErrorMsg(data?.message || "Something went wrong. Please try again.");
      }
    }
  };



  /* ======================
     OTP LOGIN
  ====================== */
  const handleLoginOtp = async () => {
    setErrorMsg("");

    if (!phone) {
      setErrorMsg("Please enter phone number");
      return;
    }

    try {
      const cleanPhone = phone.replace(/\D/g, "").slice(-10);

      await axios.post(`${BASE_URL}/auth/send-otp`, {
        phone: cleanPhone
      });

      navigate("/auth/loginn", {
        state: { phone: cleanPhone, from: "login-otp" }
      });
    } catch {
      setErrorMsg("Failed to send OTP. Try again.");
    }
  };

  return (
    <main className={style.shell}>
      <div className={style.bgGradient} />

      <div className={style.card}>
        <h1 className={style.title}>Login</h1>

        {/* 🔥 ERROR POPUP */}
        {errorMsg && (
          <div className={style.errorBox}>
            {errorMsg}
          </div>
        )}

        <form
          className={style.form}
          onSubmit={(e) => {
            e.preventDefault();
            useOtp ? handleLoginOtp() : loginUser();
          }}
        >
          {/* PHONE */}
          <div className={style.inputWrap}>
            <span className={style.prefix}>+91</span>
            <input
              type="text"
              placeholder="Phone number"
              value={phone}
              maxLength={10}
              inputMode="numeric"
              pattern="[0-9]*"
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setPhone(value);
              }}
            />
          </div>

          {/* PASSWORD */}
          {!useOtp && (
            <div className={style.inputWrap}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className={style.eyeIcon}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🔓" : "🔒"}
              </span>
            </div>
          )}

          {/* OPTIONS */}
          <div className={style.rowBetween}>
            {!useOtp ? (
              <>
                <button
                  type="button"
                  className={style.linkBtn}
                  onClick={() => navigate("/auth/forget")}
                >
                  Forgot password?
                </button>
              </>
            ) : (
              <button
                type="button"
                className={style.linkBtn}
                onClick={() => setUseOtp(false)}
              >
                Use Password Instead
              </button>
            )}
          </div>
          {/* ✅ SUCCESS POPUP */}
          {successMsg && (
            <div className={style.successBox}>
              {successMsg}
            </div>
          )}

          {/* ❌ ERROR POPUP */}
          {errorMsg && (
            <div className={style.errorBox}>
              {errorMsg}
            </div>
          )}

          {/* SUBMIT */}
          <button type="submit" className={style.cta}>
            {useOtp ? "Send OTP" : "Login"}
          </button>

          {/* SIGNUP */}
          <p className={style.helper}>
            Not a member?
            <button
              type="button"
              className={style.inlineLink}
              onClick={() => navigate("/auth/signup")}
            >
              Signup
            </button>
          </p>
        </form>
      </div>
    </main>
  );
};

export default Login;






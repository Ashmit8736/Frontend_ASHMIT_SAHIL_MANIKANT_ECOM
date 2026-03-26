import React, { useRef, useState, useEffect } from "react";
import style from "./SellerVerifyOtp.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  sellerForgetPasswordVerifyOtp,
  selleSendOtpForgetPassword,
} from "../../../../store/actions/SellerAction";
import { toast } from "react-toastify";

const OTP_EXPIRY = 60; // 🔥 60 seconds

const SellerVerifyOtp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputRefs = useRef([]);

  const { state } = useLocation();
  const phone = state?.phone;

  const { loading } = useSelector((state) => state.seller);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(OTP_EXPIRY);
  const [resendCooldown, setResendCooldown] = useState(OTP_EXPIRY);
  const [otpError, setOtpError] = useState("");

  /* 🔐 SAFETY */
  useEffect(() => {
    if (!phone) {
      navigate("/seller/auth/forget", { replace: true });
    }
  }, [phone, navigate]);

  /* ⏳ OTP EXPIRY TIMER */
  useEffect(() => {
    if (timer <= 0) return;
    const i = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(i);
  }, [timer]);

  /* 🔁 RESEND COOLDOWN */
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const i = setInterval(() => setResendCooldown((t) => t - 1), 1000);
    return () => clearInterval(i);
  }, [resendCooldown]);

  /* ✏️ INPUT CHANGE */
  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /* ⌫ BACKSPACE */
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  /* ✅ VERIFY OTP */
  const handleVerifyOtp = async () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setOtpError("Enter complete 6 digit OTP");
      return;
    }

    if (timer <= 0) {
      setOtpError("OTP expired. Please resend OTP.");
      return;
    }

    try {
      const res = await dispatch(
        sellerForgetPasswordVerifyOtp({ phone, otp: otpValue })
      ).unwrap();

      toast.success(res.message || "OTP verified");

      navigate("/seller/auth/reset-password", {
        state: { phone },
        replace: true,
      });

    } catch (err) {
      setOtpError(err || "Invalid OTP");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  /* 🔁 RESEND OTP */
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;

    try {
      await dispatch(selleSendOtpForgetPassword({ phone })).unwrap();
      toast.success("OTP resent");

      setOtp(["", "", "", "", "", ""]);
      setTimer(OTP_EXPIRY);
      setResendCooldown(OTP_EXPIRY);
      setOtpError("");
      inputRefs.current[0]?.focus();

    } catch (err) {
      toast.error(err || "Failed to resend OTP");
    }
  };

  /* ⏱ FORMAT */
  const formatTime = (sec) => `0:${sec.toString().padStart(2, "0")}`;

  return (
    <div className={style.sellerVerifyOtpContainer}>
      <div className={style.bgImage}></div>

      <div className={style.sellerVerifyOtpInnerContainer}>
        <h1>Verify OTP</h1>
        <p>Enter OTP sent to +91 {phone}</p>

        <div className={style.otpInputGroup}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              disabled={loading}
              className={`${style.otpBox} ${otpError ? style.inputError : ""
                }`}
            />
          ))}
        </div>

        {otpError ? (
          <span className={style.errorText}>{otpError}</span>
        ) : (
          <span className={style.helperText}>
            OTP expires in <b>{formatTime(timer)}</b>
          </span>
        )}

        <button
          className={style.verifyBtn}
          onClick={handleVerifyOtp}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <button
          type="button"
          onClick={handleResendOtp}
          disabled={resendCooldown > 0}
          className={style.resendButton}
        >
          {resendCooldown > 0
            ? `Resend OTP in ${resendCooldown}s`
            : "Resend OTP"}
        </button>
      </div>
    </div>
  );
};

export default SellerVerifyOtp;

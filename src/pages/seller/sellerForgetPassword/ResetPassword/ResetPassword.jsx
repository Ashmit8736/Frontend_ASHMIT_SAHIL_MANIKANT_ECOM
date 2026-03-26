import React, { useState, useEffect } from "react";
import style from "./ResetPassword.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { sellerResetPassword } from "../../../../store/actions/SellerAction";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();

  const phone = state?.phone;
  const { loading } = useSelector((state) => state.seller);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  /* 🔐 SAFETY */
  useEffect(() => {
    if (!phone) {
      navigate("/seller/auth/forget", { replace: true });
    }
  }, [phone, navigate]);

  /* 🔒 PASSWORD RULE (MATCH BACKEND) */
  const isStrongPassword = (pwd) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/.test(pwd);

  /* 🔄 REALTIME CONFIRM CHECK */
  useEffect(() => {
    if (!confirmPassword) return;
    setError(
      newPassword !== confirmPassword ? "Passwords do not match" : ""
    );
  }, [newPassword, confirmPassword]);

  /* 🚀 SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!newPassword) {
      setError("Password is required");
      return;
    }

    if (!isStrongPassword(newPassword)) {
      setError(
        "Min 8 chars with uppercase, lowercase, number & symbol"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await dispatch(
        sellerResetPassword({ phone, newPassword })
      ).unwrap();

      toast.success(res.message || "Password reset successful");
      navigate("/seller/login", { replace: true });

    } catch (err) {
      toast.error(err || "Failed to reset password");
    }
  };

  return (
    <div className={style.sellerResetPasswordContainer}>
      <div className={style.bgImage}></div>

      <div className={style.sellerResetPasswordInnerContainer}>
        <h1>Reset Password</h1>
        <p>Create a strong new password</p>

        <form onSubmit={handleSubmit}>
          {/* NEW PASSWORD */}
          <div className={style.inputWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <span
              className={style.eyeIcon}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <span className={style.helperText}>
            Min 8 chars, uppercase, lowercase, number & symbol
          </span>

          {/* CONFIRM PASSWORD */}
          <div className={style.inputWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && <span className={style.errorText}>{error}</span>}

          <button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

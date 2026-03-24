import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import style from "./SupplierResetPassword.module.css";

const SupplierResetPassword = () => {
    const { state } = useLocation();
    const phone = state?.phone;
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    /* ================= PASSWORD VALIDATION ================= */
    const isStrongPassword = (pwd) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/.test(pwd);

    const handleReset = async (e) => {
        e.preventDefault();
        setError("");

        if (!phone) {
            toast.error("Invalid session. Please retry forgot password.");
            navigate("/supplier/forgot-password");
            return;
        }

        if (!newPassword) {
            setError("Password is required");
            return;
        }

        if (!isStrongPassword(newPassword)) {
            setError(
                "Password must be 8+ chars with uppercase, lowercase, number & symbol"
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            const res = await axios.post(
                "http://localhost:3000/api/auth/supplier/reset-password",
                { phone, newPassword }
            );

            toast.success(res.data?.message || "Password reset successful");

            navigate("/supplier/login", { replace: true });

        } catch (err) {
            toast.error(err.response?.data?.message || "Reset failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={style.container}>
            <div className={style.bgImage}></div>

            <div className={style.card}>
                <h1>Reset Password</h1>
                <p className={style.subtitle}>
                    Create a strong new password for your account
                </p>

                <form onSubmit={handleReset}>
                    {/* NEW PASSWORD */}
                    <div className={style.inputGroup}>
                        <input
                            type={showPassword ? "text" : "password"}
                            className={style.input}
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />

                        <span
                            className={style.eye}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </span>
                    </div>

                    <p className={style.hint}>
                        Min 8 chars, uppercase, lowercase, number & symbol
                    </p>

                    {/* CONFIRM PASSWORD */}
                    <div className={style.inputGroup}>
                        <input
                            type={showPassword ? "text" : "password"}
                            className={style.input}
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    {/* ERROR */}
                    {error && <span className={style.errorText}>{error}</span>}

                    <button
                        type="submit"
                        className={style.button}
                        disabled={loading}
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SupplierResetPassword;

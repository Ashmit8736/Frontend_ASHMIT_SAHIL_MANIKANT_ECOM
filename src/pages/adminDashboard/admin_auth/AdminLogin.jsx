import React, { useState } from "react";
import styles from "./AdminLogin.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function AdminLogin() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm({ ...form, [name]: value });

        if (touched[name]) {
            setErrors({
                ...errors,
                [name]: validateField(name, value),
            });
        }
    };
    const handleBlur = (e) => {
        const { name, value } = e.target;

        setTouched({ ...touched, [name]: true });

        setErrors({
            ...errors,
            [name]: validateField(name, value),
        });
    };
    const validateField = (name, value) => {
        let error = "";

        if (name === "email") {
            if (!value) {
                error = "Email is required";
            } else if (value.length > 254) {
                error = "Email is too long";
            } else if (
                !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(value)
            ) {
                error = "Enter a valid email";
            }
        }

        if (name === "password") {
            if (!value) {
                error = "Password is required";
            } else if (value.length < 6) {
                error = "Password must be at least 6 characters";
            }
            // 🔥 NO strength rules for login
        }

        return error;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {
            email: validateField("email", form.email),
            password: validateField("password", form.password),
        };

        setErrors(newErrors);
        setTouched({ email: true, password: true });

        if (Object.values(newErrors).some((err) => err)) return;

        setLoading(true);
        setError("");

        try {
            const { data } = await axios.post(
                "http://localhost:3000/api/admin/login",
                form
            );
            localStorage.setItem("adminToken", data.token);
            navigate("/admin/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }

        setLoading(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className={styles.title}>Admin Login</h2>
                <p className={styles.subtitle}>Sign in to continue</p>

                {error && <p className={styles.error}>{error}</p>}

                <form onSubmit={handleSubmit}>

                    {/* Email Input */}
                    <input
                        type="email"
                        name="email"
                        placeholder="admin@example.com"
                        autoComplete="email"
                        maxLength={254}
                        className={`${styles.input} ${touched.email
                            ? errors.email
                                ? styles.errorInput
                                : styles.successInput
                            : ""
                            }`}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />

                    {touched.email && errors.email && (
                        <p className={styles.fieldError}>{errors.email}</p>
                    )}
                    {touched.email && !errors.email && (
                        <p className={styles.fieldSuccess}>Looks good</p>
                    )}

                    {/* Password Input with Toggle */}
                    <div className={styles.passwordWrapper}>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            className={`${styles.input} ${touched.password
                                    ? errors.password
                                        ? styles.errorInput
                                        : styles.successInput
                                    : ""
                                }`}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />

                        {touched.password && errors.password && (
                            <p className={styles.fieldError}>{errors.password}</p>
                        )}
                        {touched.password && !errors.password && (
                            <p className={styles.fieldSuccess}>Password looks good</p>
                        )}

                        <span
                            className={styles.eyeIcon}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    <button className={styles.button} disabled={loading}>
                        {loading ? "Signing in..." : "Login"}
                    </button>
                </form>

                <p className={styles.linkText}>
                    New admin?
                    <span onClick={() => navigate("/admin/register")}> Create account</span>
                </p>
            </div>
        </div>
    );
}

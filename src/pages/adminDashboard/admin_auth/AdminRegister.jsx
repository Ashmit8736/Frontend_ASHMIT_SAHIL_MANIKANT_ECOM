import React, { useState } from "react";
import styles from "./AdminRegister.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminRegister() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await axios.post("http://localhost:3000/api/admin/register", form);
            navigate("/admin/login");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }

        setLoading(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className={styles.title}>Create Admin Account</h2>
                <p className={styles.subtitle}>Manage system with administrator access</p>

                {error && <p className={styles.error}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        className={styles.input}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        className={styles.input}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className={styles.input}
                        onChange={handleChange}
                        required
                    />

                    <button className={styles.button} disabled={loading}>
                        {loading ? "Creating Account..." : "Register"}
                    </button>
                </form>

                <p className={styles.linkText}>
                    Already registered?
                    <span onClick={() => navigate("/admin/login")}> Login</span>
                </p>
            </div>
        </div>
    );
}

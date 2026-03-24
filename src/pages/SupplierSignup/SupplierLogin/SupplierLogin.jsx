import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import style from "./SupplierLogin.module.css";
import axios from "axios";
import { toast } from "react-toastify";

// const SupplierLogin = () => {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     phone: "",
//     password: "",
//   });


const SupplierLogin = () => {
  const navigate = useNavigate();

  // ✅ CHECK IF ALREADY LOGGED IN
  useEffect(() => {
    const token = localStorage.getItem("supplierToken");

    if (token) {
      navigate("/supplier/dashboard");
    }
  }, []);

  const [form, setForm] = useState({
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.phone.trim() || !form.password.trim()) {
      toast.error("Phone and password are required!");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:3000/api/auth/supplier/login",
        form,
        { withCredentials: true }
      );

      // ✅ SAVE TOKEN
     localStorage.setItem("supplierToken", res.data.token);
localStorage.setItem("supplierStatus", res.data.status); 


      toast.success("Supplier Login Successful! 🎉");
      navigate("/supplier/dashboard", { replace: true });

    } catch (error) {
      const status = error.response?.status;
      const data = error.response?.data;

      console.error(error);

      // 🔥 ACCOUNT PENDING / REJECTED (BUYER JAISE)
      if (status === 403 && data?.type === "account") {
        navigate("/supplier/account-approved", {
          replace: true,
          state: {
            status: data.status,   // pending | rejected
            message: data.message,
          },
        });
        return;
      }

      // ❌ NORMAL ERROR
      toast.error(data?.message || "Login Failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.sellerLogInContainer}>
      <div className={style.bgImage}></div>

      <div className={style.SellerLOgInInnerConatainer}>
        <h1>Supplier Login</h1>

        <form onSubmit={handleSubmit} className={style.formContainer}>
          <div className={style.inputGroup}>
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={10}
              placeholder="Enter 10 digit phone number"
              value={form.phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ""); // ❌ remove string
                if (value.length <= 10) {
                  setForm({ ...form, phone: value });
                }
              }}
            />
          </div>

          <div className={style.inputGroup}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <span
              className={style.eyeButton}
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>

            <p
              className={style.forgotPassword}
              onClick={() => navigate("/supplier/forgot-password")}
            >
              Forgot Password?
            </p>
          </div>

          <button type="submit" className={style.loginBtn} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <button
            type="button"
            className={style.registerBtn}
            onClick={() => navigate("/supplier/signup")}
          >
            Create Supplier Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default SupplierLogin;

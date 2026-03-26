import {useState,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSeller } from "../../../store/actions/SellerAction";
import style from "./SellerLogin.module.css";
import { toast } from "react-toastify";

const SellerLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(()=>{
    const token = localStorage.getItem("sellerToken");
    if(token){
      navigate("/seller/dashboard",{replace:true})

    }
    
} ,[])
  const { loading } = useSelector((state) => state.seller);

  const [form, setForm] = useState({
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  /* ================= VALIDATION ================= */
  const validate = () => {
    let err = {};

    if (!form.phone) {
      err.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(form.phone)) {
      err.phone = "Enter valid 10 digit phone number";
    }

    if (!form.password) {
      err.password = "Password is required";
    } else if (form.password.length < 8) {
      err.password = "Password must be at least 8 characters";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const res = await dispatch(loginSeller(form)).unwrap();
      const { token, seller } = res;

      localStorage.setItem("sellerToken", token);

      // 🔴 NOT APPROVED
      if (seller.seller_status !== "approved") {
        toast.info("Your account is pending approval");
        navigate("/seller/auth/account-pending", { replace: true });
        return;
      }

      // ✅ APPROVED
      toast.success("Login successful!");
      navigate("/seller/dashboard", { replace: true });

    } catch (err) {
      toast.error(err || "Invalid phone or password");
    }
  };

  return (
    <div className={style.sellerLogInContainer}>
      <div className={style.bgImage}></div>

      <div className={style.SellerLOgInInnerConatainer}>
        <h1>Seller Login</h1>

        <form onSubmit={handleSubmit} className={style.formContainer}>

          {/* PHONE */}
          <div className={style.inputGroup}>
            <input
              type="text"
              placeholder="Enter your Phone Number"
              value={form.phone}
              maxLength={10}
              className={errors.phone ? style.inputError : ""}
              onChange={(e) => {
                setForm({
                  ...form,
                  phone: e.target.value.replace(/\D/g, ""),
                });
                setErrors({ ...errors, phone: "" });
              }}
            />
            {errors.phone && (
              <span className={style.errorText}>{errors.phone}</span>
            )}
          </div>

          {/* PASSWORD */}
          <div className={style.inputGroup}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your Password"
              value={form.password}
              className={errors.password ? style.inputError : ""}
              onChange={(e) => {
                setForm({ ...form, password: e.target.value });
                setErrors({ ...errors, password: "" });
              }}
            />

            <span
              className={style.eyeButton}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>

            {errors.password && (
              <span className={style.errorText}>{errors.password}</span>
            )}
          </div>

          <p
            className={style.forgotText}
            onClick={() => navigate("/seller/auth/forget")}
          >
            Forgot password?
          </p>

          <button type="submit" className={style.loginBtn} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <button
            type="button"
            className={style.registerBtn}
            onClick={() => navigate("/seller/auth/register")}
          >
            Create Seller Account
          </button>

        </form>
      </div>
    </div>
  );
};

export default SellerLogin;

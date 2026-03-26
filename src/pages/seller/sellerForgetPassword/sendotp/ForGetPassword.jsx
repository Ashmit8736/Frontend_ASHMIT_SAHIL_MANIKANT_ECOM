// import React, { useState } from 'react'
// import style from '../sendotp/ForGetPassword.module.css'
// import {useDispatch,useSelector} from 'react-redux'
// import {selleSendOtpForgetPassword} from '../../../../store/actions/SellerAction'
// import { useNavigate } from 'react-router-dom'

// const ForGetPassword = () => {
//   const navigate = useNavigate()
//   const dispatch = useDispatch()
//   const {loading,error,success} = useSelector(state => state.seller)
//   const [sendOtp, setsendOtp] = useState({
//     phone:""
//   })

//   const hendelSubmit =async (e) => {
//     e.preventDefault()
//     const res =await dispatch(selleSendOtpForgetPassword(sendOtp))
//     if (res?.payload?.message === "OTP sent successfully") {
//     navigate("/seller/verify-otp", { state: { phone: sendOtp.phone } });
//   }
//   }


//   return (
//     <div className={style.sellerForgetPasswordContainer}>
//         <div className={style.bgImage}></div>
//         <div className={style.sellerForgetPasswordInnerContainer}>
//             <h1>Forget Password</h1>
//             <form onSubmit={hendelSubmit}>
//                 <input type="text" placeholder='Enter phone Number To Send OTP' onChange={(e) => setsendOtp({...sendOtp,phone:e.target.value})}/>
//                 <button type='submit'>{loading ? "Sending... OTP" : "Send OTP"}</button>
//                  {error && <p style={{ color: "red" }}>{error}</p>}
//                   {success && <p style={{ color: "green" }}>Send OTP Successful!</p>} 
//             </form>
//         </div>
//     </div>
//   )
// }

// export default ForGetPassword

import React, { useState } from "react";
import style from "../sendotp/ForGetPassword.module.css";
import { useDispatch, useSelector } from "react-redux";
import { selleSendOtpForgetPassword } from "../../../../store/actions/SellerAction";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ForGetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.seller);

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  /* ================= PHONE CHANGE ================= */
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(-10);
    setPhone(value);

    if (!value) {
      setPhoneError("Phone number is required");
    } else if (value.length !== 10) {
      setPhoneError("Enter valid 10 digit phone number");
    } else {
      setPhoneError("");
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (phone.length !== 10) {
      toast.error("Enter valid registered phone number");
      return;
    }

    try {
      const res = await dispatch(
        selleSendOtpForgetPassword({ phone })
      ).unwrap();

      toast.success(res.message || "OTP sent successfully");

      navigate("/seller/auth/verify-otp", {
        state: { phone },
        replace: true,
      });

    } catch (err) {

      // 🔴 BACKEND STATUS HANDLING
      if (err?.includes("not approved")) {
        toast.info("Your account is not approved yet");
        return;
      }

      if (err?.includes("rejected")) {
        toast.error("Your account has been rejected by admin");
        return;
      }

      toast.error(err || "Failed to send OTP");
    }
  };

  return (
    <div className={style.sellerForgetPasswordContainer}>
      <div className={style.bgImage}></div>

      <div className={style.sellerForgetPasswordInnerContainer}>
        <h1>Forgot Password</h1>
        <p>Enter your registered mobile number to receive OTP</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter phone number"
            value={phone}
            maxLength={10}
            onChange={handlePhoneChange}
            className={phoneError ? style.inputError : ""}
          />

          {/* 🔴 / 🟢 VALIDATION MESSAGE */}
          {phoneError ? (
            <span className={style.errorText}>{phoneError}</span>
          ) : phone.length === 10 ? (
            <span className={style.successText}>
              Phone number looks good ✔
            </span>
          ) : (
            <span className={style.helperText}>
              Enter 10 digit registered mobile number
            </span>
          )}

          <button
            type="submit"
            disabled={loading || phone.length !== 10}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForGetPassword;

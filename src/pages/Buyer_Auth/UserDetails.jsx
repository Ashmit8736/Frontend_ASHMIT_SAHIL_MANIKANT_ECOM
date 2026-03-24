// import { useState } from "react";
// import style from "./UserDetails.module.css";
// import { useLocation } from "react-router-dom";
// import { assets } from "../../assets/assets";
// import axios from 'axios';

// const UserDetails = () => {
//   const location = useLocation();
//   const mobile = location.state?.mobile || ""; // ✅ Get from login page

//   const [name, setName] = useState("");
//   const [pass, setPass] = useState("");
//   const [email, setEmail] = useState("");

//   const handleSubmitSignup = (e) => {
//     e.preventDefault();
//     console.log({
//       mobile,
//       email,
//       name,
//       pass,
//     });
//     alert("Account Created!");
//   };

//   const handleSubmitLogin = (e) => {
//     e.preventDefault();
//     alert("User Login");
//   }

//   const ph = [9990271931, 9990271932, 9990271933, 9990271939]



//   const handleOtpSubmit = async (e) => {
//     e.preventDefault();
//     if (!/^\d{10}$/.test(mobile)) {
//       // You can show an alert or error message here
//       return;
//     }
//     try {
//       const response = await axios.post(
//         'https://backend.navambhaw.com/api/auth/astrologer/sendOTP',
//         {
//           Phone: mobile,
//         }
//       );
//       if (response.data.success) {
//         setShowSent(true);
//         setOtpSent(true);
//         setTimeout(() => {
//           setShowSent(false);
//           setTimer(60);
//         }, 1000);
//       } else {
//         setOtpSent(false);
//         setShowSent(false);
//         // Optionally show error
//       }
//     } catch (error) {
//       setOtpSent(false);
//       setShowSent(false);
//       // Optionally show error
//     }


//   }
//   return (
//     <>
//       <div className={style.bgImage}></div>
//       <div className={style.cont}>

//         {ph.includes(Number(mobile)) ? (
//           <div className={style.bgcol}>
//             <form className={style.form} onSubmit={handleSubmitLogin}>
//               <img src={assets.Logo} alt="logo" />
//               <p className={style.alreadyExists}>Mobile number already registered.</p>


//               <label htmlFor="password">Password</label>
//               <div className={style.phoneInput}>
//                 <input
//                   id="password"
//                   type="password"
//                   value={pass}
//                   placeholder="password"
//                   onChange={(e) => setPass(e.target.value)}
//                   minLength="8"
//                 />
//               </div>

//               <button type="submit" className={style.btn}>
//                 Login
//               </button>


//             </form>

//             <form className={style.optForm} onSubmit={handleOtpSubmit}>
//               <hr />
//               <div className={style.otpSec}>
//                 <p>or</p>


//                 <button type="submit" className={style.btn}>Get Otp on your phone</button>
//               </div>
//             </form>
//           </div>
//         ) : (
//           <>
//             <form className={style.form} onSubmit={handleSubmitSignup}>
//               <img src={assets.Logo} alt="" />
//               <p className={style.heading}>Create Account</p>

//               {/* Mobile */}
//               <label htmlFor="mobile">Mobile Number</label>
//               <div className={style.phoneInput}>
//                 <p className={style.prefix}>+91 | </p>
//                 <input
//                   id="mobile"
//                   type="tel"
//                   value={mobile}
//                   readOnly // ✅ locked
//                 />
//                 <button type="button" className={`${style.btn} ${style.otp}`} onClick={handleOtpSubmit}>
//                   Get OTP
//                 </button>
//               </div>

//               <div className={style.phoneInput}>
//                 <input
//                   className={style.loginOtp}
//                   type="text"
//                   placeholder="Enter OTP"
//                   required
//                 />
//                 <button type="button" className={`${style.btn} ${style.otp}`} >
//                   Verify OTP
//                 </button>
//               </div>
//               {/* Email */}
//               <label htmlFor="email">Email</label>
//               <div className={style.phoneInput}>
//                 <input
//                   id="email"
//                   type="email"
//                   value={email}
//                   placeholder="e-mail"
//                   onChange={(e) => setEmail(e.target.value)}
//                   pattern="^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$"
//                   required
//                 />
//               </div>

//               {/* Name */}
//               <label htmlFor="name">Your Name</label>
//               <div className={style.phoneInput}>
//                 <input
//                   id="name"
//                   type="text"
//                   placeholder="First and last name"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   required
//                 />
//               </div>

//               {/* Password */}
//               <label htmlFor="password">Password (at least 8 characters)</label>
//               <div className={style.phoneInput}>
//                 <input
//                   id="password"
//                   type="password"
//                   value={pass}
//                   placeholder="password"
//                   onChange={(e) => setPass(e.target.value)}
//                   required
//                   minLength="8"
//                 />
//               </div>

//               <button type="submit" className={style.btn}>
//                 Create Account
//               </button>
//             </form>
//           </>
//         )}

//       </div>
//     </>
//   );
// };

// export default UserDetails;





import { useState } from "react";
import style from "./UserDetails.module.css";
import { useLocation } from "react-router-dom";
import { assets } from "../../assets/assets";
import axios from "axios";

const UserDetails = () => {
  const location = useLocation();
  const mobile = location.state?.mobile || "";

  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [showSent, setShowSent] = useState(false);
  const [timer, setTimer] = useState(60);

  const handleSubmitSignup = (e) => {
    e.preventDefault();
    console.log({ mobile, email, name, pass });
    alert("Account Created!");
  };

  const handleSubmitLogin = (e) => {
    e.preventDefault();
    alert("User Login");
  };

  const ph = [9990271931, 9990271932, 9990271933, 9990271939];

  /* 🔥 SEND OTP (FIXED) */
  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(mobile)) {
      alert("Invalid mobile number");
      return;
    }

    try {
      const response = await axios.post(
        "https://backend.navambhaw.com/api/auth/send-signup-otp",
        {
          phone: mobile, // ✅ FIXED KEY
        }
      );

      if (response.status === 200) {
        setOtpSent(true);
        setShowSent(true);

        setTimeout(() => {
          setShowSent(false);
          setTimer(60);
        }, 1000);

        alert("OTP sent successfully");
      }
    } catch (error) {
      console.error(error);
      setOtpSent(false);
      setShowSent(false);
      alert("Failed to send OTP");
    }
  };

  return (
    <>
      <div className={style.bgImage}></div>
      <div className={style.cont}>
        {ph.includes(Number(mobile)) ? (
          <div className={style.bgcol}>
            <form className={style.form} onSubmit={handleSubmitLogin}>
              <img src={assets.Logo} alt="logo" />
              <p className={style.alreadyExists}>
                Mobile number already registered.
              </p>

              <label>Password</label>
              <div className={style.phoneInput}>
                <input
                  type="password"
                  value={pass}
                  placeholder="password"
                  onChange={(e) => setPass(e.target.value)}
                  minLength="8"
                />
              </div>

              <button type="submit" className={style.btn}>
                Login
              </button>
            </form>

            <form className={style.optForm} onSubmit={handleOtpSubmit}>
              <hr />
              <div className={style.otpSec}>
                <p>or</p>
                <button type="submit" className={style.btn}>
                  Get Otp on your phone
                </button>
              </div>
            </form>
          </div>
        ) : (
          <form className={style.form} onSubmit={handleSubmitSignup}>
            <img src={assets.Logo} alt="logo" />
            <p className={style.heading}>Create Account</p>

            {/* Mobile */}
            <label>Mobile Number</label>
            <div className={style.phoneInput}>
              <p className={style.prefix}>+91 | </p>
              <input type="tel" value={mobile} readOnly />
              <button
                type="button"
                className={`${style.btn} ${style.otp}`}
                onClick={handleOtpSubmit}
              >
                Get OTP
              </button>
            </div>

            <div className={style.phoneInput}>
              <input
                className={style.loginOtp}
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button type="button" className={`${style.btn} ${style.otp}`}>
                Verify OTP
              </button>
            </div>

            {/* Email */}
            <label>Email</label>
            <div className={style.phoneInput}>
              <input
                type="email"
                value={email}
                placeholder="e-mail"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Name */}
            <label>Your Name</label>
            <div className={style.phoneInput}>
              <input
                type="text"
                placeholder="First and last name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <label>Password (at least 8 characters)</label>
            <div className={style.phoneInput}>
              <input
                type="password"
                value={pass}
                placeholder="password"
                onChange={(e) => setPass(e.target.value)}
                minLength="8"
                required
              />
            </div>

            <button type="submit" className={style.btn}>
              Create Account
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default UserDetails;

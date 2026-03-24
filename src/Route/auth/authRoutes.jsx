import Login from "../../pages/Buyer_Auth/Login.jsx";
import Register from "../../pages/Buyer_Auth/Register.jsx";
import Forget from "../../pages/Buyer_Auth/Forget.jsx";
import VerifyOtp from "../../pages/Buyer_Auth/VerifyOtp.jsx";
import Loginn from "../../pages/Buyer_Auth/Loginn.jsx";
import UserDetails from "../../pages/Buyer_Auth/UserDetails.jsx";
import Signup from "../../pages/Buyer_Auth/Signup.jsx";
import AccountPending from "../../pages/Buyer_Auth/AccountPending.jsx";


const authRoutes = {
  path: "/auth",

  children: [
    { path: "login", element: <Login /> },
    { path: "loginn", element: <Loginn /> },
    { path: "user-details", element: <UserDetails /> },
    { path: "verify-otp", element: <VerifyOtp /> },
    { path: "register", element: <Register /> },
    { path: "forget", element: <Forget /> },
    { path: "signup", element: <Signup /> },
    { path: "account-pending", element: <AccountPending /> },




  ]
};

export default authRoutes;

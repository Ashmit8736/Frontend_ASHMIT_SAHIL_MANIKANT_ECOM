import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../APi/axiosInstance";  // ← Your dual-backend axios

/* ============================
   SELLER LOGIN
============================ */
export const loginSeller = createAsyncThunk(
    "seller/login",
    async (credentials, { rejectWithValue }) => {
        try {
            // const res = await api.post("/auth/seller/login", credentials);
            const res = await api.post("/auth/seller/login", credentials);


            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Login failed");
        }
    }
);

/* ============================
   FORGOT PASSWORD - SEND OTP
============================ */
export const selleSendOtpForgetPassword = createAsyncThunk(
    "seller/send-otp",
    async (credentials, { rejectWithValue }) => {
        try {
            const res = await api.post(
                "/auth/seller/forget-password",
                credentials
            );
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);



/* ============================
   FORGOT PASSWORD - VERIFY OTP
============================ */
export const sellerForgetPasswordVerifyOtp = createAsyncThunk(
    "seller/verify-forgot-otp",
    async (credentials, { rejectWithValue }) => {
        try {
            const res = await api.post(
                "/auth/seller/verify-forgot-otp",
                credentials
            );
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

/* ============================
   RESET PASSWORD
============================ */
export const sellerResetPassword = createAsyncThunk(
    "seller/reset-password",
    async (credentials, { rejectWithValue }) => {
        try {
            const res = await api.post(
                "/auth/seller/reset-password",
                credentials
            );
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);



/* ============================
   REGISTER - SEND PHONE OTP
============================ */
export const sellerPhoneVerificatioBySendOtp = createAsyncThunk(
  "seller/register-phone-otp",
  async ({ phone }, { rejectWithValue }) => {
    try {
      const res = await api.post(
        "/auth/seller/seller-register-send-otp",
        { phone }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);



/* ============================
   REGISTER - VERIFY PHONE OTP
============================ */

export const sellerVerifyPhoneOtp = createAsyncThunk(
  "seller/register-verify-phone-otp",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await api.post(
        "/auth/seller/seller-register-verify-otp",
        credentials
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "OTP verification failed" }
      );
    }
  }
);
/* ============================
   REGISTER - SEND EMAIL OTP
============================ */
export const sellerEmailVerificationBySendOtp = createAsyncThunk(
  "seller/register-email-otp",
  async ({ email }, { rejectWithValue }) => {
    try {
      const res = await api.post(
        "/auth/seller/seller-register-send-email-otp",
        { email }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);


/* ============================
   REGISTER - VERIFY EMAIL OTP
============================ */
export const sellerVerifyEmailOtp = createAsyncThunk(
  "seller/register-email-verify",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await api.post(
        "/auth/seller/seller-register-verify-email-otp",
        credentials
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);
/* ============================
   SELLER REGISTRATION (FINAL)
============================ */
export const sellerRegistration = createAsyncThunk(
    "seller/register",
    async (credentials, { rejectWithValue }) => {
        try {
            const res = await api.post("/auth/seller/register", credentials);
            return res.data;
        } catch (error) {

            // 🔥 BACKEND FIELD VALIDATION ERROR
            if (error.response?.data?.type === "validation") {
                return rejectWithValue({
                    type: "validation",
                    errors: error.response.data.errors
                });
            }

            // 🔥 NORMAL ERROR
            return rejectWithValue({
                message:
                    error.response?.data?.message ||
                    "Registration failed. Please try again."
            });
        }
    }
);

/* ============================
   ADMIN → GET ALL SELLERS
============================ */
export const getAllSeller = createAsyncThunk(
    "admin/getAllSeller",
    async (filters, { rejectWithValue }) => {
        try {
            const res = await api.get("/admin/all-seller", { params: filters });
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

/* ============================
   ADMIN → GET SINGLE SELLER
============================ */
export const getSingleSeller = createAsyncThunk(
    "admin/getSingleSeller",
    async ({ sellerId }, { rejectWithValue }) => {
        try {
            const res = await api.get(`/admin/Single-seller/${sellerId}`);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

/* ============================
   ADMIN → APPROVE SELLER
============================ */
export const ApprovedSeller = createAsyncThunk(
    "admin/approveSeller",
    async ({ sellerId }, { rejectWithValue }) => {
        try {
            const res = await api.patch(`/admin/approveSeller/${sellerId}`);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

/* ============================
   ADMIN → REJECT SELLER
============================ */
export const RejectSeller = createAsyncThunk(
    "admin/rejectSeller",
    async ({ sellerId }, { rejectWithValue }) => {
        try {
            const res = await api.patch(`/admin/rejectSeller/${sellerId}`);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

/* ============================
   ADMIN → STATUS COUNT
============================ */
export const getApprovedAndRejectCount = createAsyncThunk(
    "admin/statusCount",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/admin/statusCount");
            return res.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Something went wrong"
            );
        }
    }
);

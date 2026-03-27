import { createSlice } from "@reduxjs/toolkit";
import {
  loginSeller,
  selleSendOtpForgetPassword,
  sellerForgetPasswordVerifyOtp,
  sellerResetPassword,
  sellerPhoneVerificatioBySendOtp,
  sellerVerifyPhoneOtp,
  sellerEmailVerificationBySendOtp,
  sellerVerifyEmailOtp,
  sellerRegistration,
  getAllSeller,
  getSingleSeller,
  ApprovedSeller,
  RejectSeller,
  getApprovedAndRejectCount,
} from "../actions/SellerAction";

/* ================= LOCAL STORAGE ================= */
const loadRegistration = () => {
  try {
    const data = localStorage.getItem("seller_registration");
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

const saveRegistration = (registration) => {
  localStorage.setItem("seller_registration", JSON.stringify(registration));
};

/* ================= INITIAL STATE ================= */
const defaultRegistration = {
  currentStep: 1,

  stepValid: {
    account: false,
    business: false,
    banking: false,
    warehouse: false,
  },

  sellerData: {
    phone: "",
    email: "",
    fullname: "",
    password: "",
    verifyPhone: false,
    verifyEmail: false,

    gst_no: "",
    organisation_email: "",
    primary_contact_person_name: "",
    primary_contact_person_phone: "",
    primary_contact_person_email: "",
    company_name: "",
    owner_name: "",
    owner_email: "",
    owner_phone: "",
    branch_name: "",
    branch_address: "",
    branch_city: "",
    branch_state: "",
    branch_pincode: "",

    warehouse_pincode: "",
    warehouse_state: "",
    warehouse_full_address: "",
    warehouse_order_procising_capacity: "",

    bank_account_holder_name: "",
    pan_number: "",
    bank_account_no: "",
    bank_IFCS: "",
    bank_name: "",
    account_type: "",
    nature_of_business: "",
    business_category: "",
    declaration: false,
  },

  fieldError: {},
};

const sellerSlice = createSlice({
  name: "seller",

  initialState: {
    seller: null,
    allSellers: [],
    token: null,
    loading: false,
    error: null,
    success: false,
    register: false,
    singleSeller: null,
    StatusCount: [],

    registration: loadRegistration() || defaultRegistration,
  },

  reducers: {
    logoutSeller: (state) => {
      state.seller = null;
      state.token = null;
      state.registration = defaultRegistration;
      localStorage.removeItem("seller_registration");
    },

    /* ================= UPDATE FIELD ================= */
    updateSellerRegistrationField: (state, action) => {
      const { field, value } = action.payload;
      state.registration.sellerData[field] = value;

      if (state.registration.fieldError[field]) {
        delete state.registration.fieldError[field];
      }

      saveRegistration(state.registration);
    },

    /* ================= STEP VALID ================= */
    setStepValid: (state, action) => {
      const { step, value } = action.payload;
      state.registration.stepValid[step] = value;
      saveRegistration(state.registration);
    },

    setRegistrationError: (state, action) => {
      state.registration.fieldError = {
        ...state.registration.fieldError,
        ...action.payload,
      };
      saveRegistration(state.registration);
    },

    nextRegistraionStep: (state) => {
      state.registration.currentStep += 1;
      saveRegistration(state.registration);
    },

    prevRegstraionStep: (state) => {
      if (state.registration.currentStep > 1) {
        state.registration.currentStep -= 1;
        saveRegistration(state.registration);
      }
    },

    clearSellerRegistration: (state) => {
      state.registration = defaultRegistration;
      localStorage.removeItem("seller_registration");
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginSeller.fulfilled, (state, action) => {
        state.loading = false;
        state.seller = action.payload.seller;
        state.token = action.payload.token;
      })

      /* ================= OTP VERIFIED ================= */
      .addCase(sellerVerifyPhoneOtp.fulfilled, (state) => {
        state.registration.sellerData.verifyPhone = true;
        saveRegistration(state.registration);
      })

      .addCase(sellerVerifyEmailOtp.fulfilled, (state) => {
        state.registration.sellerData.verifyEmail = true;
        saveRegistration(state.registration);
      })

      /* ================= FINAL REGISTRATION ================= */
      .addCase(sellerRegistration.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.register = true;
        localStorage.removeItem("seller_registration");
      })

      .addCase(sellerRegistration.rejected, (state, action) => {
        state.loading = false;

        if (action.payload?.type === "validation") {
          state.registration.fieldError = action.payload.errors;
          return;
        }

        state.error = action.payload?.message || action.payload;
      });
  },
});

export const {
  logoutSeller,
  updateSellerRegistrationField,
  setRegistrationError,
  nextRegistraionStep,
  prevRegstraionStep,
  setStepValid,
  clearSellerRegistration,
} = sellerSlice.actions;

export default sellerSlice.reducer;

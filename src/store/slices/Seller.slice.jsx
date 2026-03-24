
// //ansh aaj ka code 6-01-2026

// import { createSlice } from "@reduxjs/toolkit";
// import {
//   loginSeller,
//   selleSendOtpForgetPassword,
//   sellerForgetPasswordVerifyOtp,
//   sellerResetPassword,
//   sellerPhoneVerificatioBySendOtp,
//   sellerVerifyPhoneOtp,
//   sellerEmailVerificationBySendOtp,
//   sellerVerifyEmailOtp,
//   sellerRegistration,
//   getAllSeller,
//   getSingleSeller,
//   ApprovedSeller,
//   RejectSeller,
//   getApprovedAndRejectCount
// } from "../actions/SellerAction";

// const sellerSlice = createSlice({
//   name: "seller",
//   initialState: {
//     seller: null,
//     allSellers: [],
//     token: null,
//     loading: false,
//     error: null,
//     success: false,
//     register: false,
//     singleSeller: null,
//     StatusCount: [],

//     registration: {
//       currentStep: 1,
//       sellerData: {
//         phone: "",
//         email: "",
//         fullname: "",
//         password: "",
//         verifyPhone: false,
//         verifyEmail: false,
//         gst_no: "",
//         organisation_email: "",
//         primary_contact_person_name: "",
//         primary_contact_person_phone: "",
//         primary_contact_person_email: "",
//         company_name: "",
//         owner_name: "",
//         owner_email: "",
//         owner_phone: "",
//         branch_name: "",
//         branch_address: "",
//         branch_city: "",
//         branch_state: "",
//         branch_pincode: "",
//         warehouse_pincode: "",
//         warehouse_state: "",
//         warehouse_full_address: "",
//         warehouse_order_procising_capacity: "",
//         bank_account_holder_name: "",
//         pan_number: "",
//         bank_account_no: "",
//         bank_IFCS: "",
//         bank_name: "",
//         account_type: "",
//         nature_of_business: "",
//         business_category: "",
//         declaration: false,
//       },
//       fieldError: {}
//     },
//   },
//   reducers: {
//     logoutSeller: (state) => {
//       state.seller = null;
//       state.token = null;
//     },
//     updateSellerRegistrationField: (state, action) => {
//       const { field, value } = action.payload;
//       state.registration.sellerData[field] = value;

//       // 🔥 AUTO CLEAR ERROR ON TYPE
//       if (state.registration.fieldError[field]) {
//         delete state.registration.fieldError[field];
//       }
//     },
//     setRegistrationError: (state, action) => {
//       state.registration.fieldError = {
//         ...state.registration.fieldError,
//         ...action.payload,
//       };
//     },
//     nextRegistraionStep: (state) => {
//       state.registration.currentStep += 1;
//     },
//     prevRegstraionStep: (state) => {
//       state.registration.currentStep -= 1
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(loginSeller.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginSeller.fulfilled, (state, action) => {
//         (state.loading = false), (state.seller = action.payload.seller);
//         state.token = action.payload.token;
//       })
//       .addCase(loginSeller.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(selleSendOtpForgetPassword.pending, (state) => {
//         state.error = null;
//       })
//       .addCase(selleSendOtpForgetPassword.fulfilled, (state) => {
//         state.loading = false;
//       })
//       .addCase(selleSendOtpForgetPassword.rejected, (state, action) => {
//         (state.loading = false), (state.error = action.payload);
//       })
//       .addCase(sellerForgetPasswordVerifyOtp.pending, (state) => {
//         state.error = null;
//       })
//       .addCase(sellerForgetPasswordVerifyOtp.fulfilled, (state) => {
//         state.loading = false;
//       })
//       .addCase(sellerForgetPasswordVerifyOtp.rejected, (state, action) => {
//         (state.loading = false), (state.error = action.payload);
//       })
//       .addCase(sellerResetPassword.pending, (state) => {
//         state.error = false;
//       })
//       .addCase(sellerResetPassword.fulfilled, (state) => {
//         state.loading = false;
//       })
//       .addCase(sellerResetPassword.rejected, (state, action) => {
//         (state.loading = false), (state.error = action.payload);
//       })
//       .addCase(sellerPhoneVerificatioBySendOtp.pending, (state) => {
//         state.loading = false;
//       })
//       .addCase(sellerPhoneVerificatioBySendOtp.fulfilled, (state) => {
//         state.loading = false;
//         state.success = true;
//       })
//       .addCase(sellerPhoneVerificatioBySendOtp.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(sellerVerifyPhoneOtp.pending, (state) => {
//         state.loading = false;
//       })
//       .addCase(sellerVerifyPhoneOtp.fulfilled, (state) => {
//         state.loading = false;
//         state.success = true;
//         state.registration.sellerData.verifyPhone = true;
//       })
//       .addCase(sellerVerifyPhoneOtp.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(sellerEmailVerificationBySendOtp.pending, (state) => {
//         state.loading = false;
//       })
//       .addCase(sellerEmailVerificationBySendOtp.fulfilled, (state) => {
//         state.loading = false;
//         state.success = true;
//       })
//       .addCase(sellerEmailVerificationBySendOtp.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(sellerVerifyEmailOtp.pending, (state) => {
//         state.loading = false;
//       })
//       .addCase(sellerVerifyEmailOtp.fulfilled, (state) => {
//         state.loading = false;
//         state.success = true;
//         state.registration.sellerData.verifyEmail = true;
//       })
//       .addCase(sellerVerifyEmailOtp.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       .addCase(sellerRegistration.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(sellerRegistration.fulfilled, (state) => {
//         state.loading = false;
//         state.success = true;
//         state.register = true;
//       })


//       .addCase(sellerRegistration.rejected, (state, action) => {
//         state.loading = false;

//         // 🔥 BACKEND FIELD VALIDATION
//         if (action.payload?.type === "validation") {
//           // 🔥 backend already object bhej raha hai
//           state.registration.fieldError = action.payload.errors;
//           state.error = null;
//           return;
//         }

//         // 🔥 NORMAL ERROR
//         state.error = action.payload?.message || action.payload;
//       })


//       .addCase(getAllSeller.pending, (state) => {
//         state.loading = false;
//       })
//       .addCase(getAllSeller.fulfilled, (state, action) => {
//         state.loading = false;
//         state.allSellers = action.payload.allSellerData
//       })
//       .addCase(getAllSeller.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(getSingleSeller.pending, (state) => {
//         state.loading = false;
//       })
//       .addCase(getSingleSeller.fulfilled, (state, action) => {
//         state.loading = false;
//         state.singleSeller = action.payload.seller[0]
//       })
//       .addCase(getSingleSeller.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(ApprovedSeller.pending, (state) => {
//         state.loading = false;
//       })
//       .addCase(ApprovedSeller.fulfilled, (state) => {
//         state.loading = false;
//       })
//       .addCase(ApprovedSeller.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(RejectSeller.pending, (state) => {
//         state.loading = false;
//       })
//       .addCase(RejectSeller.fulfilled, (state) => {
//         state.loading = false;
//       })
//       .addCase(RejectSeller.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(getApprovedAndRejectCount.pending, (state) => {
//         state.loading = false;
//       })
//       .addCase(getApprovedAndRejectCount.fulfilled, (state, action) => {
//         state.loading = false;
//         state.StatusCount = action.payload
//       })
//       .addCase(getApprovedAndRejectCount.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });


// export const { logoutSeller, updateSellerRegistrationField, setRegistrationError, nextRegistraionStep, prevRegstraionStep } = sellerSlice.actions;
// export default sellerSlice.reducer;


// Ashish Dhimaan ka current code 8-01-2026
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
  getApprovedAndRejectCount
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
    }
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
  clearSellerRegistration
} = sellerSlice.actions;

export default sellerSlice.reducer;

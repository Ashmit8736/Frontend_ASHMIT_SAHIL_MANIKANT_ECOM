// Ashish Dhimaan – FINAL ALIGNED STEP-3 (BANKING)

import React, { useEffect, useState, useRef } from "react";
import style from "./BankingDetail.module.css";
import { RiSecurePaymentFill } from "react-icons/ri";
import { MdErrorOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  updateSellerRegistrationField,
  setStepValid,
} from "../../../store/slices/Seller.slice";

/* ================= VALIDATORS ================= */
const isMin = (v, n = 3) => v && v.trim().length >= n;
const isPAN = (v) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v);
const isIFSC = (v) => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(v);
const isPincode = (v) => /^[0-9]{6}$/.test(v);
const isAccount = (v) => /^[0-9]{9,18}$/.test(v);

const BankingDetails = () => {
  const dispatch = useDispatch();
  const sellerData = useSelector(
    (state) => state.seller.registration.sellerData
  );

  /* 🔐 LOCAL STORAGE KEY (STEP-3) */
  const LS_KEY = "seller_signup_step3";

  const saveToLocal = (data) =>
    localStorage.setItem(LS_KEY, JSON.stringify(data));

  const getFromLocal = () => {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY)) || null;
    } catch {
      return null;
    }
  };

  /* 🔥 ENTER FLOW REFS */
  const refs = {
    holder: useRef(),
    pan: useRef(),
    bank: useRef(),
    branch: useRef(),
    type: useRef(),
    acc: useRef(),
    confirm: useRef(),
    ifsc: useRef(),
    pin: useRef(),
    address: useRef(),
    city: useRef(),
    state: useRef(),
  };

  const [accountNo, setAccountNo] = useState(
    sellerData.bank_account_no || ""
  );
  const [confirmAcc, setConfirmAcc] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  /* ================= VALIDATE ================= */
  const validate = (field, value) => {
    let msg = "";

    switch (field) {
      case "bank_account_holder_name":
      case "bank_name":
      case "branch_name":
      case "branch_city":
      case "branch_state":
        if (!isMin(value)) msg = "Minimum 3 characters required";
        break;

      case "branch_address":
        if (!isMin(value, 5)) msg = "Enter full branch address";
        break;

      case "account_type":
        if (!value) msg = "Account type required";
        break;

      case "pan_number":
        if (!isPAN(value)) msg = "Invalid PAN format";
        break;

      case "bank_account_no":
        if (!isAccount(value)) msg = "Invalid account number";
        break;

      case "confirm_account":
        if (value !== accountNo) msg = "Account numbers do not match";
        break;

      case "bank_IFCS":
        if (!isIFSC(value)) msg = "Invalid IFSC code";
        break;

      case "branch_pincode":
        if (!isPincode(value)) msg = "Invalid pincode";
        break;

      default:
        break;
    }

    setErrors((p) => ({ ...p, [field]: msg }));
    return msg === "";
  };

  const handle = (field, value) => {
    dispatch(updateSellerRegistrationField({ field, value }));
    validate(field, value);
  };

  const markTouched = (field) =>
    setTouched((p) => ({ ...p, [field]: true }));

  const hint = (field, ok) =>
    touched[field] && errors[field] ? (
      <span className={style.errorText}>{errors[field]}</span>
    ) : (
      <span className={style.successText}>{ok}</span>
    );

  /* ================= AUTO SAVE ================= */
  useEffect(() => {
    saveToLocal({
      ...sellerData,
      bank_account_no: accountNo,
      confirmAcc,
    });
  }, [sellerData, accountNo, confirmAcc]);

  /* ================= RESTORE ================= */
  useEffect(() => {
    const saved = getFromLocal();
    if (!saved) return;

    Object.entries(saved).forEach(([k, v]) =>
      dispatch(updateSellerRegistrationField({ field: k, value: v }))
    );

    if (saved.bank_account_no) setAccountNo(saved.bank_account_no);
    if (saved.confirmAcc) setConfirmAcc(saved.confirmAcc);
  }, [dispatch]);

  /* ================= STEP VALID ================= */
  useEffect(() => {
    const valid =
      isMin(sellerData.bank_account_holder_name) &&
      isPAN(sellerData.pan_number) &&
      isMin(sellerData.bank_name) &&
      isMin(sellerData.branch_name) &&
      sellerData.account_type &&
      isAccount(sellerData.bank_account_no) &&
      isIFSC(sellerData.bank_IFCS) &&
      isPincode(sellerData.branch_pincode) &&
      isMin(sellerData.branch_address, 5) &&
      isMin(sellerData.branch_city) &&
      isMin(sellerData.branch_state) &&
      confirmAcc === sellerData.bank_account_no;

    dispatch(setStepValid({ step: "banking", value: valid }));
  }, [sellerData, confirmAcc, dispatch]);

  const next = (e, ref) => {
    if (e.key === "Enter") {
      e.preventDefault();
      ref?.current?.focus();
    }
  };

  /* ================= JSX ================= */
  return (
    <div className={style.BankingDetailsContainer}>
      <header className={style.heading}>
        <h2>Banking Information</h2>
        <p>Provide your business bank account details</p>
      </header>

      <section className={style.lastSection}>
        <RiSecurePaymentFill className={style.secureIcon} />
        <div>
          <h2>Your banking information is secure</h2>
          <span>Encrypted with bank-level security</span>
        </div>
      </section>

      {/* ACCOUNT HOLDER */}
      <section className={style.UsernameSection}>
        <p>Account Holder Information</p>

        <input
          ref={refs.holder}
          value={sellerData.bank_account_holder_name || ""}
          placeholder="Account Holder Name"
          onChange={(e) =>
            handle("bank_account_holder_name", e.target.value)
          }
          onBlur={() => markTouched("bank_account_holder_name")}
          onKeyDown={(e) => next(e, refs.pan)}
        />
        {hint("bank_account_holder_name", "Looks good")}

        <input
          ref={refs.pan}
          value={sellerData.pan_number || ""}
          placeholder="PAN Number"
          onChange={(e) =>
            handle("pan_number", e.target.value.toUpperCase())
          }
          onBlur={() => markTouched("pan_number")}
          onKeyDown={(e) => next(e, refs.bank)}
        />
        {hint("pan_number", "Valid PAN")}
      </section>

      {/* BANK */}
      <section className={style.UsernameSection}>
        <p>Bank Account Details</p>

        <input
          ref={refs.bank}
          value={sellerData.bank_name || ""}
          placeholder="Bank Name"
          onChange={(e) => handle("bank_name", e.target.value)}
          onBlur={() => markTouched("bank_name")}
          onKeyDown={(e) => next(e, refs.branch)}
        />
        {hint("bank_name", "Bank name ok")}

        <input
          ref={refs.branch}
          value={sellerData.branch_name || ""}
          placeholder="Branch Name"
          onChange={(e) => handle("branch_name", e.target.value)}
          onBlur={() => markTouched("branch_name")}
          onKeyDown={(e) => next(e, refs.type)}
        />
        {hint("branch_name", "Branch name ok")}

        <select
          ref={refs.type}
          value={sellerData.account_type || ""}
          onChange={(e) => handle("account_type", e.target.value)}
          onBlur={() => markTouched("account_type")}
          onKeyDown={(e) => next(e, refs.acc)}
        >
          <option value="">Account Type</option>
          <option value="saving">Saving</option>
          <option value="current">Current</option>
        </select>
        {hint("account_type", "Selected")}

        <input
          ref={refs.acc}
          value={accountNo}
          placeholder="Account Number"
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, "");
            setAccountNo(v);
            handle("bank_account_no", v);
          }}
          onKeyDown={(e) => next(e, refs.confirm)}
        />
        {hint("bank_account_no", "Valid account")}

        <input
          ref={refs.confirm}
          value={confirmAcc}
          placeholder="Confirm Account Number"
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, "");
            setConfirmAcc(v);
            validate("confirm_account", v);
          }}
          onBlur={() => markTouched("confirm_account")}
          onKeyDown={(e) => next(e, refs.ifsc)}
        />
        {touched.confirm_account && errors.confirm_account && (
          <span className={style.errorText}>{errors.confirm_account}</span>
        )}

        <input
          ref={refs.ifsc}
          value={sellerData.bank_IFCS || ""}
          placeholder="IFSC Code"
          onChange={(e) =>
            handle("bank_IFCS", e.target.value.toUpperCase())
          }
          onBlur={() => markTouched("bank_IFCS")}
          onKeyDown={(e) => next(e, refs.pin)}
        />
        {hint("bank_IFCS", "IFSC valid")}

        <input
          ref={refs.pin}
          value={sellerData.branch_pincode || ""}
          placeholder="Branch Pincode"
          maxLength={6}
          onChange={(e) =>
            handle("branch_pincode", e.target.value.replace(/\D/g, ""))
          }
          onBlur={() => markTouched("branch_pincode")}
          onKeyDown={(e) => next(e, refs.address)}
        />
        {hint("branch_pincode", "Valid pincode")}
      </section>

      {/* ADDRESS */}
      <section className={style.UsernameSection}>
        <p>Branch Address</p>

        <input
          ref={refs.address}
          value={sellerData.branch_address || ""}
          placeholder="Full Address"
          onChange={(e) => handle("branch_address", e.target.value)}
          onBlur={() => markTouched("branch_address")}
          onKeyDown={(e) => next(e, refs.city)}
        />
        {hint("branch_address", "Looks good")}

        <input
          ref={refs.city}
          value={sellerData.branch_city || ""}
          placeholder="City"
          onChange={(e) => handle("branch_city", e.target.value)}
          onBlur={() => markTouched("branch_city")}
          onKeyDown={(e) => next(e, refs.state)}
        />
        {hint("branch_city", "Looks good")}

        <input
          ref={refs.state}
          value={sellerData.branch_state || ""}
          placeholder="State"
          onChange={(e) => handle("branch_state", e.target.value)}
          onBlur={() => markTouched("branch_state")}
        />
        {hint("branch_state", "Looks good")}
      </section>

      <section className={style.warningSection}>
        <MdErrorOutline className={style.secureIcon} />
        <div>
          <h2>Important</h2>
          <span>Please verify your bank details carefully</span>
        </div>
      </section>
    </div>
  );
};

export default BankingDetails;

// FINAL FIXED VERSION – READY FOR TESTING


// import React, { useEffect, useState, useRef } from "react";
// import style from "./BankingDetail.module.css";
// import { RiSecurePaymentFill } from "react-icons/ri";
// import { MdErrorOutline } from "react-icons/md";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   updateSellerRegistrationField,
//   setStepValid,
// } from "../../../store/slices/Seller.slice";

// /* ================= STORAGE ================= */
// const STORAGE_KEY = "seller_banking_details";

// /* ================= VALIDATORS ================= */
// const isMin = (v, n = 3) => v && v.trim().length >= n;
// const isPAN = (v) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v);
// const isIFSC = (v) => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(v);
// const isPincode = (v) => /^[0-9]{6}$/.test(v);
// const isAccount = (v) => /^[0-9]{9,18}$/.test(v);

// /* ================= HELPERS ================= */
// const normalize = (v) =>
//   v === null || v === undefined ? "" : v.toString();

// const isBlank = (v) => normalize(v).trim() === "";

// const BankingDetails = () => {
//   const dispatch = useDispatch();
//   const sellerData = useSelector(
//     (state) => state.seller.registration.sellerData
//   );

//   const onlyText = (v, max = 40) =>
//     v.replace(/[^A-Za-z ]/g, "").replace(/\s+/g, " ").slice(0, max);

//   const onlyNumber = (v, max = 18) =>
//     v.replace(/\D/g, "").slice(0, max);

//   /* 🔥 ENTER FLOW REFS */
//   const refs = {
//     holder: useRef(),
//     pan: useRef(),
//     bank: useRef(),
//     branch: useRef(),
//     type: useRef(),
//     acc: useRef(),
//     confirm: useRef(),
//     ifsc: useRef(),
//     pin: useRef(),
//     address: useRef(),
//     city: useRef(),
//     state: useRef(),
//   };

//   const [accountNo, setAccountNo] = useState("");
//   const [confirmAcc, setConfirmAcc] = useState("");
//   const [errors, setErrors] = useState({});
//   const [touched, setTouched] = useState({});

//   /* ================= 🔥 RESTORE ================= */
//   useEffect(() => {
//     const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
//     if (!saved) return;

//     Object.entries(saved).forEach(([field, value]) => {
//       if (value !== undefined && value !== null) {
//         dispatch(updateSellerRegistrationField({ field, value }));
//       }
//     });

//     if (saved.bank_account_no) setAccountNo(saved.bank_account_no);
//     if (saved.confirm_account) setConfirmAcc(saved.confirm_account);
//   }, [dispatch]);

//   /* ================= 🔥 AUTO SAVE ================= */
//   useEffect(() => {
//     localStorage.setItem(
//       STORAGE_KEY,
//       JSON.stringify({
//         bank_account_holder_name: sellerData.bank_account_holder_name,
//         pan_number: sellerData.pan_number,
//         bank_name: sellerData.bank_name,
//         branch_name: sellerData.branch_name,
//         account_type: sellerData.account_type,
//         bank_account_no: sellerData.bank_account_no,
//         confirm_account: confirmAcc,
//         bank_IFCS: sellerData.bank_IFCS,
//         branch_pincode: sellerData.branch_pincode,
//         branch_address: sellerData.branch_address,
//         branch_city: sellerData.branch_city,
//         branch_state: sellerData.branch_state,
//       })
//     );
//   }, [sellerData, confirmAcc]);

//   /* ================= VALIDATE ================= */
//   const validate = (field, value) => {
//     let msg = "";

//     switch (field) {
//       case "bank_account_holder_name":
//       case "bank_name":
//       case "branch_name":
//       case "branch_city":
//       case "branch_state":
//         if (isBlank(value) || !isMin(value))
//           msg = "Minimum 3 characters required";
//         break;

//       case "branch_address":
//         if (isBlank(value) || !isMin(value, 5))
//           msg = "Enter full branch address";
//         break;

//       case "account_type":
//         if (isBlank(value)) msg = "Account type required";
//         break;

//       case "pan_number":
//         if (!isPAN(value)) msg = "Invalid PAN format";
//         break;

//       case "bank_account_no":
//         if (!isAccount(value)) msg = "Invalid account number";
//         break;

//       case "confirm_account":
//         if (value !== accountNo) msg = "Account numbers do not match";
//         break;

//       case "bank_IFCS":
//         if (!isIFSC(value)) msg = "Invalid IFSC code";
//         break;

//       case "branch_pincode":
//         if (!isPincode(value)) msg = "Invalid pincode";
//         break;
//     }

//     setErrors((p) => ({ ...p, [field]: msg }));
//     return msg === "";
//   };

//   const handle = (field, value) => {
//     const raw = normalize(value);
//     dispatch(updateSellerRegistrationField({ field, value: raw }));

//     if (touched[field]) validate(field, raw);
//   };

//   const markTouched = (field) =>
//     setTouched((p) => ({ ...p, [field]: true }));

//   const hint = (field, ok) =>
//     touched[field] && errors[field] ? (
//       <span className={style.errorText}>{errors[field]}</span>
//     ) : (
//       <span className={style.successText}>{ok}</span>
//     );

//   /* ================= 🔥 STEP VALID ================= */
//   useEffect(() => {
//     const valid =
//       isMin(sellerData.bank_account_holder_name) &&
//       isPAN(sellerData.pan_number) &&
//       isAccount(sellerData.bank_account_no) &&
//       confirmAcc === sellerData.bank_account_no &&
//       isIFSC(sellerData.bank_IFCS) &&
//       isMin(sellerData.bank_name) &&
//       isMin(sellerData.branch_name) &&
//       isMin(sellerData.branch_address, 5) &&
//       isMin(sellerData.branch_city) &&
//       isMin(sellerData.branch_state) &&
//       isPincode(sellerData.branch_pincode) &&
//       !!sellerData.account_type;

//     dispatch(setStepValid({ step: "banking", value: valid }));
//   }, [sellerData, confirmAcc, dispatch]);

//   const next = (e, ref) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       ref?.current?.focus();
//     }
//   };



//   /* ================= JSX ================= */
//   return (
//     <div className={style.BankingDetailsContainer}>
//       <header className={style.heading}>
//         <h2>Banking Information</h2>
//         <p>Provide your business bank account details</p>
//       </header>

//       <section className={style.lastSection}>
//         <RiSecurePaymentFill className={style.secureIcon} />
//         <div>
//           <h2>Your banking information is secure</h2>
//           <span>Encrypted with bank-level security</span>
//         </div>
//       </section>

//       {/* ACCOUNT HOLDER */}
//       <section className={style.UsernameSection}>
//         <p>Account Holder Information</p>

//         <input
//           ref={refs.holder}
//           value={sellerData.bank_account_holder_name || ""}
//           placeholder="Account Holder Name"
//           onChange={(e) => {
//             const v = onlyText(e.target.value, 40);
//             handle("bank_account_holder_name", v);
//           }}
//           onBlur={() => markTouched("bank_account_holder_name")}
//           onKeyDown={(e) => next(e, refs.pan)}
//         />

//         {hint("bank_account_holder_name", "Looks good")}

//         <input
//           ref={refs.pan}
//           value={sellerData.pan_number || ""}
//           placeholder="PAN Number"
//           maxLength={10}
//           onChange={(e) => {
//             const v = e.target.value
//               .toUpperCase()           // 🔒 force CAPS
//               .replace(/[^A-Z0-9]/g, "") // ❌ no symbols
//               .slice(0, 10);           // 🔢 limit 10

//             handle("pan_number", v);
//           }}
//           onBlur={() => markTouched("pan_number")}
//           onKeyDown={(e) => next(e, refs.bank)}
//         />
//         {hint("pan_number", "Valid PAN")}
//       </section>

//       {/* BANK */}
//       <section className={style.UsernameSection}>
//         <p>Bank Account Details</p>

//         <input
//           ref={refs.bank}
//           value={sellerData.bank_name || ""}
//           placeholder="Bank Name"
//           onChange={(e) => {
//             const v = e.target.value
//               .replace(/[^A-Za-z ]/g, "")   // ❌ numbers / symbols block
//               .replace(/\s+/g, " ")         // extra spaces remove
//               .slice(0, 40);                // max length

//             handle("bank_name", v);
//           }}
//           onBlur={() => markTouched("bank_name")}
//           onKeyDown={(e) => next(e, refs.branch)}
//         />
//         {hint("bank_name", "Bank name ok")}

//         <input
//           ref={refs.branch}
//           value={sellerData.branch_name || ""}
//           placeholder="Branch Name"
//           onChange={(e) => {
//             const v = e.target.value
//               .replace(/[^A-Za-z ]/g, "") // ❌ no numbers/symbols
//               .replace(/\s+/g, " ")       // 🧹 extra spaces remove
//               .slice(0, 40);              // 🔢 max length

//             handle("branch_name", v);
//           }}
//           onBlur={() => markTouched("branch_name")}
//           onKeyDown={(e) => next(e, refs.type)}
//         />

//         {hint("branch_name", "Branch name ok")}

//         <select
//           ref={refs.type}
//           defaultValue={sellerData.account_type || ""}
//           onBlur={(e) => {
//             markTouched("account_type");
//             handle("account_type", e.target.value);
//           }}
//           onKeyDown={(e) => next(e, refs.acc)}
//         >
//           <option value="">Account Type</option>
//           <option value="saving">Saving</option>
//           <option value="current">Current</option>
//         </select>
//         {hint("account_type", "Selected")}

//         <input
//           ref={refs.acc} // ✅ UPDATED
//           value={accountNo} // ✅ UPDATED
//           placeholder="Account Number"
//           onChange={(e) => {
//             const v = onlyNumber(e.target.value, 18);
//             setAccountNo(v);
//             handle("bank_account_no", v); // ✅ IMPORTANT
//           }}
//           onBlur={() => markTouched("bank_account_no")}
//           onKeyDown={(e) => next(e, refs.confirm)}
//         />

//         {hint("bank_account_no", "Valid account")}

//         <input
//           ref={refs.confirm}
//           value={confirmAcc}
//           placeholder="Confirm Account Number"
//           onBlur={() => {
//             markTouched("confirm_account");
//             validate("confirm_account", confirmAcc);
//           }}
//           onChange={(e) => {
//             const v = onlyNumber(e.target.value, 18);
//             setConfirmAcc(v);
//             validate("confirm_account", v);
//           }}
//           onKeyDown={(e) => next(e, refs.ifsc)}
//         />

//         {touched.confirm_account && errors.confirm_account && (
//           <span className={style.errorText}>{errors.confirm_account}</span>
//         )}

//         <input
//           ref={refs.ifsc}
//           value={sellerData.bank_IFCS || ""}
//           placeholder="IFSC Code (e.g. HDFC0001234)"
//           maxLength={11}
//           onChange={(e) => {
//             let v = e.target.value
//               .toUpperCase()
//               .replace(/[^A-Z0-9]/g, "");

//             // force 5th character = 0
//             if (v.length === 5 && v[4] !== "0") {
//               v = v.slice(0, 4) + "0";
//             }

//             handle("bank_IFCS", v);
//           }}
//           onBlur={() => markTouched("bank_IFCS")}
//           onKeyDown={(e) => next(e, refs.pin)}
//         />
//         {hint("bank_IFCS", "IFSC valid")}

//         <input
//           ref={refs.pin}
//           value={sellerData.branch_pincode || ""}
//           placeholder="Branch Pincode"
//           maxLength={6}
//           inputMode="numeric"
//           onChange={(e) => {
//             const v = e.target.value.replace(/\D/g, "").slice(0, 6);
//             handle("branch_pincode", v);
//           }}
//           onBlur={() => markTouched("branch_pincode")}
//           onKeyDown={(e) => next(e, refs.address)}
//         />
//         {hint("branch_pincode", "Valid pincode")}
//       </section>

//       {/* ADDRESS */}
//       <section className={style.UsernameSection}>
//         <p>Branch Address</p>

//         <input
//           ref={refs.address}
//           defaultValue={sellerData.branch_address}
//           placeholder="Full Address"
//           onBlur={(e) => {
//             markTouched("branch_address");
//             handle("branch_address", e.target.value);
//           }}
//           onKeyDown={(e) => next(e, refs.city)}
//         />
//         {hint("branch_address", "Looks good")}

//         <input
//           ref={refs.city}
//           value={sellerData.branch_city || ""}
//           placeholder="City"
//           onChange={(e) => {
//             const v = e.target.value
//               .replace(/[^A-Za-z ]/g, "")
//               .replace(/\s+/g, " ")
//               .slice(0, 30);

//             handle("branch_city", v);
//           }}
//           onBlur={() => markTouched("branch_city")}
//           onKeyDown={(e) => next(e, refs.state)}
//         />

//         {hint("branch_city", "Ok")}

//         <input
//           ref={refs.state}
//           value={sellerData.branch_state || ""}
//           placeholder="State"
//           onChange={(e) => {
//             const v = e.target.value
//               .replace(/[^A-Za-z ]/g, "")
//               .replace(/\s+/g, " ")
//               .slice(0, 30);

//             handle("branch_state", v);
//           }}
//           onBlur={() => markTouched("branch_state")}
//         />

//         {hint("branch_state", "Ok")}
//       </section>

//       <section className={style.warningSection}>
//         <MdErrorOutline className={style.secureIcon} />
//         <div>
//           <h2>Important</h2>
//           <span>Please verify your bank details carefully</span>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default BankingDetails;
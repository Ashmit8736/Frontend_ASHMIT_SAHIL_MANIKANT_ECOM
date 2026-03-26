
import React, { useState, useRef, useEffect } from "react";
import style from "./BusinessDetails.module.css";
import { MdOutlineVerified } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  updateSellerRegistrationField,
  setStepValid,
} from "../../../store/slices/Seller.slice";
import { toast } from "react-toastify";

/* ================= VALIDATORS ================= */
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isPhone = (v) => /^[0-9]{10}$/.test(v);
const isMin = (v, n = 3) => v && v.trim().length >= n;
const isGST = (v) => /^[A-Z0-9]{15}$/i.test(v);
const cleanEmail = (v) => normalize(v).toLowerCase();


const normalize = (v) =>
  v === undefined || v === null ? "" : v.toString();
const isBlank = (v) => normalize(v).trim() === "";

const cleanName = (v, max = 40) =>
  v
    .replace(/[^A-Za-z ]/g, "")
    .replace(/\s+/g, " ")
    .slice(0, max);


/* ================= COMPONENT ================= */
const BusinessDetails = () => {
  const dispatch = useDispatch();

  const sellerData = useSelector(
    (state) => state.seller.registration.sellerData
  );
  const LS_KEY = "seller_signup_step2";

  const saveToLocal = (data) => {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  };

  const getFromLocal = () => {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY)) || null;
    } catch {
      return null;
    }
  };

  /* ✅ STATES */
  const [gst, setGst] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  /* ================= HELPERS ================= */
  const markTouched = (field) => {
    setTouched((p) => ({ ...p, [field]: true }));
  };

  const hint = (field, okText) => {
    if (!touched[field]) return null;

    return errors[field] ? (
      <span className={style.errorText}>{errors[field]}</span>
    ) : (
      <span className={style.successText}>{okText}</span>
    );
  };

  /* ================= REFS ================= */
  const gstRef = useRef();
  const companyRef = useRef();
  const orgEmailRef = useRef();
  const natureRef = useRef();
  const categoryRef = useRef();
  const pcNameRef = useRef();
  const pcEmailRef = useRef();
  const pcPhoneRef = useRef();
  const ownerNameRef = useRef();
  const ownerEmailRef = useRef();
  const ownerPhoneRef = useRef();
  useEffect(() => {
    const valid =
      isGST(sellerData.gst_no) &&
      isEmail(sellerData.organisation_email) &&
      isMin(sellerData.company_name) &&
      isMin(sellerData.primary_contact_person_name) &&
      isEmail(sellerData.primary_contact_person_email) &&
      isPhone(sellerData.primary_contact_person_phone) &&
      isMin(sellerData.owner_name) &&
      isEmail(sellerData.owner_email) &&
      isPhone(sellerData.owner_phone) &&
      !!sellerData.nature_of_business &&
      !!sellerData.business_category;

    dispatch(setStepValid({ step: "business", value: valid }));
  }, [sellerData, dispatch]);
  /* ================= VALIDATION ================= */
  const validate = (field, value) => {
    let msg = "";

    switch (field) {
      case "gst_no":
        if (isBlank(value) || !isGST(value)) msg = "Invalid GST number";
        break;

      case "company_name":
      case "primary_contact_person_name":
      case "owner_name":
        if (isBlank(value) || !isMin(value))
          msg = "Minimum 3 characters required";
        break;

      case "organisation_email":
      case "primary_contact_person_email":
      case "owner_email":
        if (isBlank(value) || !isEmail(value))
          msg = "Invalid email address";
        break;

      case "primary_contact_person_phone":
      case "owner_phone":
        if (!isPhone(value)) msg = "Enter valid 10 digit phone";
        break;

      case "nature_of_business":
      case "business_category":
        if (isBlank(value)) msg = "This field is required";
        break;
    }

    setErrors((p) => ({ ...p, [field]: msg }));
    return msg === "";
  };

  /* ================= HANDLERS ================= */
  const handle = (field, value) => {
    const raw = normalize(value);
    dispatch(updateSellerRegistrationField({ field, value: raw }));
    validate(field, raw);
  };

  const handleGSTSubmit = (e) => {
    e.preventDefault();
    markTouched("gst_no");

    if (!validate("gst_no", gst)) return;

    dispatch(
      updateSellerRegistrationField({
        field: "gst_no",
        value: gst.trim().toUpperCase(),
      })
    );

    toast.success("GST number saved successfully");
    companyRef.current?.focus();
  };

  /* ================= 🔥 STEP VALID FIX (MAIN) ================= */
  useEffect(() => {
    saveToLocal({
      gst: gst,
      gst_no: sellerData.gst_no,
      organisation_email: sellerData.organisation_email,
      company_name: sellerData.company_name,
      primary_contact_person_name:
        sellerData.primary_contact_person_name,
      primary_contact_person_email:
        sellerData.primary_contact_person_email,
      primary_contact_person_phone:
        sellerData.primary_contact_person_phone,
      owner_name: sellerData.owner_name,
      owner_email: sellerData.owner_email,
      owner_phone: sellerData.owner_phone,
      nature_of_business: sellerData.nature_of_business,
      business_category: sellerData.business_category,
    });
  }, [gst, sellerData]);
  useEffect(() => {
    const saved = getFromLocal();
    if (!saved) return;

    // GST local state
    if (saved.gst) setGst(saved.gst);

    // Redux fields
    Object.entries(saved).forEach(([key, value]) => {
      if (key !== "gst") {
        dispatch(updateSellerRegistrationField({ field: key, value }));
      }
    });
  }, [dispatch]);
  /* ================= JSX ================= */
  return (
    <div className={style.BusinessDetailsContainer}>
      <header className={style.heading}>
        <h2>Business Details</h2>
        <p>Provide accurate business information</p>
      </header>

      {/* GST */}
      <section className={style.Verification}>
        <div className={style.IconsAndHeading}>
          <MdOutlineVerified className={style.Icon} />
          <h2>GST Verification</h2>
        </div>

        <form onSubmit={handleGSTSubmit}>
          <div className={style.Input}>
            <input
              ref={gstRef}
              placeholder="22AAAAA0000A1Z5"
              value={gst}
              maxLength={15}
              onChange={(e) => {
                const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
                setGst(val);
                handle("gst_no", val);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleGSTSubmit(e)}
            />
            {/* <button type="submit">
              <IoIosSearch /> Verify GST
            </button> */}
          </div>
          {hint("gst_no", "GST format looks correct")}
        </form>
      </section>

      {/* ORGANIZATION */}
      <section className={style.UsernameSection}>
        <p>Organization Details</p>

        <input
          placeholder="Company Name"
          maxLength={40}
          onChange={(e) =>
            handle("company_name", cleanName(e.target.value))
          }
          onPaste={(e) => {
            e.preventDefault();
            handle(
              "company_name",
              cleanName(e.clipboardData.getData("text"))
            );
          }}
          onBlur={() => markTouched("company_name")}
          onKeyDown={(e) => e.key === "Enter" && orgEmailRef.current?.focus()}
        />

        {hint("company_name", "Looks good")}

        <input
          placeholder="Organisation Email"
          onChange={(e) =>
            handle("organisation_email", cleanEmail(e.target.value))
          }
          onBlur={() => markTouched("organisation_email")}
        />
        {hint("organisation_email", "Valid email")}

        <select
          onChange={(e) => handle("nature_of_business", e.target.value)}
          onBlur={() => markTouched("nature_of_business")}
        >
          <option value="">Nature of business</option>
          <option value="wholesaler">Wholesaler</option>
          <option value="retailer">Retailer</option>
          <option value="distributor">Distributor</option>
          <option value="manufacturer">Manufacturer</option>
          <option value="other">Other</option>
        </select>
        {hint("nature_of_business", "Selected")}

        <select
          ref={categoryRef}
          onChange={(e) => handle("business_category", e.target.value)}
          onBlur={() => markTouched("business_category")}
        >
          <option value="">Business category</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="jewellery">Jewellery</option>
          <option value="shoes">Shoes</option>
          <option value="others">Others</option>
        </select>
        {hint("business_category", "Selected")}
      </section>

      {/* PRIMARY CONTACT */}
      <section className={style.UsernameSection}>
        <p>Primary Contact Person</p>

        <input
          ref={pcNameRef}
          placeholder="Name"
          maxLength={40}
          onChange={(e) =>
            handle(
              "primary_contact_person_name",
              cleanName(e.target.value)
            )
          }
          onPaste={(e) => {
            e.preventDefault();
            handle(
              "primary_contact_person_name",
              cleanName(e.clipboardData.getData("text"))
            );
          }}
          onBlur={() => markTouched("primary_contact_person_name")}
          onKeyDown={(e) => e.key === "Enter" && pcEmailRef.current?.focus()}
        />

        {hint("primary_contact_person_name", "Looks good")}

        <input
          ref={pcEmailRef}
          placeholder="Email"
          onChange={(e) =>
            handle("primary_contact_person_email", e.target.value)
          }
          onBlur={() => markTouched("primary_contact_person_email")}
        />
        {hint("primary_contact_person_email", "Valid email")}

        <input
          ref={pcPhoneRef}
          placeholder="Phone"
          maxLength={10}
          onChange={(e) =>
            handle(
              "primary_contact_person_phone",
              e.target.value.replace(/\D/g, "")
            )
          }
          onBlur={() => markTouched("primary_contact_person_phone")}
          onKeyDown={(e) => e.key === "Enter" && ownerNameRef.current?.focus()}
        />

        {hint("primary_contact_person_phone", "Valid phone")}
      </section>

      {/* OWNER */}
      <section className={style.UsernameSection}>
        <p>Owner Details</p>

        <input
          ref={ownerNameRef}
          placeholder="Owner Name"
          maxLength={40}
          onChange={(e) =>
            handle("owner_name", cleanName(e.target.value))
          }
          onPaste={(e) => {
            e.preventDefault();
            handle(
              "owner_name",
              cleanName(e.clipboardData.getData("text"))
            );
          }}
          onBlur={() => markTouched("owner_name")}
          onKeyDown={(e) => e.key === "Enter" && ownerEmailRef.current?.focus()}
        />

        {hint("owner_name", "Looks good")}

        <input
          ref={ownerEmailRef}
          placeholder="Owner Email"
          onChange={(e) => handle("owner_email", e.target.value)}
          onBlur={() => markTouched("owner_email")}
        />
        {hint("owner_email", "Valid email")}

        <input
          ref={ownerPhoneRef}
          placeholder="Owner Phone"
          maxLength={10}
          onChange={(e) =>
            handle("owner_phone", e.target.value.replace(/\D/g, ""))
          }
          onBlur={() => markTouched("owner_phone")}
        />
        {hint("owner_phone", "Valid phone")}
      </section>
    </div>
  );
};

export default BusinessDetails;


// curent code 

// import React, { useState, useRef, useEffect } from "react";
// import style from "./BusinessDetails.module.css";
// import { MdOutlineVerified } from "react-icons/md";
// import { IoIosSearch } from "react-icons/io";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   updateSellerRegistrationField,
//   setStepValid,
// } from "../../../store/slices/Seller.slice";
// import { toast } from "react-toastify";

// /* ================= STORAGE ================= */
// const STORAGE_KEY = "seller_business_details";

// /* ================= VALIDATORS ================= */
// const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
// const isPhone = (v) => /^[0-9]{10}$/.test(v);
// const isMin = (v, n = 3) => v && v.trim().length >= n;
// const isGST = (v) => /^[A-Z0-9]{15}$/i.test(v);
// const cleanEmail = (v) => normalize(v).toLowerCase();


// const normalize = (v) =>
//   v === undefined || v === null ? "" : v.toString();
// const isBlank = (v) => normalize(v).trim() === "";

// const cleanName = (v, max = 40) =>
//   v
//     .replace(/[^A-Za-z ]/g, "")
//     .replace(/\s+/g, " ")
//     .slice(0, max);


// /* ================= COMPONENT ================= */
// const BusinessDetails = () => {
//   const dispatch = useDispatch();

//   const sellerData = useSelector(
//     (state) => state.seller.registration.sellerData
//   );

//   /* ✅ STATES */
//   const [gst, setGst] = useState("");
//   const [errors, setErrors] = useState({});
//   const [touched, setTouched] = useState({});


//   /* ================= 🔥 LOAD SAVED DATA (NEW) ================= */
//   useEffect(() => {
//     const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
//     if (!saved) return;

//     Object.entries(saved).forEach(([field, value]) => {
//       if (value) {
//         dispatch(updateSellerRegistrationField({ field, value }));
//       }
//     });

//     if (saved.gst_no) setGst(saved.gst_no);
//   }, [dispatch]);

//   /* ================= 🔥 AUTO SAVE (NEW) ================= */
//   useEffect(() => {
//     localStorage.setItem(
//       STORAGE_KEY,
//       JSON.stringify({
//         gst_no: sellerData.gst_no,
//         company_name: sellerData.company_name,
//         organisation_email: sellerData.organisation_email,
//         nature_of_business: sellerData.nature_of_business,
//         business_category: sellerData.business_category,
//         primary_contact_person_name:
//           sellerData.primary_contact_person_name,
//         primary_contact_person_email:
//           sellerData.primary_contact_person_email,
//         primary_contact_person_phone:
//           sellerData.primary_contact_person_phone,
//         owner_name: sellerData.owner_name,
//         owner_email: sellerData.owner_email,
//         owner_phone: sellerData.owner_phone,
//       })
//     );
//   }, [sellerData]);

//   /* ================= HELPERS ================= */
//   const markTouched = (field) => {
//     setTouched((p) => ({ ...p, [field]: true }));
//   };

//   const hint = (field, okText) => {
//     if (!touched[field]) return null;

//     return errors[field] ? (
//       <span className={style.errorText}>{errors[field]}</span>
//     ) : (
//       <span className={style.successText}>{okText}</span>
//     );
//   };

//   /* ================= REFS ================= */
//   const gstRef = useRef();
//   const companyRef = useRef();
//   const orgEmailRef = useRef();
//   const natureRef = useRef();
//   const categoryRef = useRef();
//   const pcNameRef = useRef();
//   const pcEmailRef = useRef();
//   const pcPhoneRef = useRef();
//   const ownerNameRef = useRef();
//   const ownerEmailRef = useRef();
//   const ownerPhoneRef = useRef();

//   /* ================= VALIDATION ================= */
//   const validate = (field, value) => {
//     let msg = "";

//     switch (field) {
//       case "gst_no":
//         if (isBlank(value) || !isGST(value)) msg = "Invalid GST number";
//         break;

//       case "company_name":
//       case "primary_contact_person_name":
//       case "owner_name":
//         if (isBlank(value) || !isMin(value))
//           msg = "Minimum 3 characters required";
//         break;

//       case "organisation_email":
//       case "primary_contact_person_email":
//       case "owner_email":
//         if (isBlank(value) || !isEmail(value))
//           msg = "Invalid email address";
//         break;

//       case "primary_contact_person_phone":
//       case "owner_phone":
//         if (!isPhone(value)) msg = "Enter valid 10 digit phone";
//         break;

//       case "nature_of_business":
//       case "business_category":
//         if (isBlank(value)) msg = "This field is required";
//         break;
//     }

//     setErrors((p) => ({ ...p, [field]: msg }));
//     return msg === "";
//   };

//   /* ================= HANDLERS ================= */
//   const handle = (field, value) => {
//     const raw = normalize(value);
//     dispatch(updateSellerRegistrationField({ field, value: raw }));
//     validate(field, raw);
//   };

//   const handleGSTSubmit = (e) => {
//     e.preventDefault();
//     markTouched("gst_no");

//     if (!validate("gst_no", gst)) return;

//     dispatch(
//       updateSellerRegistrationField({
//         field: "gst_no",
//         value: gst.trim().toUpperCase(),
//       })
//     );

//     toast.success("GST number saved successfully");
//     companyRef.current?.focus();
//   };

//   /* ================= 🔥 STEP VALID FIX (MAIN) ================= */
//   useEffect(() => {
//     const valid =
//       isGST(sellerData.gst_no) &&
//       isEmail(sellerData.organisation_email) &&
//       isMin(sellerData.company_name) &&
//       isMin(sellerData.primary_contact_person_name) &&
//       isEmail(sellerData.primary_contact_person_email) &&
//       isPhone(sellerData.primary_contact_person_phone) &&
//       isMin(sellerData.owner_name) &&
//       isEmail(sellerData.owner_email) &&
//       isPhone(sellerData.owner_phone) &&
//       !!sellerData.nature_of_business &&
//       !!sellerData.business_category;

//     dispatch(setStepValid({ step: "business", value: valid }));
//   }, [sellerData, dispatch]);

//   /* ================= JSX ================= */
//   return (
//     <div className={style.BusinessDetailsContainer}>
//       <header className={style.heading}>
//         <h2>Business Details</h2>
//         <p>Provide accurate business information</p>
//       </header>

//       {/* GST */}
//       <section className={style.Verification}>
//         <div className={style.IconsAndHeading}>
//           <MdOutlineVerified className={style.Icon} />
//           <h2>GST Verification</h2>
//         </div>

//         <form onSubmit={handleGSTSubmit}>
//           <div className={style.Input}>
//             <input
//               ref={gstRef}
//               placeholder="22AAAAA0000A1Z5"
//               value={gst}
//               maxLength={15}
//               onChange={(e) => {
//                 const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
//                 setGst(val);
//                 handle("gst_no", val);
//               }}
//               onKeyDown={(e) => e.key === "Enter" && handleGSTSubmit(e)}
//             />
//             {/* <button type="submit">
//               <IoIosSearch /> Verify GST
//             </button> */}
//           </div>
//           {hint("gst_no", "GST format looks correct")}
//         </form>
//       </section>

//       {/* ORGANIZATION */}
//       <section className={style.UsernameSection}>
//         <p>Organization Details</p>

//         <input
//           placeholder="Company Name"
//           maxLength={40}
//           onChange={(e) =>
//             handle("company_name", cleanName(e.target.value))
//           }
//           onPaste={(e) => {
//             e.preventDefault();
//             handle(
//               "company_name",
//               cleanName(e.clipboardData.getData("text"))
//             );
//           }}
//           onBlur={() => markTouched("company_name")}
//           onKeyDown={(e) => e.key === "Enter" && orgEmailRef.current?.focus()}
//         />

//         {hint("company_name", "Looks good")}

//         <input
//           placeholder="Organisation Email"
//           onChange={(e) =>
//             handle("organisation_email", cleanEmail(e.target.value))
//           }
//           onBlur={() => markTouched("organisation_email")}
//         />
//         {hint("organisation_email", "Valid email")}

//         <select
//           onChange={(e) => handle("nature_of_business", e.target.value)}
//           onBlur={() => markTouched("nature_of_business")}
//         >
//           <option value="">Nature of business</option>
//           <option value="wholesaler">Wholesaler</option>
//           <option value="retailer">Retailer</option>
//           <option value="distributor">Distributor</option>
//           <option value="manufacturer">Manufacturer</option>
//           <option value="other">Other</option>
//         </select>
//         {hint("nature_of_business", "Selected")}

//         <select
//           ref={categoryRef}
//           onChange={(e) => handle("business_category", e.target.value)}
//           onBlur={() => markTouched("business_category")}
//         >
//           <option value="">Business category</option>
//           <option value="electronics">Electronics</option>
//           <option value="clothing">Clothing</option>
//           <option value="jewellery">Jewellery</option>
//           <option value="shoes">Shoes</option>
//           <option value="others">Others</option>
//         </select>
//         {hint("business_category", "Selected")}
//       </section>

//       {/* PRIMARY CONTACT */}
//       <section className={style.UsernameSection}>
//         <p>Primary Contact Person</p>

//         <input
//           ref={pcNameRef}
//           placeholder="Name"
//           maxLength={40}
//           onChange={(e) =>
//             handle(
//               "primary_contact_person_name",
//               cleanName(e.target.value)
//             )
//           }
//           onPaste={(e) => {
//             e.preventDefault();
//             handle(
//               "primary_contact_person_name",
//               cleanName(e.clipboardData.getData("text"))
//             );
//           }}
//           onBlur={() => markTouched("primary_contact_person_name")}
//           onKeyDown={(e) => e.key === "Enter" && pcEmailRef.current?.focus()}
//         />

//         {hint("primary_contact_person_name", "Looks good")}

//         <input
//           ref={pcEmailRef}
//           placeholder="Email"
//           onChange={(e) =>
//             handle("primary_contact_person_email", e.target.value)
//           }
//           onBlur={() => markTouched("primary_contact_person_email")}
//         />
//         {hint("primary_contact_person_email", "Valid email")}

//         <input
//           ref={pcPhoneRef}
//           placeholder="Phone"
//           maxLength={10}
//           onChange={(e) =>
//             handle(
//               "primary_contact_person_phone",
//               e.target.value.replace(/\D/g, "")
//             )
//           }
//           onBlur={() => markTouched("primary_contact_person_phone")}
//           onKeyDown={(e) => e.key === "Enter" && ownerNameRef.current?.focus()}
//         />

//         {hint("primary_contact_person_phone", "Valid phone")}
//       </section>

//       {/* OWNER */}
//       <section className={style.UsernameSection}>
//         <p>Owner Details</p>

//         <input
//           ref={ownerNameRef}
//           placeholder="Owner Name"
//           maxLength={40}
//           onChange={(e) =>
//             handle("owner_name", cleanName(e.target.value))
//           }
//           onPaste={(e) => {
//             e.preventDefault();
//             handle(
//               "owner_name",
//               cleanName(e.clipboardData.getData("text"))
//             );
//           }}
//           onBlur={() => markTouched("owner_name")}
//           onKeyDown={(e) => e.key === "Enter" && ownerEmailRef.current?.focus()}
//         />

//         {hint("owner_name", "Looks good")}

//         <input
//           ref={ownerEmailRef}
//           placeholder="Owner Email"
//           onChange={(e) => handle("owner_email", e.target.value)}
//           onBlur={() => markTouched("owner_email")}
//         />
//         {hint("owner_email", "Valid email")}

//         <input
//           ref={ownerPhoneRef}
//           placeholder="Owner Phone"
//           maxLength={10}
//           onChange={(e) =>
//             handle("owner_phone", e.target.value.replace(/\D/g, ""))
//           }
//           onBlur={() => markTouched("owner_phone")}
//         />
//         {hint("owner_phone", "Valid phone")}
//       </section>
//     </div>
//   );
// };

// export default BusinessDetails;
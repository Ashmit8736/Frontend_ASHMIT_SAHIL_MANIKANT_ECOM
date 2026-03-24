// import React from "react";
// import style from "./WareHouseDetails.module.css";
// import { LuWarehouse } from "react-icons/lu";
// import { MdOutlineLocationOn } from "react-icons/md";
// import { FaLocationDot } from "react-icons/fa6";
// import { useDispatch } from "react-redux";
// import {updateSellerRegistrationField} from "../../../store/slices/Seller.slice"

// const WareHouseDetails = () => {

//   const dispatch = useDispatch()

//   return (
//     <div className={style.WareHouseDetailsContainer}>
//       <header className={style.heading}>
//         <h2>Warehouse Information</h2>
//         <p>Provide information about your warehouse and storage facilities</p>
//       </header>

//       <section className={style.UsernameSection}>
//         <p><LuWarehouse className={style.icons}/> Warehouse Information</p>
//         <div className={style.UsernameForm}>
//           {/* <div className={style.UernameInput}>
//             <label>Warehouse Name*</label>
//             <input
//               type="text"
//               placeholder="Choose a unique username"
//             />
//           </div> */}
//           <div className={style.UsernamePassword}>
//             <div className={style.Password}>
//               <label>Warehouse Pincode</label>
//               <input type="text" placeholder="Enter a Pincode" 
//               onChange={(e) => dispatch(updateSellerRegistrationField({field:"warehouse_pincode",value:e.target.value}))}
//               />
//               <span>Write correct pincode</span>
//             </div>
//             <div className={style.Password}>
//               <label>state</label>
//               <input
//                 type="text"
//                 placeholder="eg., Maharashtra"
//                 onChange={(e) => dispatch(updateSellerRegistrationField({field:"warehouse_state",value:e.target.value}))}
//               />
//             </div>
//             <div className={style.Password}>
//               <label>Storage Capacity</label>
//               <input
//                 type="text"
//                 placeholder="eg., up to 500 unit"
//                 onChange={(e) => dispatch(updateSellerRegistrationField({field:"warehouse_order_procising_capacity",value:e.target.value}))}
//               />
//             </div>
//           </div>
//           <div className={style.UernameInput}>
//             <label><FaLocationDot className={style.icons}/>Complete addres*</label>
//             <input
//               type="text"
//               placeholder="Street address, building number ,landmarks"
//               onChange={(e) => dispatch(updateSellerRegistrationField({field:"warehouse_full_address",value:e.target.value}))}
//             />
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default WareHouseDetails;

// Ashish Dhimaan – FINAL STEP-4 (WAREHOUSE)

import React, { useState, useEffect, useRef } from "react";
import style from "./WareHouseDetails.module.css";
import { LuWarehouse } from "react-icons/lu";
import { FaLocationDot } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import {
  updateSellerRegistrationField,
  setStepValid,
} from "../../../store/slices/Seller.slice";

/* ================= VALIDATORS ================= */
const isPincode = (v) => /^[0-9]{6}$/.test(v);
const isMin = (v, n = 3) => v && v.trim().length >= n;
const isCapacity = (v) => /^[0-9]+$/.test(v);

const WareHouseDetails = () => {
  const dispatch = useDispatch();

  const {
    registration: { sellerData, fieldError },
  } = useSelector((state) => state.seller);

  /* 🔐 LOCAL STORAGE KEY (STEP-4) */
  const LS_KEY = "seller_signup_step4";

  const saveToLocal = (data) =>
    localStorage.setItem(LS_KEY, JSON.stringify(data));

  const getFromLocal = () => {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY)) || null;
    } catch {
      return null;
    }
  };

  const onlyText = (v, max = 40) =>
    v.replace(/[^A-Za-z ]/g, "").replace(/\s+/g, " ").slice(0, max);

  const onlyNumber = (v, max = 10) =>
    v.replace(/\D/g, "").slice(0, max);

  /* 🔥 ENTER FLOW REFS */
  const pinRef = useRef(null);
  const stateRef = useRef(null);
  const capacityRef = useRef(null);
  const addressRef = useRef(null);

  const {
    warehouse_pincode,
    warehouse_state,
    warehouse_order_procising_capacity,
    warehouse_full_address,
  } = sellerData;

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  /* ================= RESTORE ================= */
  useEffect(() => {
    const saved = getFromLocal();
    if (!saved) return;

    Object.entries(saved).forEach(([k, v]) => {
      dispatch(updateSellerRegistrationField({ field: k, value: v }));
    });
  }, [dispatch]);

  /* ================= AUTO SAVE ================= */
  useEffect(() => {
    saveToLocal({
      warehouse_pincode,
      warehouse_state,
      warehouse_order_procising_capacity,
      warehouse_full_address,
    });
  }, [
    warehouse_pincode,
    warehouse_state,
    warehouse_order_procising_capacity,
    warehouse_full_address,
  ]);

  /* ================= STEP VALID ================= */
  useEffect(() => {
    const valid =
      isPincode(warehouse_pincode) &&
      isMin(warehouse_state) &&
      isCapacity(warehouse_order_procising_capacity) &&
      isMin(warehouse_full_address, 5);

    dispatch(setStepValid({ step: "warehouse", value: valid }));
  }, [
    warehouse_pincode,
    warehouse_state,
    warehouse_order_procising_capacity,
    warehouse_full_address,
    dispatch,
  ]);

  /* ================= VALIDATION ================= */
  const validate = (field, value) => {
    let msg = "";

    switch (field) {
      case "warehouse_pincode":
        if (!isPincode(value)) msg = "Enter valid 6 digit pincode";
        break;
      case "warehouse_state":
        if (!isMin(value)) msg = "State is required";
        break;
      case "warehouse_order_procising_capacity":
        if (!isCapacity(value)) msg = "Enter numeric capacity";
        break;
      case "warehouse_full_address":
        if (!isMin(value, 5)) msg = "Enter complete address";
        break;
      default:
        break;
    }

    setErrors((p) => ({ ...p, [field]: msg }));
    return msg === "";
  };

  const handle = (field, value) => {
    const raw = value?.toString() || "";
    dispatch(updateSellerRegistrationField({ field, value: raw }));
    validate(field, raw);
  };

  const markTouched = (field) =>
    setTouched((p) => ({ ...p, [field]: true }));

  /* 🔥 ENTER → NEXT */
  const next = (e, ref) => {
    if (e.key === "Enter") {
      e.preventDefault();
      ref?.current?.focus();
    }
  };

  /* ================= UI ================= */
  return (
    <div className={style.WareHouseDetailsContainer}>
      <header className={style.heading}>
        <h2>Warehouse Information</h2>
        <p>Provide information about your warehouse and storage facilities</p>
      </header>

      <section className={style.UsernameSection}>
        <p>
          <LuWarehouse className={style.icons} /> Warehouse Information
        </p>

        <div className={style.UsernameForm}>
          <div className={style.UsernamePassword}>
            {/* PINCODE */}
            <div className={style.Password}>
              <label>Warehouse Pincode*</label>
              <input
                ref={pinRef}
                maxLength={6}
                value={warehouse_pincode || ""}
                onChange={(e) =>
                  handle(
                    "warehouse_pincode",
                    onlyNumber(e.target.value, 6)
                  )
                }
                onBlur={() => markTouched("warehouse_pincode")}
                onKeyDown={(e) => next(e, stateRef)}
              />

              {fieldError?.warehouse_pincode ||
                (touched.warehouse_pincode && errors.warehouse_pincode) ? (
                <span className={style.errorText}>
                  {fieldError?.warehouse_pincode || errors.warehouse_pincode}
                </span>
              ) : warehouse_pincode?.length === 6 ? (
                <span className={style.successText}>Valid pincode ✔</span>
              ) : (
                <span className={style.helperText}>
                  Enter 6 digit pincode
                </span>
              )}
            </div>

            {/* STATE */}
            <div className={style.Password}>
              <label>State*</label>
              <input
                ref={stateRef}
                value={warehouse_state || ""}
                onChange={(e) =>
                  handle(
                    "warehouse_state",
                    onlyText(e.target.value, 30)
                  )
                }
                onBlur={() => markTouched("warehouse_state")}
                onKeyDown={(e) => next(e, capacityRef)}
              />

              {fieldError?.warehouse_state ||
                (touched.warehouse_state && errors.warehouse_state) ? (
                <span className={style.errorText}>
                  {fieldError?.warehouse_state || errors.warehouse_state}
                </span>
              ) : warehouse_state ? (
                <span className={style.successText}>Looks good ✔</span>
              ) : (
                <span className={style.helperText}>
                  Enter warehouse state
                </span>
              )}
            </div>

            {/* CAPACITY */}
            <div className={style.Password}>
              <label>Storage Capacity*</label>
              <input
                ref={capacityRef}
                value={warehouse_order_procising_capacity || ""}
                onChange={(e) =>
                  handle(
                    "warehouse_order_procising_capacity",
                    onlyNumber(e.target.value, 7)
                  )
                }
                onBlur={() =>
                  markTouched("warehouse_order_procising_capacity")
                }
                onKeyDown={(e) => next(e, addressRef)}
              />

              {fieldError?.warehouse_order_procising_capacity ||
                (touched.warehouse_order_procising_capacity &&
                  errors.warehouse_order_procising_capacity) ? (
                <span className={style.errorText}>
                  {fieldError?.warehouse_order_procising_capacity ||
                    errors.warehouse_order_procising_capacity}
                </span>
              ) : warehouse_order_procising_capacity ? (
                <span className={style.successText}>Capacity added ✔</span>
              ) : (
                <span className={style.helperText}>
                  Example: 500 units
                </span>
              )}
            </div>
          </div>

          {/* ADDRESS */}
          <div className={style.UernameInput}>
            <label>
              <FaLocationDot className={style.icons} /> Complete Address*
            </label>
            <input
              ref={addressRef}
              value={warehouse_full_address || ""}
              onChange={(e) =>
                handle("warehouse_full_address", e.target.value)
              }
              onBlur={() => markTouched("warehouse_full_address")}
            />

            {fieldError?.warehouse_full_address ||
              (touched.warehouse_full_address &&
                errors.warehouse_full_address) ? (
              <span className={style.errorText}>
                {fieldError?.warehouse_full_address ||
                  errors.warehouse_full_address}
              </span>
            ) : warehouse_full_address?.length >= 5 ? (
              <span className={style.successText}>
                Address looks complete ✔
              </span>
            ) : (
              <span className={style.helperText}>
                Street, building, landmark
              </span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default WareHouseDetails;

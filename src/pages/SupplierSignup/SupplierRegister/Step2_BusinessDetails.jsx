


import { useState, useEffect } from "react";
import styles from "./Step2_BusinessDetails.module.css";

const isInvalid = (v) =>
  v === null || v === undefined || v.toString().trim() === "";

export default function Step2_BusinessDetails({ next,
  prev,
  updateData,
  formData, }) {

  const [data, setData] = useState({
    fullname: formData.fullname || "",
    company_name: formData.company_name || "",
    pincode: formData.pincode || "",
    city: formData.city || "",
    state: formData.state || "",
  });

  const [errors, setErrors] = useState({});

  /* 🔍 REGEX */
  const nameRegex = /^[A-Za-z ]+$/;
  const pincodeRegex = /^[0-9]{6}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* ================= RESTORE LOCAL DATA ================= */
  // useEffect(() => {
  //   const saved = localStorage.getItem("step2_business_details");
  //   if (!saved) return;
  //   setData(JSON.parse(saved));
  // }, []);

  // /* ================= SAVE LOCAL DATA ================= */
  // useEffect(() => {
  //   localStorage.setItem(
  //     "step2_business_details",
  //     JSON.stringify(data)
  //   );
  // }, [data]);
  useEffect(() => {
    setData({
      fullname: formData.fullname || "",
      company_name: formData.company_name || "",
      pincode: formData.pincode || "",
      city: formData.city || "",
      state: formData.state || "",
    });
  }, [formData]);
  /* ================= CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    let v = value;

    // 🔒 input restriction
    if (["fullname", "city", "state"].includes(name)) {
      v = v.replace(/[^A-Za-z ]/g, "");
    }

    if (name === "pincode") {
      v = v.replace(/\D/g, "").slice(0, 6);
    }

    setData((p) => ({ ...p, [name]: v }));

    /* LIVE VALIDATIONS */
    if (name === "fullname") {
      if (!v.trim()) {
        setErrors((p) => ({ ...p, fullname: "Name is required" }));
      } else if (!nameRegex.test(v)) {
        setErrors((p) => ({ ...p, fullname: "Only alphabets allowed" }));
      } else {
        setErrors((p) => ({ ...p, fullname: "" }));
      }
    }

    if (name === "pincode") {
      if (!pincodeRegex.test(v)) {
        setErrors((p) => ({ ...p, pincode: "Enter valid 6 digit pincode" }));
      } else {
        setErrors((p) => ({ ...p, pincode: "" }));
      }
    }

    // 🔒 email logic preserved (even if input is commented)
    if (name === "email") {
      if (!emailRegex.test(v)) {
        setErrors((p) => ({ ...p, email: "Enter valid email address" }));
      } else {
        setErrors((p) => ({ ...p, email: "" }));
      }
    }

    if (["company_name", "city", "state"].includes(name)) {
      setErrors((p) => ({
        ...p,
        [name]: v.trim() ? "" : "This field is required",
      }));
    }
  };

  /* ================= TRIM ON BLUR ================= */
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setData((p) => ({ ...p, [name]: value.trim() }));
  };

  /* ================= CONTINUE ================= */
  const handleContinue = (e) => {
    e.preventDefault();

    // 🔥 FIX: email ko tabhi validate karo jab wo exist karta ho
    const requiredFields = [
      "fullname",
      "company_name",
      "pincode",
      "city",
      "state",
      ...(data.email !== undefined ? ["email"] : []),
    ];

    for (let field of requiredFields) {
      if (isInvalid(data[field])) {
        alert(`${field.replace("_", " ")} cannot be empty`);
        return;
      }
    }

    if (Object.values(errors).some(Boolean)) {
      alert("Please fix validation errors");
      return;
    }

    const cleanData = Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, v.trim()])
    );

    updateData(cleanData);
    next();
  };

  return (
    <form className={styles.container} onSubmit={handleContinue}>
      <h2 className={styles.title}>Business Details</h2>
      <p className={styles.subtitle}>
        Tell us about your business to get started
      </p>

      <div className={styles.card}>
        {/* NAME */}
        <div className={styles.inputBox}>
          <label>Your Name *</label>
          <input
            name="fullname"
            value={data.fullname}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.fullname && (
            <p className={styles.error}>{errors.fullname}</p>
          )}
        </div>

        {/* COMPANY */}
        <div className={styles.inputBox}>
          <label>Company / Business Name *</label>
          <input
            name="company_name"
            value={data.company_name}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.company_name && (
            <p className={styles.error}>{errors.company_name}</p>
          )}
        </div>

        {/* LOCATION */}
        <div className={styles.row}>
          <div className={styles.inputBox}>
            <label>Pincode *</label>
            <input
              name="pincode"
              maxLength="6"
              value={data.pincode}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.pincode && (
              <p className={styles.error}>{errors.pincode}</p>
            )}
          </div>

          <div className={styles.inputBox}>
            <label>City *</label>
            <input
              name="city"
              value={data.city}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.city && (
              <p className={styles.error}>{errors.city}</p>
            )}
          </div>

          <div className={styles.inputBox}>
            <label>State *</label>
            <input
              name="state"
              value={data.state}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.state && (
              <p className={styles.error}>{errors.state}</p>
            )}
          </div>
        </div>

        {/* EMAIL (UI intentionally commented) */}
        {/* 
        <div className={styles.inputBox}>
          <label>Email *</label>
          <input
            name="email"
            value={data.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.email && (
            <p className={styles.error}>{errors.email}</p>
          )}
        </div> 
        */}
      </div>

      {/* NAV */}
      <div className={styles.navBtns}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={prev}
        >
          Back
        </button>

        <button
          type="submit"
          className={styles.continueBtn}
          disabled={
            Object.values(data).some(isInvalid) ||
            Object.values(errors).some(Boolean)
          }
        >
          Continue
        </button>
      </div>
    </form>
  );
}

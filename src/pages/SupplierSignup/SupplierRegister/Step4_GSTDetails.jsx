
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import styles from "./Step4_GSTDetails.module.css";

// export default function Step4_GSTDetails({ prev, formData, updateData }) {
//   const [haveGst, setHaveGst] = useState(true);
//   const [gst, setGst] = useState(formData.gst_no || "");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   /* ✅ GST REGEX (INDIA) */
//   const gstRegex =
//     /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

//   /* ================= RESTORE ================= */
//   useEffect(() => {
//     const saved = localStorage.getItem("step4_gst");
//     if (!saved) return;

//     const parsed = JSON.parse(saved);
//     setHaveGst(parsed.haveGst);
//     setGst(parsed.gst || "");
//   }, []);

//   /* ================= SAVE ================= */
//   useEffect(() => {
//     localStorage.setItem(
//       "step4_gst",
//       JSON.stringify({ haveGst, gst })
//     );
//   }, [haveGst, gst]);

//   /* ================= SUBMIT (ENTER WORKS) ================= */
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (haveGst) {
//       if (!gst.trim()) {
//         alert("Please enter GST number");
//         return;
//       }

//       if (!gstRegex.test(gst.trim().toUpperCase())) {
//         alert("Enter a valid 15-digit GST number");
//         return;
//       }
//     }

//     const finalData = {
//       phone: formData.phone.trim(),
//       email: formData.email.trim(),
//       fullname: formData.fullname.trim(),
//       password: formData.password, // ❌ no trim

//       company_name: formData.company_name.trim(),
//       city: formData.city.trim(),
//       state: formData.state.trim(),
//       pincode: formData.pincode.trim(),

//       products: (formData.products || []).map((p) =>
//         typeof p === "string" ? p.trim() : p
//       ),

//       gst_no: haveGst ? gst.trim().toUpperCase() : "NA",
//       verifyPhone: true,
//       verifyEmail: true,
//     };

//     updateData(finalData);

//     try {
//       setLoading(true);

//       await axios.post(
//         "http://localhost:3000/api/auth/supplier/register",
//         finalData,
//         { withCredentials: true }
//       );

//       alert("Supplier Registered Successfully 🎉");

//       /* 🔥 clear step data after success */
//       localStorage.removeItem("step1_create_account");
//       localStorage.removeItem("step2_business_details");
//       localStorage.removeItem("step3_products");
//       localStorage.removeItem("step4_gst");
//       localStorage.removeItem("supplier_signup_draft");



//       navigate("/supplier/account-approved");

//     } catch (err) {
//       alert(err.response?.data?.message || "Registration Failed ⚠️");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form className={styles.container} onSubmit={handleSubmit}>
//       <h2 className={styles.title}>GST & Compliance Details</h2>
//       <p className={styles.subtitle}>
//         This information helps us verify your business identity
//       </p>

//       <div className={styles.gstCard}>
//         <p className={styles.sectionTitle}>Do you have a GST number?</p>

//         <div className={styles.gstOptions}>
//           <label
//             className={`${styles.gstOption} ${haveGst ? styles.active : ""}`}
//           >
//             <input
//               type="radio"
//               checked={haveGst}
//               onChange={() => setHaveGst(true)}
//             />
//             <div>
//               <strong>I have GST</strong>
//               <p>Required for registered businesses</p>
//             </div>
//           </label>

//           <label
//             className={`${styles.gstOption} ${!haveGst ? styles.active : ""}`}
//           >
//             <input
//               type="radio"
//               checked={!haveGst}
//               onChange={() => setHaveGst(false)}
//             />
//             <div>
//               <strong>I don’t have GST</strong>
//               <p>You can still sell as an unregistered seller</p>
//             </div>
//           </label>
//         </div>

//         {haveGst && (
//           <div className={styles.inputBox}>
//             <label>GST Number *</label>
//             <input
//               type="text"
//               placeholder="15-digit GST number"
//               value={gst}
//               maxLength={15}
//               onChange={(e) =>
//                 setGst(e.target.value.toUpperCase())
//               }
//             />
//             <span className={styles.hint}>
//               Example: 22AAAAA0000A1Z5
//             </span>
//           </div>
//         )}
//       </div>

//       <div className={styles.navBtns}>
//         <button
//           type="button"
//           className={styles.backBtn}
//           onClick={prev}
//           disabled={loading}
//         >
//           Back
//         </button>

//         <button
//           type="submit"
//           className={styles.continueBtn}
//           disabled={loading}
//         >
//           {loading ? "Processing..." : "Start Selling"}
//         </button>
//       </div>
//     </form>
//   );
// }
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Step4_GSTDetails.module.css";

export default function Step4_GSTDetails({ prev, formData, updateData }) {
  const [haveGst, setHaveGst] = useState(
    formData.gst_no && formData.gst_no !== "NA"
  );
  const [gst, setGst] = useState(formData.gst_no || "");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* ✅ GST REGEX (INDIA) */
  const gstRegex =
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

  /* 🔥 SYNC WHEN BACK / REFRESH */
  useEffect(() => {
    if (formData.gst_no) {
      setHaveGst(formData.gst_no !== "NA");
      setGst(formData.gst_no === "NA" ? "" : formData.gst_no);
    }
  }, [formData]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (haveGst) {
      if (!gst.trim()) {
        alert("Please enter GST number");
        return;
      }

      if (!gstRegex.test(gst.trim().toUpperCase())) {
        alert("Enter a valid 15-digit GST number");
        return;
      }
    }

    const finalData = {
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      fullname: formData.fullname.trim(),
      password: formData.password, // ❌ no trim

      company_name: formData.company_name.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      pincode: formData.pincode.trim(),

      products: formData.products || [],

      gst_no: haveGst ? gst.trim().toUpperCase() : "NA",
      verifyPhone: true,
      verifyEmail: true,
    };

    updateData(finalData);

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:3000/api/auth/supplier/register",
        finalData,
        { withCredentials: true }
      );

      alert("Supplier Registered Successfully 🎉");

      /* 🔥 FULL CLEANUP AFTER SUCCESS */
      localStorage.removeItem("supplier_signup_draft");

      navigate("/supplier/account-approved");
    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed ⚠️");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h2 className={styles.title}>GST & Compliance Details</h2>
      <p className={styles.subtitle}>
        This information helps us verify your business identity
      </p>

      <div className={styles.gstCard}>
        <p className={styles.sectionTitle}>Do you have a GST number?</p>

        <div className={styles.gstOptions}>
          <label
            className={`${styles.gstOption} ${haveGst ? styles.active : ""}`}
          >
            <input
              type="radio"
              checked={haveGst}
              onChange={() => setHaveGst(true)}
            />
            <div>
              <strong>I have GST</strong>
              <p>Required for registered businesses</p>
            </div>
          </label>

          <label
            className={`${styles.gstOption} ${!haveGst ? styles.active : ""}`}
          >
            <input
              type="radio"
              checked={!haveGst}
              onChange={() => setHaveGst(false)}
            />
            <div>
              <strong>I don’t have GST</strong>
              <p>You can still sell as an unregistered seller</p>
            </div>
          </label>
        </div>

        {haveGst && (
          <div className={styles.inputBox}>
            <label>GST Number *</label>
            <input
              type="text"
              placeholder="15-digit GST number"
              value={gst}
              maxLength={15}
              onChange={(e) =>
                setGst(e.target.value.toUpperCase())
              }
            />
            <span className={styles.hint}>
              Example: 22AAAAA0000A1Z5
            </span>
          </div>
        )}
      </div>

      <div className={styles.navBtns}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={prev}
          disabled={loading}
        >
          Back
        </button>

        <button
          type="submit"
          className={styles.continueBtn}
          disabled={loading}
        >
          {loading ? "Processing..." : "Start Selling"}
        </button>
      </div>
    </form>
  );
}


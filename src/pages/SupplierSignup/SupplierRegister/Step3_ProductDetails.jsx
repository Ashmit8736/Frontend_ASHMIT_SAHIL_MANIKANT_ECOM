
// import { useState, useEffect } from "react";
// import styles from "./Step3_ProductDetails.module.css";

// export default function Step3_ProductDetails({ next, prev, updateData }) {
//   const [products, setProducts] = useState([{ name: "", photo: null }]);

//   const isInvalid = (v) =>
//     v === null || v === undefined || v.toString().trim() === "";

//   /* ================= RESTORE ================= */
//   useEffect(() => {
//     const saved = localStorage.getItem("step3_products");
//     if (!saved) return;
//     const parsed = JSON.parse(saved);
//     setProducts(parsed.map(p => ({
//       name: p.name,
//       photo: null
//     })));
//   }, []);

//   /* ================= SAVE ================= */
//   useEffect(() => {
//     const safeProducts = products.map(p => ({
//       name: p.name
//     }));

//     localStorage.setItem(
//       "step3_products",
//       JSON.stringify(safeProducts)
//     );
//   }, [products]);

//   /* ================= NAME CHANGE ================= */
//   const handleNameChange = (index, value) => {
//     // 🔒 allow letters, numbers & spaces only
//     const v = value.replace(/[^A-Za-z0-9 ]/g, "");

//     const newData = [...products];
//     newData[index].name = v;
//     setProducts(newData);
//   };

//   /* ================= TRIM ON BLUR ================= */
//   const handleBlur = (index) => {
//     const newData = [...products];
//     newData[index].name = newData[index].name.trim();
//     setProducts(newData);
//   };

//   const handlePhoto = (index, file) => {
//     const newData = [...products];
//     newData[index].photo = file;
//     setProducts(newData);
//   };

//   const addProduct = () => {
//     setProducts([...products, { name: "", photo: null }]);
//   };

//   const removeProduct = (index) => {
//     setProducts(products.filter((_, i) => i !== index));
//   };

//   /* ================= CONTINUE (ENTER WORKS) ================= */
//   const handleContinue = (e) => {
//     e.preventDefault();

//     const validProducts = products
//       .filter((item) => !isInvalid(item.name))
//       .map((item) => ({
//         name: item.name.trim(),
//         photo: item.photo || null,
//       }));

//     if (validProducts.length === 0) {
//       alert("Please add at least one product/service name");
//       return;
//     }

//     updateData({ products: validProducts });
//     next();
//   };

//   return (
//     <form className={styles.container} onSubmit={handleContinue}>
//       <h2 className={styles.title}>Product Details</h2>
//       <p className={styles.subtitle}>
//         Add the products or services you want to sell
//       </p>

//       <div className={styles.grid}>
//         {products.map((item, index) => (
//           <div key={index} className={styles.card}>
//             <div className={styles.inputBox}>
//               <label>Product / Service Name *</label>
//               <input
//                 value={item.name}
//                 placeholder="e.g. Grocery Items"
//                 onChange={(e) =>
//                   handleNameChange(index, e.target.value)
//                 }
//                 onBlur={() => handleBlur(index)}
//               />
//             </div>

//             <label className={styles.photoBox}>
//               {item.photo ? (
//                 <img
//                   src={URL.createObjectURL(item.photo)}
//                   alt="preview"
//                 />
//               ) : (
//                 <div className={styles.placeholder}>
//                   <span>+</span>
//                   <p>Add Photo (optional)</p>
//                 </div>
//               )}
//               <input
//                 type="file"
//                 accept="image/*"
//                 hidden
//                 onChange={(e) =>
//                   handlePhoto(index, e.target.files[0])
//                 }
//               />
//             </label>

//             {products.length > 1 && (
//               <button
//                 type="button"
//                 className={styles.removeBtn}
//                 onClick={() => removeProduct(index)}
//               >
//                 Remove
//               </button>
//             )}
//           </div>
//         ))}
//       </div>

//       <button
//         type="button"
//         className={styles.addBtn}
//         onClick={addProduct}
//       >
//         + Add Another Product
//       </button>

//       <div className={styles.navBtns}>
//         <button
//           type="button"
//           className={styles.backBtn}
//           onClick={prev}
//         >
//           Back
//         </button>

//         <button
//           type="submit"
//           className={styles.continueBtn}
//         >
//           Continue
//         </button>
//       </div>
//     </form>
//   );
// }

import { useState, useEffect } from "react";
import styles from "./Step3_ProductDetails.module.css";

export default function Step3_ProductDetails({
  next,
  prev,
  updateData,
  formData,
}) {
  const [products, setProducts] = useState(
    formData.products?.length
      ? formData.products
      : [{ name: "", photo: null }]
  );

  const isInvalid = (v) =>
    v === null || v === undefined || v.toString().trim() === "";

  /* 🔥 SYNC WHEN BACK / REFRESH */
  useEffect(() => {
    if (formData.products?.length) {
      setProducts(
        formData.products.map((p) => ({
          name: p.name || "",
          photo: null, // ⚠️ file refresh pe nahi bachta (expected)
        }))
      );
    }
  }, [formData]);

  /* ================= NAME CHANGE ================= */
  const handleNameChange = (index, value) => {
    const v = value.replace(/[^A-Za-z0-9 ]/g, "");

    const newData = [...products];
    newData[index].name = v;
    setProducts(newData);
  };

  const handleBlur = (index) => {
    const newData = [...products];
    newData[index].name = newData[index].name.trim();
    setProducts(newData);
  };

  const handlePhoto = (index, file) => {
    const newData = [...products];
    newData[index].photo = file;
    setProducts(newData);
  };

  const addProduct = () => {
    setProducts([...products, { name: "", photo: null }]);
  };

  const removeProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  /* ================= CONTINUE ================= */
  const handleContinue = (e) => {
    e.preventDefault();

    const validProducts = products
      .filter((item) => !isInvalid(item.name))
      .map((item) => ({
        name: item.name.trim(),
        photo: item.photo || null,
      }));

    if (validProducts.length === 0) {
      alert("Please add at least one product/service name");
      return;
    }

    updateData({ products: validProducts });
    next();
  };

  return (
    <form className={styles.container} onSubmit={handleContinue}>
      <h2 className={styles.title}>Product Details</h2>
      <p className={styles.subtitle}>
        Add the products or services you want to sell
      </p>

      <div className={styles.grid}>
        {products.map((item, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.inputBox}>
              <label>Product / Service Name *</label>
              <input
                value={item.name}
                placeholder="e.g. Grocery Items"
                onChange={(e) =>
                  handleNameChange(index, e.target.value)
                }
                onBlur={() => handleBlur(index)}
              />
            </div>

            <label className={styles.photoBox}>
              {item.photo ? (
                <img
                  src={URL.createObjectURL(item.photo)}
                  alt="preview"
                />
              ) : (
                <div className={styles.placeholder}>
                  <span>+</span>
                  <p>Add Photo (optional)</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) =>
                  handlePhoto(index, e.target.files[0])
                }
              />
            </label>

            {products.length > 1 && (
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removeProduct(index)}
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        className={styles.addBtn}
        onClick={addProduct}
      >
        + Add Another Product
      </button>

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
        >
          Continue
        </button>
      </div>
    </form>
  );
}

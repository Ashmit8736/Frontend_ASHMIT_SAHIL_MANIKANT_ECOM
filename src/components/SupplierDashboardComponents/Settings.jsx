import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Setting.module.css";

const categories = ["General", "Billing", "Shipping", "Notifications"];

const Settings = () => {
  const [menu, setMenu] = useState("General");
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [ifscStatus, setIfscStatus] = useState(null);
  const [ifscLoading, setIfscLoading] = useState(false);


  const [form, setForm] = useState({
    // GENERAL
    store_name: "",
    description: "",
    address: "",
    phone: "",
    min_order_amount: "",
    tax_enabled: false,

    // BILLING
    bank_name: "",
    account_holder: "",
    account_number: "",
    ifsc_code: "",

    // SHIPPING
    shipping_regions: [],
    shipping_charge: "",

    // NOTIFICATIONS
    notify_orders: true,
    notify_payments: true,
    notify_system: true,
  });

  const verifyIFSC = async (ifsc) => {
    if (!ifsc || ifsc.length < 11) {
      setIfscStatus(null);
      return;
    }

    try {
      setIfscLoading(true);

      const res = await axios.get(
        `http://localhost:3000/api/supplier/verify-ifsc/${ifsc}`,
        { withCredentials: true }
      );

      setIfscStatus({
        success: true,
        text: `✔ ${res.data.bank} (${res.data.city})`,
      });

      // auto-fill bank name
      setForm((p) => ({
        ...p,
        bank_name: res.data.bank,
      }));
    } catch (err) {
      setIfscStatus({
        success: false,
        text: "❌ Invalid IFSC Code",
      });
    } finally {
      setIfscLoading(false);
    }
  };

  // =========================
  // FETCH SETTINGS
  // =========================
  const fetchSettings = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/supplier/settings",
        { withCredentials: true }
      );

      if (res.data?.settings) {
        setForm({
          ...form,
          ...res.data.settings,
          shipping_regions:
            res.data.settings.shipping_regions || [],
        });
      }
    } catch (err) {
      console.error("❌ Fetch Settings Error:", err);
      alert("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line
  }, []);

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // =========================
  // SAVE SETTINGS
  // =========================
  const handleSave = async () => {
    try {
      const payload = {
        ...form,

        min_order_amount: Number(form.min_order_amount) || 0,
        shipping_charge: Number(form.shipping_charge) || 0,

        shipping_regions: Array.isArray(form.shipping_regions)
          ? form.shipping_regions
          : [],

        tax_enabled: !!form.tax_enabled,
        notify_orders: !!form.notify_orders,
        notify_payments: !!form.notify_payments,
        notify_system: !!form.notify_system,
      };

      await axios.put(
        "http://localhost:3000/api/supplier/settings",
        payload,
        { withCredentials: true }
      );

      alert("✅ Settings saved successfully");
    } catch (err) {
      console.error("❌ Save Settings Error:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to save settings");
    }
  };


  if (loading) {
    return <div className={styles.settingsContainer}>Loading settings...</div>;
  }

  // return (
  //   <div className={styles.settingsContainer}>
  //     <h2 className={styles.pageTitle}>Settings</h2>
  //     <button
  //       className={styles.saveBtn}
  //       onClick={() => (editMode ? handleSave() : setEditMode(true))}
  //       style={{ marginBottom: "1rem" }}
  //     >
  //       {editMode ? "Save Changes" : "Edit"}
  //     </button>



  //     {/* CATEGORY BUTTONS */}
  //     <div className={styles.btnwrap}>
  //       {categories.map((item) => (
  //         <button
  //           key={item}
  //           className={styles.btn}
  //           onClick={() => setMenu(item)}
  //           style={{
  //             backgroundColor: menu === item ? "white" : "transparent",
  //           }}
  //         >
  //           {item}
  //         </button>
  //       ))}
  //     </div>

  //     {/* =========================
  //         GENERAL
  //     ========================= */}
  //     {menu === "General" && (
  //       <>
  //         <div className={styles.contsec}>
  //           <h3>Store Information</h3>

  //           <input
  //             name="store_name"
  //             value={form.store_name}
  //             onChange={handleChange}
  //             disabled={!editMode}
  //           />

  //           <input
  //             name="phone"
  //             placeholder="Phone"
  //             value={form.phone}
  //             onChange={handleChange}
  //           />

  //           <input
  //             name="address"
  //             placeholder="Address"
  //             value={form.address}
  //             onChange={handleChange}
  //           />

  //           <textarea
  //             name="description"
  //             placeholder="Store Description"
  //             value={form.description}
  //             onChange={handleChange}
  //           />

  //           <button onClick={handleSave}>Save General</button>
  //         </div>

  //         <div className={styles.contsec}>
  //           <h3>Business Settings</h3>

  //           <input
  //             name="min_order_amount"
  //             type="number"
  //             placeholder="Minimum Order Amount"
  //             value={form.min_order_amount}
  //             onChange={handleChange}
  //           />

  //           <label>
  //             <input
  //               type="checkbox"
  //               checked={form.tax_enabled}
  //               onChange={() =>
  //                 setForm((p) => ({
  //                   ...p,
  //                   tax_enabled: !p.tax_enabled,
  //                 }))
  //               }
  //             />
  //             Enable Tax Calculation
  //           </label>

  //           <button onClick={handleSave}>Save Business</button>
  //         </div>
  //       </>
  //     )}

  //     {/* =========================
  //         BILLING
  //     ========================= */}
  //     {menu === "Billing" && (
  //       <div className={styles.contsec}>
  //         <h3>Bank Details</h3>

  //         <input
  //           name="bank_name"
  //           placeholder="Bank Name"
  //           value={form.bank_name}
  //           onChange={handleChange}
  //         />

  //         <input
  //           name="account_holder"
  //           placeholder="Account Holder Name"
  //           value={form.account_holder}
  //           onChange={handleChange}
  //         />

  //         <input
  //           name="account_number"
  //           placeholder="Account Number"
  //           value={form.account_number}
  //           onChange={handleChange}
  //         />

  //         <input
  //           name="ifsc_code"
  //           placeholder="IFSC Code"
  //           value={form.ifsc_code}
  //           disabled={!editMode}
  //           onChange={(e) => {
  //             handleChange(e);
  //             verifyIFSC(e.target.value.toUpperCase());
  //           }}

  //         />
  //         {ifscLoading && <p>Checking IFSC...</p>}

  //         {ifscStatus && (
  //           <p
  //             style={{
  //               color: ifscStatus.success ? "green" : "red",
  //               fontWeight: "600",
  //             }}
  //           >
  //             {ifscStatus.text}
  //           </p>
  //         )}


  //         <button
  //           onClick={handleSave}
  //           disabled={menu === "Billing" && ifscStatus?.success === false}
  //         >
  //           Save Billing
  //         </button>
  //       </div>
  //     )}

  //     {/* =========================
  //         SHIPPING
  //     ========================= */}
  //     {menu === "Shipping" && (
  //       <div className={styles.contsec}>
  //         <h3>Shipping Settings</h3>

  //         <input
  //           placeholder="Regions (comma separated)"
  //           value={form.shipping_regions.join(",")}
  //           onChange={(e) =>
  //             setForm((p) => ({
  //               ...p,
  //               shipping_regions: e.target.value
  //                 .split(",")
  //                 .map((r) => r.trim()),
  //             }))
  //           }
  //         />

  //         <input
  //           name="shipping_charge"
  //           type="number"
  //           placeholder="Shipping Charge"
  //           value={form.shipping_charge}
  //           onChange={handleChange}
  //         />

  //         <button onClick={handleSave}>Save Shipping</button>
  //       </div>
  //     )}

  //     {/* =========================
  //         NOTIFICATIONS
  //     ========================= */}
  //     {menu === "Notifications" && (
  //       <div className={styles.contsec}>
  //         <h3>Notification Preferences</h3>

  //         <label>
  //           <input
  //             type="checkbox"
  //             checked={form.notify_orders}
  //             onChange={() =>
  //               setForm((p) => ({
  //                 ...p,
  //                 notify_orders: !p.notify_orders,
  //               }))
  //             }
  //           />
  //           Order Notifications
  //         </label>

  //         <label>
  //           <input
  //             type="checkbox"
  //             checked={form.notify_payments}
  //             onChange={() =>
  //               setForm((p) => ({
  //                 ...p,
  //                 notify_payments: !p.notify_payments,
  //               }))
  //             }
  //           />
  //           Payment Notifications
  //         </label>

  //         <label>
  //           <input
  //             type="checkbox"
  //             checked={form.notify_system}
  //             onChange={() =>
  //               setForm((p) => ({
  //                 ...p,
  //                 notify_system: !p.notify_system,
  //               }))
  //             }
  //           />
  //           System Notifications
  //         </label>

  //         <button onClick={handleSave}>Save Notifications</button>
  //       </div>
  //     )}
  //   </div>
  // );

  return (
    <div className={styles.settingsContainer}>
      <h2 className={styles.pageTitle}>Settings</h2>

      <button
        className={styles.saveBtn}
        onClick={() => (editMode ? handleSave() : setEditMode(true))}
      >
        {editMode ? "Save Changes" : "Edit"}
      </button>

      {/* ================= TABS ================= */}
      <div className={styles.btnwrap}>
        {categories.map((c) => (
          <button
            key={c}
            className={styles.btn}
            onClick={() => setMenu(c)}
            style={{ background: menu === c ? "#fff" : "transparent" }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* ================= GENERAL ================= */}
      {menu === "General" && (
        <div className={styles.contsec}>
          <h3>Store Information</h3>

          <input
            name="store_name"
            placeholder="Store Name"
            value={form.store_name}
            onChange={handleChange}
            disabled={!editMode}
          />

          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            disabled={!editMode}
          />

          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            disabled={!editMode}
          />

          <textarea
            name="description"
            placeholder="Store Description"
            value={form.description}
            onChange={handleChange}
            disabled={!editMode}
          />

          <input
            name="min_order_amount"
            type="number"
            placeholder="Minimum Order Amount"
            value={form.min_order_amount}
            onChange={handleChange}
            disabled={!editMode}
          />

          <label>
            <input
              type="checkbox"
              checked={form.tax_enabled}
              onChange={() =>
                setForm((p) => ({ ...p, tax_enabled: !p.tax_enabled }))
              }
              disabled={!editMode}
            />
            Enable Tax
          </label>
        </div>
      )}

      {/* ================= BILLING ================= */}
      {menu === "Billing" && (
        <div className={styles.contsec}>
          <h3>Billing & Payout Details</h3>

          <h4>🏦 Bank Account</h4>
          <input name="bank_name" value={form.bank_name} onChange={handleChange} disabled={!editMode} />
          <input name="account_holder" value={form.account_holder} onChange={handleChange} disabled={!editMode} />
          <input name="account_number" value={form.account_number} onChange={handleChange} disabled={!editMode} />

          <input
            name="ifsc_code"
            value={form.ifsc_code}
            disabled={!editMode}
            onChange={(e) => {
              handleChange(e);
              verifyIFSC(e.target.value.toUpperCase());
            }}
          />

          {ifscLoading && <p>Checking IFSC…</p>}
          {ifscStatus && (
            <p style={{ color: ifscStatus.success ? "green" : "red" }}>
              {ifscStatus.text}
            </p>
          )}

          <h4>💸 UPI</h4>
          <input
            name="upi_id"
            placeholder="example@upi"
            value={form.upi_id}
            onChange={handleChange}
            disabled={!editMode}
          />

          <h4>💳 Card (Reference Only)</h4>
          <input
            name="card_holder"
            placeholder="Card Holder Name"
            value={form.card_holder}
            onChange={handleChange}
            disabled={!editMode}
          />
          <input
            name="card_last4"
            placeholder="Last 4 digits"
            maxLength={4}
            value={form.card_last4}
            onChange={handleChange}
            disabled={!editMode}
          />
          <input
            name="card_brand"
            placeholder="Visa / MasterCard / Rupay"
            value={form.card_brand}
            onChange={handleChange}
            disabled={!editMode}
          />

          <p style={{ fontSize: "0.8rem", color: "#666" }}>
            🔒 Full card details are never stored
          </p>
        </div>
      )}

      {/* ================= SHIPPING ================= */}
      {menu === "Shipping" && (
        <div className={styles.contsec}>
          <h3>Shipping Settings</h3>

          <input
            placeholder="Regions (comma separated)"
            value={form.shipping_regions.join(",")}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                shipping_regions: e.target.value.split(",").map((r) => r.trim()),
              }))
            }
            disabled={!editMode}
          />

          <input
            name="shipping_charge"
            type="number"
            placeholder="Shipping Charge"
            value={form.shipping_charge}
            onChange={handleChange}
            disabled={!editMode}
          />
        </div>
      )}

      {/* ================= NOTIFICATIONS ================= */}
      {menu === "Notifications" && (
        <div className={styles.contsec}>
          <h3>Notification Preferences</h3>

          {["notify_orders", "notify_payments", "notify_system"].map((key) => (
            <label key={key}>
              <input
                type="checkbox"
                checked={form[key]}
                onChange={() =>
                  setForm((p) => ({ ...p, [key]: !p[key] }))
                }
                disabled={!editMode}
              />
              {key.replace("notify_", "").toUpperCase()}
            </label>
          ))}
        </div>
      )}
    </div>
  );

};


export default Settings;

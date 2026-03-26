import React, { useState } from "react";
import styles from "./WithdrawModal.module.css";

const WithdrawModal = ({ onClose, onSubmit }) => {
    const [method, setMethod] = useState("bank");

    const [form, setForm] = useState({
        amount: "",
        accountHolder: "",
        accountNumber: "",
        confirmAccountNumber: "",
        ifsc: "",
        upiId: "",
        cardNumber: "",
        cardHolder: "",
        expiry: "",
        cvv: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.amount) return alert("Enter amount!");

        if (method === "bank") {
            if (!form.accountHolder || !form.accountNumber || !form.ifsc) {
                return alert("Fill bank details!");
            }
            if (form.accountNumber !== form.confirmAccountNumber) {
                return alert("Account numbers do not match!");
            }
        }

        if (method === "upi" && !form.upiId) {
            return alert("Enter a valid UPI ID!");
        }

        if (method === "card") {
            if (!form.cardNumber || !form.cardHolder || !form.expiry || !form.cvv) {
                return alert("Fill all card details!");
            }
        }

        onSubmit({ method, ...form });
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2 className={styles.heading}>Withdrawal Request</h2>

                <div className={styles.methodSwitch}>
                    <button className={method === "bank" ? styles.active : ""} onClick={() => setMethod("bank")}>
                        🏦 Bank
                    </button>
                    <button className={method === "upi" ? styles.active : ""} onClick={() => setMethod("upi")}>
                        📱 UPI
                    </button>
                    <button className={method === "card" ? styles.active : ""} onClick={() => setMethod("card")}>
                        💳 Card
                    </button>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <input
                        type="number"
                        name="amount"
                        placeholder="Amount (₹)"
                        value={form.amount}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />

                    {/* BANK */}
                    {method === "bank" && (
                        <>
                            <input
                                type="text"
                                name="accountHolder"
                                placeholder="Account Holder"
                                value={form.accountHolder}
                                onChange={handleChange}
                                className={styles.input}
                            />

                            <input
                                type="text"
                                name="accountNumber"
                                placeholder="Account Number"
                                value={form.accountNumber}
                                onChange={handleChange}
                                className={styles.input}
                            />

                            <input
                                type="text"
                                name="confirmAccountNumber"
                                placeholder="Confirm Account Number"
                                value={form.confirmAccountNumber}
                                onChange={handleChange}
                                className={styles.input}
                            />

                            <input
                                type="text"
                                name="ifsc"
                                placeholder="IFSC Code"
                                value={form.ifsc}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </>
                    )}

                    {/* UPI */}
                    {method === "upi" && (
                        <input
                            type="text"
                            name="upiId"
                            placeholder="UPI ID (username@upi)"
                            value={form.upiId}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    )}

                    {/* CARD */}
                    {method === "card" && (
                        <>
                            <input
                                type="text"
                                name="cardNumber"
                                placeholder="Card Number"
                                value={form.cardNumber}
                                onChange={(e) => {
                                    let val = e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
                                    setForm({ ...form, cardNumber: val });
                                }}
                                maxLength={19}
                                className={styles.input}
                            />

                            <input
                                type="text"
                                name="cardHolder"
                                placeholder="Card Holder Name"
                                value={form.cardHolder}
                                onChange={handleChange}
                                className={styles.input}
                            />

                            <input
                                type="text"
                                name="expiry"
                                placeholder="MM/YY"
                                value={form.expiry}
                                maxLength={5}
                                onChange={(e) => {
                                    let v = e.target.value.replace(/\D/g, "");
                                    if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2, 4);
                                    setForm({ ...form, expiry: v });
                                }}
                                className={styles.input}
                            />

                            <input
                                type="password"
                                name="cvv"
                                placeholder="CVV"
                                maxLength={3}
                                value={form.cvv}
                                onChange={(e) => setForm({ ...form, cvv: e.target.value.replace(/\D/g, "") })}
                                className={styles.input}
                            />
                        </>
                    )}

                    <div className={styles.actions}>
                        <button type="button" className={styles.cancelBtn} onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.submitBtn}>
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WithdrawModal;

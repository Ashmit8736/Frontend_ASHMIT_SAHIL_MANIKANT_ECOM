

import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Payments.module.css";
import WithdrawModal from "../../components/sellerDashboard/WithdrawModal.jsx";

const Payments = () => {
    const [showWithdraw, setShowWithdraw] = useState(false);

    const [wallet, setWallet] = useState({
        total_earnings: 0,
        withdrawable_balance: 0,
        pending_payouts: 0,
    });

    const [transactions, setTransactions] = useState([]);

    const token = localStorage.getItem("sellerToken");

    // -------------------------
    // GET WALLET DATA
    // -------------------------
    const fetchWallet = async () => {
        try {
            const res = await axios.get(
                "http://localhost:3000/api/seller/payments/wallet",
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setWallet(res.data);
        } catch (err) {
            console.log("FETCH WALLET ERROR:", err);
        }
    };

    // -------------------------
    // GET TRANSACTIONS
    // -------------------------
    const fetchTransactions = async () => {
        try {
            const res = await axios.get(
                "http://localhost:3000/api/seller/payments/transactions",
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setTransactions(res.data.transactions);
        } catch (err) {
            console.log("FETCH TX ERROR:", err);
        }
    };

    // -------------------------
    // USE EFFECT
    // -------------------------
    useEffect(() => {
        fetchWallet();
        fetchTransactions();
    }, []);

    // -------------------------
    // SUBMIT WITHDRAW REQUEST
    // -------------------------
    const handleWithdrawRequest = async (data) => {
        try {
            const payload = {
                amount: Number(data.amount),
                method: data.method,
                details:
                    data.method === "upi"
                        ? { upiId: data.upiId }
                        : data.method === "bank"
                            ? {
                                accountHolder: data.accountHolder,
                                accountNumber: data.accountNumber,
                                ifsc: data.ifsc
                            }
                            : {
                                cardHolder: data.cardHolder,
                                cardNumber: data.cardNumber,
                                expiry: data.expiry
                            }
            };

            const res = await axios.post(
                "http://localhost:3000/api/seller/payments/withdraw",
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Withdrawal Request Submitted!");

            setShowWithdraw(false);
            fetchWallet(); // update balance

        } catch (err) {
            console.log("WITHDRAW ERROR:", err);
            alert(err?.response?.data?.message || "Failed to submit withdrawal request");
        }
    };


    return (
        <div className={styles.sellerPayments}>
            <h1 className={styles.heading}>Payment Management</h1>

            {/* WALLET CARDS */}
            <div className={styles.paymentStats}>
                <div className={styles.paymentCard}>
                    <div className={styles.paymentIcon}>💰</div>
                    <div className={styles.paymentContent}>
                        <h3>₹{wallet?.total_earnings ?? 0}</h3>

                        <p>Total Earnings</p>
                    </div>
                </div>

                <div className={styles.paymentCard}>
                    <div className={styles.paymentIcon}>🟢</div>
                    <div className={styles.paymentContent}>
                        <h3>₹{wallet?.withdrawable_balance ?? 0}</h3>
                        <p>Available Balance</p>
                    </div>
                </div>

                <div className={styles.paymentCard}>
                    <div className={styles.paymentIcon}>⏳</div>
                    <div className={styles.paymentContent}>
                        <h3>₹{wallet?.pending_payouts ?? 0}</h3>
                        <p>Pending Payouts</p>
                    </div>
                </div>
            </div>

            {/* WITHDRAW BUTTON */}
            <div className={styles.withdrawSection}>
                <button
                    className={styles.withdrawBtn}
                    onClick={() => setShowWithdraw(true)}
                >
                    Request Withdrawal
                </button>
            </div>

            {/* TRANSACTION TABLE */}
            <div className={styles.transactionsSection}>
                <h2>Transaction History</h2>

                <div className={styles.transactionsTableContainer}>
                    <table className={styles.transactionsTable}>
                        <thead>
                            <tr>
                                <th>Txn ID</th>
                                <th>Amount</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: "center" }}>
                                        No transactions found
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((txn) => (
                                    <tr key={txn.id}>
                                        <td>{txn.txn_id}</td>
                                        <td>₹{txn.amount}</td>
                                        <td>{txn.type}</td>
                                        <td>
                                            <span className={`${styles.txnStatus} ${styles[txn.status.toLowerCase()]}`}>
                                                {txn.status}
                                            </span>
                                        </td>
                                        <td>{new Date(txn.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* WITHDRAW MODAL */}
            {showWithdraw && (
                <WithdrawModal
                    onClose={() => setShowWithdraw(false)}
                    onSubmit={handleWithdrawRequest}
                />
            )}
        </div>
    );
};

export default Payments;

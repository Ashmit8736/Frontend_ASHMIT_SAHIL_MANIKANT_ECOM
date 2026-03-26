import React, { useState, useEffect } from "react";
import { Download, Search, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import styles from "./AdminTransactions.module.css";

const ITEMS_PER_PAGE = 8;

const AdminTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [transactionType, setTransactionType] = useState("seller");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Status");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const statuses = ["All Status", "Completed", "Pending"];

    // Correct API URL
    const API_URL =
        transactionType === "seller"
            ? "http://localhost:3000/api/admin/seller-transactions"
            : "http://localhost:3000/api/admin/supplier-transactions";

    // Fetch Data
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("adminToken");

                const res = await axios.get(API_URL, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setTransactions(res.data.transactions || []);
            } catch (err) {
                console.error("Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [transactionType]);

    // Filter + Search
    const filteredData = transactions.filter((txn) => {
        const matchSearch =
            (txn.txn_id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (txn.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (txn.seller_name || txn.supplier_name || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchStatus =
            statusFilter === "All Status" || txn.status === statusFilter;

        return matchSearch && matchStatus;
    });

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const startIdx = (page - 1) * ITEMS_PER_PAGE;
    const currentData = filteredData.slice(startIdx, startIdx + ITEMS_PER_PAGE);

    return (
        <div className={styles.container}>

            {/* HEADER + DROPDOWN */}
            <div className={styles.header}>
                <h2 className={styles.title}>
                    {transactionType === "seller"
                        ? "Seller Transactions"
                        : "Supplier Transactions"}
                </h2>

                <select
                    className={styles.typeDropdown}
                    value={transactionType}
                    onChange={(e) => {
                        setTransactionType(e.target.value);
                        setPage(1);
                    }}
                >
                    <option value="seller">Seller Transactions</option>
                    <option value="supplier">Supplier Transactions</option>
                </select>

                <button className={styles.exportBtn}>
                    <Download size={16} /> Export
                </button>
            </div>

            {/* SEARCH + FILTER */}
            <div className={styles.filtersRow}>
                <div className={styles.searchBox}>
                    <Search size={16} />
                    <input
                        type="text"
                        placeholder="Search by transaction ID, user, or description..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>

                <div className={styles.selectWrapper}>
                    <Filter size={14} className={styles.filterIcon} />
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPage(1);
                        }}
                        className={styles.select}
                    >
                        {statuses.map((s) => (
                            <option key={s}>{s}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* LOADING */}
            {loading && <p className={styles.loading}>Loading transactions...</p>}

            {/* NO DATA */}
            {!loading && filteredData.length === 0 && (
                <p className={styles.noData}>No transactions found.</p>
            )}

            {/* TABLE */}
            {!loading && filteredData.length > 0 && (
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>TXN ID</th>
                                <th>{transactionType === "seller" ? "Seller" : "Supplier"}</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            <AnimatePresence>
                                {currentData.map((txn) => (
                                    <motion.tr
                                        key={txn.id}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <td>{txn.txn_id}</td>

                                        <td>
                                            {txn.seller_name || txn.supplier_name}
                                            <br />
                                            <span className={styles.emailText}>
                                                {txn.seller_email || txn.supplier_email}
                                            </span>
                                        </td>

                                        <td>{txn.description || "-"}</td>
                                        <td>₹{txn.amount}</td>
                                        <td>{txn.type}</td>

                                        <td>
                                            <span
                                                className={`${styles.status} ${styles[txn.status?.toLowerCase()]
                                                    }`}
                                            >
                                                {txn.status}
                                            </span>
                                        </td>

                                        <td>{new Date(txn.created_at).toLocaleString()}</td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            )}

            {/* PAGINATION */}
            {!loading && totalPages > 1 && (
                <div className={styles.pagination}>
                    <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                        Prev
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            className={`${page === i + 1 ? styles.activePage : ""}`}
                            onClick={() => setPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminTransactions;


import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import styles from "./FinancePayouts.module.css";
import { DollarSign, CreditCard, TrendingUp, FileText } from "lucide-react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const API_BASE = "http://localhost:3000/api/supplier";

const FinancePayouts = () => {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalEarnings: 0,
    pendingPayouts: 0,
    monthlyGrowth: 0,
  });

  const [settings, setSettings] = useState(null);

  const [withdrawals, setWithdrawals] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [payouts, setPayouts] = useState([]);

  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("UPI");
  const [withdrawing, setWithdrawing] = useState(false);

  // ===============================
  // EXCEL EXPORT
  // ===============================
  const downloadExcel = useCallback(() => {
    if (!payouts.length) return;

    const data = payouts.map((p) => ({
      Date: new Date(p.date).toLocaleDateString(),
      Amount: p.amount,
      Status: p.status,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");

    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "Supplier_Transactions.xlsx"
    );
  }, [payouts]);

  // ===============================
  // FETCH FINANCE DATA
  // ===============================
  const fetchFinanceData = useCallback(async () => {
    try {
      const token = localStorage.getItem("supplierToken");
      if (!token) return setLoading(false);

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const [statsRes, trendRes, payoutsRes] = await Promise.all([
        axios.get(`${API_BASE}/finance/stats`, config),
        axios.get(`${API_BASE}/finance/earnings-trend`, config),
        axios.get(`${API_BASE}/finance/payouts`, config),
      ]);

      setStats({
        totalEarnings: statsRes.data?.totalEarnings || 0,
        pendingPayouts: statsRes.data?.pendingPayouts || 0,
        monthlyGrowth: statsRes.data?.monthlyGrowth || 0,
      });

      setChartData(trendRes.data?.trend || []);
      setPayouts(payoutsRes.data?.payouts || []);
    } catch (err) {
      console.error("Finance Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFinanceData();
    fetchSupplierSettings();
    fetchWithdrawHistory();   // 👈 ADD THIS
  }, [fetchFinanceData]);

  const fetchSupplierSettings = useCallback(async () => {
    try {
      const token = localStorage.getItem("supplierToken");
      if (!token) return;

      const res = await axios.get(
        `${API_BASE}/settings`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSettings(res.data.settings);
    } catch (err) {
      console.error("Settings fetch error", err);
    }
  }, []);


  // ===============================
  // WITHDRAW
  // ===============================
  const handleWithdraw = async () => {
    if (!withdrawAmount || withdrawAmount <= 0) {
      return alert("Enter valid amount");
    }

    try {
      setWithdrawing(true);
      const token = localStorage.getItem("supplierToken");

      await axios.post(
        `${API_BASE}/finance/withdraw`,
        { amount: withdrawAmount, method: withdrawMethod },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Withdraw request submitted ✅");
      setShowWithdraw(false);
      setWithdrawAmount("");
      fetchFinanceData();
    } catch (err) {
      alert(err.response?.data?.message || "Withdraw failed");
    } finally {
      setWithdrawing(false);
    }
  };
  const fetchWithdrawHistory = useCallback(async () => {
    try {
      const token = localStorage.getItem("supplierToken");
      if (!token) return;

      const res = await axios.get(
        `${API_BASE}/finance/withdrawals`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setWithdrawals(res.data.withdrawals || []);
    } catch (err) {
      console.error("Withdraw history error", err);
    }
  }, []);

  // ===============================
  // LOADING
  // ===============================
  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.loader}>Fetching finance insights…</div>
      </div>
    );
  }

  return (
    <section className={styles.wrapper}>
      <header className={styles.header}>
        <h2>Finance & Payouts</h2>
      </header>

      {/* ===== STATS ===== */}
      <div className={styles.statsGrid}>
        <StatCard icon={<DollarSign />} title="Total Earnings" value={`₹${stats.totalEarnings}`} />
        <StatCard icon={<CreditCard />} title="Pending Payouts" value={`₹${stats.pendingPayouts}`} />
        <StatCard icon={<TrendingUp />} title="This Month Growth" value={`${stats.monthlyGrowth}%`} />
      </div>

      {/* ===== CHART ===== */}
      <div className={styles.chartCard}>
        <h3>Monthly Earnings Overview</h3>

        {chartData.length ? (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <Line type="monotone" dataKey="earnings" stroke="#007bff" strokeWidth={2} />
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p>No earnings data available</p>
        )}
      </div>

      {/* ===== WITHDRAW BUTTON ===== */}
      <div className={styles.withdrawBar}>
        <button className={styles.withdrawBtn} onClick={() => setShowWithdraw(true)}>
          Withdraw Funds
        </button>
      </div>

      {/* ===== PAYOUTS TABLE ===== */}
      <div className={styles.tableCard}>
        <h3>Recent Transactions</h3>

        <div className={styles.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Invoice</th>
              </tr>
            </thead>
            <tbody>
              {payouts.length ? (
                payouts.map((p) => (
                  <tr key={p.id}>
                    <td>{new Date(p.date).toLocaleDateString()}</td>
                    <td>₹{p.amount}</td>
                    <td>
                      <span className={`${styles.badge} ${styles[p.status?.toLowerCase()] || styles.default}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <button className={styles.downloadBtn} onClick={downloadExcel}>
                        <FileText size={16} /> Export Excel
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== WITHDRAW MODAL ===== */}
      {showWithdraw && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h3>Withdraw Funds</h3>

            <input
              type="number"
              placeholder="Enter amount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />

            <select
              value={withdrawMethod}
              onChange={(e) => setWithdrawMethod(e.target.value)}
            >
              <option value="UPI">UPI</option>
              <option value="Bank">Bank Transfer</option>
              <option value="Card">Card (Debit / Credit)</option>
            </select>

            {/* INFO TEXT BASED ON METHOD */}
            {withdrawMethod === "UPI" && settings?.upi_id && (
              <div className={styles.savedBox}>
                <p><strong>UPI ID:</strong> {settings.upi_id}</p>
              </div>
            )}

            {withdrawMethod === "Bank" && settings?.account_number && (
              <div className={styles.savedBox}>
                <p><strong>Bank:</strong> {settings.bank_name}</p>
                <p><strong>Account Holder:</strong> {settings.account_holder}</p>
                <p><strong>Account No:</strong> ****{settings.account_number.slice(-4)}</p>
                <p><strong>IFSC:</strong> {settings.ifsc_code}</p>
              </div>
            )}

            {withdrawMethod === "Card" && settings?.card_last4 && (
              <div className={styles.savedBox}>
                <p><strong>Card:</strong> {settings.card_brand}</p>
                <p><strong>Card Holder:</strong> {settings.card_holder}</p>
                <p><strong>Card No:</strong> **** **** **** {settings.card_last4}</p>
              </div>
            )}
            <div className={styles.modalActions}>
              <button onClick={handleWithdraw} disabled={withdrawing}>
                {withdrawing ? "Processing..." : "Submit"}
              </button>
              <button onClick={() => setShowWithdraw(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}{/* ===== WITHDRAW HISTORY ===== */}
      <div className={styles.tableCard}>
        <h3>Withdraw History</h3>

        <div className={styles.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Admin Note</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.length ? (
                withdrawals.map((w) => (
                  <tr key={w.id}>
                    <td>{new Date(w.created_at).toLocaleDateString()}</td>
                    <td>₹{w.amount}</td>
                    <td>{w.method}</td>
                    <td>
                      <span
                        className={`${styles.badge} ${styles[w.status?.toLowerCase()] || styles.default
                          }`}
                      >
                        {w.status}
                      </span>
                    </td>
                    <td>{w.admin_note || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No withdraw requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>

  );
};

// ===============================
// SMALL REUSABLE COMPONENT
// ===============================
const StatCard = ({ icon, title, value }) => (
  <div className={styles.statCard}>
    <div className={styles.icon}>{icon}</div>
    <div>
      <h4>{title}</h4>
      <p>{value}</p>
    </div>
  </div>
);

export default FinancePayouts;

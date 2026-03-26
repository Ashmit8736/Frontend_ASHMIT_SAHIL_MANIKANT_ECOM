import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import styles from "./Dashboard.module.css";
import {
  IndianRupee,
  ShoppingCart,
  UsersRound,
  Package,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import BarChart from "../Chart/BarChart";
import SalesPieChart from "../Chart/SalesPieChart";
import { statusColors } from "../statusColors/statusColors";

const API_BASE = "http://localhost:3000/api/supplier";

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className={styles.pagination}>
    <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
      ◀ Prev
    </button>
    <span>{currentPage} / {totalPages}</span>
    <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
      Next ▶
    </button>
  </div>
);
const DashboardOverview = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
const [orderPage, setOrderPage]             = useState(1);
const [orderTotalPages, setOrderTotalPages] = useState(1);
const ordersRef                             = useRef(null);
  useEffect(() => {
    const token = localStorage.getItem("supplierToken");
    if (!token) return;

    fetchDashboardStats();
    fetchOrders(1);
  }, []);

const fetchDashboardStats = async () => {
  const token = localStorage.getItem("supplierToken");
  if (!token) return;
  try {
    const res = await axios.get(`${API_BASE}/dashboard/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setStats(res.data);
  } catch (err) {
    console.error("Stats API error:", err);
  } finally {
    setLoading(false);
  }
};

const fetchOrders = async (page = 1) => {
  const token = localStorage.getItem("supplierToken");
  if (!token) return;
  try {
    const res = await axios.get(
      `${API_BASE}/dashboard/recent-orders?page=${page}&limit=5`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setRecentOrders(res.data.orders || []);
    setOrderTotalPages(res.data.pagination?.totalPages || 1);
    setOrderPage(page);
    setTimeout(() => {
      ordersRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  } catch (err) {
    console.error("Orders API error:", err);
  }
};


  if (loading) return <p>Loading dashboard...</p>;
  if (!stats) return <p>No dashboard data</p>;

  return (
    <div className={styles.dashboard}>
      <h2>Supplier Dashboard</h2>

      {/* ================= STATS ================= */}
      <div className={styles.firstCont}>
        {/* Revenue */}
        <div className={styles.card}>
          <div className={styles.firstblock}>
            <span>Total Revenue</span>
            {/* <div className={styles.iconWrap}>
    <IndianRupee size={18} />
  </div> */}
          </div>

          <div className={styles.lowerblock}>
            <p className={styles.digit}>
              ₹{Number(stats.totalRevenue).toLocaleString()}
            </p>



          </div>
        </div>

        {/* Orders */}
        <div className={styles.card}>
          <div className={styles.firstblock}>
            <span>Total Orders</span>
            {/* <ShoppingCart size={18} /> */}
          </div>
          <div className={styles.lowerblock}>
            <p className={styles.digit}>{stats.totalOrders}</p>
            {/* <p>
              {stats.ordersGrowth >= 0 ? (
                <TrendingUp color="#00A63D" size={16} />
              ) : (
                <TrendingDown color="#FF4D4D" size={16} />
              )}
              
              
            </p> */}
          </div>
        </div>

        {/* Customers */}
        {/* <div className={styles.card}>
          <div className={styles.firstblock}>
            <span>Active Customers</span>
            <UsersRound size={18} />
          </div>
          <div className={styles.lowerblock}>
            <p className={styles.digit}>{stats.customers}</p>
            <p>
              {stats.customerGrowth >= 0 ? (
                <TrendingUp color="#00A63D" size={16} />
              ) : (
                <TrendingDown color="#FF4D4D" size={16} />
              )}
              <span className={styles.percent}>
                {stats.customerGrowth}%
              </span>{" "}
              from last month
            </p>
          </div>
        </div> */}

        {/* Products */}
        <div className={styles.card}>
          <div className={styles.firstblock}>
            <span>Products</span>
          </div>

          <div className={styles.lowerblock}>
            <p className={styles.digit}>{stats.products}</p>
          </div>
        </div>
      </div>

      {/* ================= CHARTS ================= */}
      {/* <div className={styles.firstCont}>
        <div className={styles.chart}>
          <h3>Sales Overview</h3>
          <BarChart />
        </div>
        <div className={styles.chart}>
          <h3>Sales by Category</h3>
          <SalesPieChart />
        </div>
      </div> */}

      {/* ================= RECENT ORDERS ================= */}
      {/* ================= RECENT ORDERS ================= */}
      <div className={styles.firstCont}>
        <div className={styles.Lowercard} ref={ordersRef}>
          <div className={styles.recentHeader}>
            <h3>Recent Orders</h3>
            <span className={styles.recentHint}>Page {orderPage} — showing 5 orders</span>
          </div>

          {recentOrders.length === 0 && (
            <div className={styles.emptyState}>
              <p>No recent orders yet</p>
            </div>
          )}

          {recentOrders.map((ord, index) => {
            const statusMeta =
              statusColors.find((s) => s.status === ord.order_status) || {};

            return (
              <div
                key={`${ord.order_item_id}-${index}`}
                className={styles.orderRow}
              >
                {/* LEFT */}
                <div className={styles.left}>
                  <p className={styles.orderId}>Order #{ord.order_id}</p>

                  <p className={styles.customer}>
                    {ord.buyer_name || "Buyer"}
                  </p>

                  <p className={styles.phone}>
                    {ord.buyer_phone || "—"}
                  </p>
                </div>

                {/* RIGHT */}
                <div className={styles.right}>
                  <p className={styles.amount}>₹{ord.net_amount}</p>

                  <span
                    className={styles.status}
                    style={{
                      backgroundColor: statusMeta.bgCol,
                      color: statusMeta.color,
                    }}
                  >
                    {ord.order_status}
                  </span>
                </div>
              </div>
            );
          })}
          <Pagination
  currentPage={orderPage}
  totalPages={orderTotalPages}
  onPageChange={fetchOrders}
/>
        </div>
      </div>

    </div>
  );
};

export default DashboardOverview;

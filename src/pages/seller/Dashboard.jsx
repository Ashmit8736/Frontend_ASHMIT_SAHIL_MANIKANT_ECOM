import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Dashboard.module.css";
import {
    LineChart, Line,
    AreaChart, Area,
    CartesianGrid, XAxis, YAxis,
    Tooltip, ResponsiveContainer
} from "recharts";

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        revenue: 0,
        products: 0
    });

    const [recentOrders, setRecentOrders] = useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [recentProducts, setRecentProducts] = useState([]);
    const [orderGraph, setOrderGraph] = useState([]);
    const [revenueGraph, setRevenueGraph] = useState([]);

    const token = localStorage.getItem("sellerToken");
    const config = { headers: { Authorization: `Bearer ${token}` }, withCredentials: true };

    function timeAgo(dateString) {
        if (!dateString) return "Unknown";

        const safeDate = new Date(dateString); 

        if (isNaN(safeDate.getTime())) return "Invalid date";

        const seconds = Math.floor((Date.now() - safeDate.getTime()) / 1000);

        if (seconds < 0) return "Just now";
        if (seconds < 60) return "Just now";

        const intervals = [
            { label: "year",   seconds: 31536000 },
            { label: "month",  seconds: 2592000  },
            { label: "day",    seconds: 86400    },
            { label: "hour",   seconds: 3600     },
            { label: "minute", seconds: 60       },
        ];

        for (const i of intervals) {
            const count = Math.floor(seconds / i.seconds);
            if (count >= 1) return `${count} ${i.label}${count > 1 ? "s" : ""} ago`;
        }

        return "Just now";
    }

    const fetchDashboard = async () => {
        try {
            const ordersRes = await axios.get("http://localhost:3000/api/seller/orders", config);
            const orders = ordersRes.data.orders || [];
            const pending = orders.filter(o => o.status === "Pending").length;

            const statsRes = await axios.get(
                "http://localhost:3000/api/seller/dashboard/stats",
                config
            );

            const orderGraphRes = await axios.get(
                "http://localhost:3000/api/seller/dashboard/order-graph",
                config
            );
            setOrderGraph(orderGraphRes.data.graph || []);

            const walletRes = await axios.get("http://localhost:3000/api/seller/payments/wallet", config);

            // ✅ Products fetch with debug logs
            const prodRes = await axios.get("http://localhost:3000/api/seller/products", config);
            console.log("PRODUCTS RES:", prodRes.data);
            const products = prodRes.data.products || prodRes.data.data || prodRes.data || [];
            console.log("PRODUCTS SAMPLE:", products[0]);

            setStats({
                totalOrders: orders.length,
                pendingOrders: pending,
                revenue: statsRes.data.totalRevenue || 0,
                products: products.length
            });

            setRecentOrders(orders.slice(0, 5));
            setRecentProducts(products.slice(0, 5));

            const txRes = await axios.get("http://localhost:3000/api/seller/payments/transactions", config);
            setRecentTransactions((txRes.data.transactions || []).slice(0, 5));

            const revData = {};
            (txRes.data.transactions || []).forEach(t => {
                const day = new Date(t.created_at).toLocaleDateString("en-US", { weekday: "short" });
                revData[day] = (revData[day] || 0) + Number(t.amount);
            });
            setRevenueGraph(Object.keys(revData).map(day => ({ day, revenue: revData[day] })));

        } catch (err) {
            console.error("DASHBOARD ERROR:", err);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const statCards = [
        { title: "Total Orders", key: "totalOrders", icon: "📦", color: "linear-gradient(135deg,#667eea,#764ba2)" },
        { title: "Revenue", key: "revenue", icon: "💰", color: "linear-gradient(135deg,#4facfe,#00f2fe)" },
        { title: "Products", key: "products", icon: "🛍️", color: "linear-gradient(135deg,#43e97b,#38f9d7)" },
    ];

    return (
        <div className={styles.sellerDashboardHome}>
            <h1>Welcome to Your Dashboard</h1>

            <div className={styles.statsGrid}>
                {statCards.map((s, i) => (
                    <div key={i} className={styles.statCard} style={{ background: s.color }}>
                        <div className={styles.statIcon}>{s.icon}</div>
                        <div className={styles.statContent}>
                            <h3>{s.key === "revenue" ? `₹${stats[s.key]}` : stats[s.key]}</h3>
                            <p>{s.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.graphSection}>
                <h2>Analytics Overview</h2>
                <div className={styles.graphGrid}>
                    <div className={styles.graphBox}>
                        <h3>📦 Orders (Recent)</h3>
                        {orderGraph.length === 0 ? (
                            <p style={{ textAlign: "center", marginTop: "90px", color: "#888" }}>
                                No order data yet
                            </p>
                        ) : (
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={orderGraph}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="orders"
                                        stroke="#667eea"
                                        strokeWidth={3}
                                        dot={{ r: 4 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>

            <div className={styles.recentActivity}>
                <h2>Recent Activity</h2>
                <div className={styles.activityColumns}>

                    {/* Recent Orders */}
                    <div className={styles.activityBox}>
                        <h3>🧾 Recent Orders</h3>
                        {recentOrders.length === 0 ? <p>No recent orders</p> :
                            recentOrders.map((o, i) => (
                                <div key={i} className={styles.activityItem}>
                                    <span className={styles.activityIcon}>📦</span>
                                    <div>
                                        <p>Order {o.order_number} – {o.status}</p>
                                        <small>{timeAgo(o.created_at)}</small>
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                    {/* Recent Products */}
                    <div className={styles.activityBox}>
                        <h3>🛍️ Recent Products</h3>
                        {recentProducts.length === 0 ? <p>No products added recently</p> :
                            recentProducts.map((p, i) => (
                                <div key={i} className={styles.activityItem}>
                                    <span className={styles.activityIcon}>📈</span>
                                    <div>
                                        <p>{p.product_name} – ₹{p.product_price}</p>
                                        <small>
                                            {timeAgo(p.created_at || p.createdAt || p.added_at || p.date)}
                                        </small>
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
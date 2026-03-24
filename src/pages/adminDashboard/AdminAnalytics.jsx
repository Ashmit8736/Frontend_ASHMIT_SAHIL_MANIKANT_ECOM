// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//     LineChart,
//     Line,
//     XAxis,
//     YAxis,
//     CartesianGrid,
//     Tooltip,
//     ResponsiveContainer,
// } from "recharts";
// import { motion } from "framer-motion";
// import styles from "./AdminAnalytics.module.css";

// const AdminAnalytics = () => {
//     const [selectedRange, setSelectedRange] = useState("7");
//     const [metrics, setMetrics] = useState(null);
//     const [chartData, setChartData] = useState([]);
//     const [loading, setLoading] = useState(false);

//     const fetchAnalytics = async (rangeValue) => {
//         try {
//             setLoading(true);

//             const token = localStorage.getItem("adminToken");

//             const res = await axios.get(
//                 `http://localhost:3000/api/admin/analytics?range=${rangeValue}`,
//                 {
//                     headers: { Authorization: `Bearer ${token}` },
//                 }
//             );

//             setMetrics(res.data.metrics);
//             setChartData(res.data.revenueTrend);

//         } catch (err) {
//             console.error("Analytics Fetch Error:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchAnalytics(selectedRange);
//     }, [selectedRange]);

//     return (
//         <motion.div
//             className={styles.analyticsContainer}
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.6 }}
//         >
//             <div className={styles.header}>
//                 <div>
//                     <h2>Analytics & Reports</h2>
//                 </div>

//                 {/* Range Selector */}
//                 <select
//                     className={styles.dropdown}
//                     value={selectedRange}
//                     onChange={(e) => setSelectedRange(e.target.value)}
//                 >
//                     <option value="7">Last 7 days</option>
//                     <option value="30">Last 30 days</option>
//                     <option value="365">This Year</option>
//                 </select>
//             </div>

//             {loading ? (
//                 <p>Loading Analytics...</p>
//             ) : (
//                 <>
//                     {/* Metrics Cards */}
//                     {metrics && (
//                         <div className={styles.metricsGrid}>
//                             <motion.div
//                                 className={`${styles.metricCard} ${styles.green}`}
//                                 whileHover={{ scale: 1.03 }}
//                             >
//                                 <h4>Total Revenue</h4>
//                                 <p className={styles.value}>₹{metrics.totalRevenue.toLocaleString()}</p>
//                                 <span className={styles.positive}>
//                                     {metrics.revenueChange || 0}%
//                                 </span>
//                                 <span className={styles.positive}>
//                                     {metrics.revenueChange}%
//                                 </span>
//                             </motion.div>

//                             <motion.div
//                                 className={`${styles.metricCard} ${styles.blue}`}
//                                 whileHover={{ scale: 1.03 }}
//                             >
//                                 <h4>Total Orders</h4>
//                                 <p className={styles.value}>{metrics.totalOrders}</p>
//                                 <span className={styles.positive}>
//                                     {metrics.ordersChange}%
//                                 </span>
//                             </motion.div>

//                             <motion.div
//                                 className={`${styles.metricCard} ${styles.purple}`}
//                                 whileHover={{ scale: 1.03 }}
//                             >
//                                 <h4>New Customers</h4>
//                                 <p className={styles.value}>{metrics.newCustomers}</p>
//                                 <span className={styles.positive}>
//                                     {metrics.customersChange}%
//                                 </span>
//                             </motion.div>

//                             <motion.div
//                                 className={`${styles.metricCard} ${styles.orange}`}
//                                 whileHover={{ scale: 1.03 }}
//                             >
//                                 <h4>Avg. Order Value</h4>
//                                 <p className={styles.value}>₹{metrics.avgOrderValue}</p>
//                                 <span
//                                     className={
//                                         metrics.avgOrderChange < 0
//                                             ? styles.negative
//                                             : styles.positive
//                                     }
//                                 >
//                                     {metrics.avgOrderChange}%
//                                 </span>
//                             </motion.div>
//                         </div>
//                     )}

//                     {/* Revenue Chart */}
//                     <motion.div
//                         className={styles.chartCard}
//                         whileHover={{ scale: 1.01 }}
//                     >
//                         <h3>Revenue Trends</h3>

//                         <ResponsiveContainer width="100%" height={260}>
//                             <LineChart data={chartData}>
//                                 <CartesianGrid strokeDasharray="3 3" />
//                                 <XAxis dataKey="date" />
//                                 <YAxis />
//                                 <Tooltip />
//                                 <Line
//                                     type="monotone"
//                                     dataKey="revenue"
//                                     stroke="#22c55e"
//                                     strokeWidth={2}
//                                 />
//                             </LineChart>
//                         </ResponsiveContainer>
//                     </motion.div>
//                 </>
//             )}
//         </motion.div>
//     );
// };

// export default AdminAnalytics;

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import styles from "./AdminAnalytics.module.css";

const AdminAnalytics = () => {
    const [selectedRange, setSelectedRange] = useState("7");
    const [metrics, setMetrics] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchAnalytics = async (rangeValue) => {
        try {
            setLoading(true);

            const token = localStorage.getItem("adminToken");

            const res = await axios.get(
                `http://localhost:3000/api/admin/analytics?range=${rangeValue}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMetrics(res.data.metrics);
            setChartData(res.data.chartData);

        } catch (err) {
            console.error("Analytics Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics(selectedRange);
    }, [selectedRange]);

    return (
        <motion.div className={styles.analyticsContainer}>
            <div className={styles.header}>
                <h2>Analytics & Reports</h2>

                <select
                    className={styles.dropdown}
                    value={selectedRange}
                    onChange={(e) => setSelectedRange(e.target.value)}
                >
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="365">This Year</option>
                </select>
            </div>

            {loading ? (
                <p>Loading Analytics...</p>
            ) : (
                <>
                    {/* Metrics Section */}
                    {metrics && (
                        <div className={styles.metricsGrid}>

                            <motion.div className={`${styles.metricCard} ${styles.green}`}>
                                <h4>Total Revenue</h4>
                                <p className={styles.value}>₹{metrics.totalRevenue.toLocaleString()}</p>
                                <span className={styles.positive}>0%</span>
                            </motion.div>

                            <motion.div className={`${styles.metricCard} ${styles.blue}`}>
                                <h4>Total Orders</h4>
                                <p className={styles.value}>{metrics.totalOrders}</p>
                                <span className={styles.positive}>0%</span>
                            </motion.div>

                            <motion.div className={`${styles.metricCard} ${styles.purple}`}>
                                <h4>New Customers</h4>
                                <p className={styles.value}>{metrics.newCustomers}</p>
                                <span className={styles.positive}>0%</span>
                            </motion.div>

                            <motion.div className={`${styles.metricCard} ${styles.orange}`}>
                                <h4>Avg. Order Value</h4>
                                <p className={styles.value}>₹{metrics.avgOrderValue}</p>
                                <span className={styles.positive}>0%</span>
                            </motion.div>

                        </div>
                    )}

                    {/* Revenue Trend Chart */}
                    <motion.div className={styles.chartCard}>
                        <h3>Revenue Trends</h3>

                        <ResponsiveContainer width="100%" height={260}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#22c55e"
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </motion.div>
                </>
            )}
        </motion.div>
    );
};

export default AdminAnalytics;

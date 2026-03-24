

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";
// import style from "./Admin.module.css";

// // =======================
// // ⭐ STAT CARD
// // =======================
// const StatCard = ({ title, value, change, color, icon }) => (
//   <motion.div
//     className={`${style.statCard} ${color}`}
//     whileHover={{ scale: 1.03 }}
//   >
//     <div className={style.statHeader}>
//       <div className={style.iconCircle}>{icon}</div>
//       <span className={style.positiveChange}>{change}</span>
//     </div>
//     <div className={style.statBody}>
//       <p className={style.value}>{value}</p>
//       <h4>{title}</h4>
//     </div>
//   </motion.div>
// );

// // =======================
// // ⭐ RECENT ORDERS
// // =======================
// const RecentOrdersTable = ({ orders }) => (
//   <div className={style.recentOrdersCard}>
//     <h3>Recent Orders</h3>

//     {orders.map((order, i) => (
//       <div key={i} className={style.orderRow}>
//         <div className={style.orderIdName}>
//           <p className={style.orderId}>{order.order_id}</p>
//           <p className={style.customerName}>{order.buyer_name}</p>
//           <span className={style.orderDate}>
//             {order.created_at?.substring(0, 10)}
//           </span>
//         </div>

//         <div className={style.orderTotalStatus}>
//           <p className={style.orderTotal}>₹{order.amount}</p>
//           <span
//             className={`${style.statusBadge} ${style[order.status.toUpperCase()]}`}
//           >
//             {order.status}
//           </span>       </div>
//       </div>
//     ))}
//   </div>
// );

// // =======================
// // ⭐ TOP PRODUCTS
// // =======================
// const TopProductsList = ({ products }) => (
//   <div className={style.topProductsCard}>
//     <h3>Top Products</h3>

//     {products.map((product, i) => (
//       <div key={i} className={style.productRow}>
//         <div className={style.productInfo}>
//           <div className={style.productIcon}>📦</div>
//           <div>
//             <p className={style.productName}>{product.name}</p>
//             <span className={style.productUnits}>
//               {product.units} units sold
//             </span>
//           </div>
//         </div>

//         <div className={style.productSalesTrend}>
//           <p className={style.productSales}>₹{product.sales}</p>
//         </div>
//       </div>
//     ))}
//   </div>
// );

// // =================================
// //        MAIN DASHBOARD
// // =================================
// const Admin = () => {
//   const [stats, setStats] = useState(null);
//   const [dashboardCounts, setDashboardCounts] = useState(null);
//   const [revenueChart, setRevenueChart] = useState([]);
//   const [categoryStats, setCategoryStats] = useState([]);
//   const [topProducts, setTopProducts] = useState([]);
//   const [recentOrders, setRecentOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const token = localStorage.getItem("adminToken");
//   const headers = { Authorization: `Bearer ${token}` };

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);

//       const [
//         analyticsRes,
//         ordersRes,
//         productsRes,
//         categoryRes,
//         dashboardRes,
//       ] = await Promise.all([
//         axios.get("http://localhost:3000/api/admin/analytics?range=365", { headers }),
//         axios.get("http://localhost:3000/api/admin/orders", { headers }),
//         axios.get("http://localhost:3000/api/admin/top-products", { headers }),
//         axios.get("http://localhost:3000/api/admin/category-stats", { headers }),
//         axios.get("http://localhost:3000/api/admin/dashboard-stats", { headers }),
//       ]);

//       setStats(analyticsRes.data.metrics);
//       setRevenueChart(analyticsRes.data.chartData);
//       setRecentOrders(ordersRes.data.orders);
//       setTopProducts(productsRes.data.products);
//       setCategoryStats(categoryRes.data.categories);
//       setDashboardCounts(dashboardRes.data.data);
//     } catch (error) {
//       console.error("Dashboard Load Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const COLORS = ["#4F46E5", "#8B5CF6", "#10B981", "#F59E0B", "#4B5563"];

//   if (loading || !dashboardCounts?.orders || !dashboardCounts?.products) {

//     return <p className={style.loading}>Loading dashboard...</p>;
//   }

//   return (
//     <motion.div
//       className={style.adminContainer}
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.6 }}
//     >
//       <div className={style.header}>
//         <h2 className={style.dashboardTitle}>Dashboard Overview</h2>
//       </div>

//       {/* =======================
//           STAT CARDS
//       ======================= */}
//       <div className={style.statsGrid}>
//         <StatCard
//           title="Total Revenue"
//           value={`₹${dashboardCounts.orders.revenue}`}
//           icon="💰"
//           color={style.statGreen}
//         />

//         <StatCard
//           title="Total Orders"
//           value={dashboardCounts.orders.total}
//           icon="🛒"
//           color={style.statBlue}
//         />

//         <StatCard
//           title="Total Products"
//           value={dashboardCounts.products.total}
//           icon="📦"
//           color={style.statPurple}
//         />

//         <StatCard
//           title="Seller Products"
//           value={dashboardCounts.products.seller}
//           icon="🏪"
//           color={style.statOrange}
//         />

//         <StatCard
//           title="Supplier Products"
//           value={dashboardCounts.products.supplier}
//           icon="🏭"
//           color={style.statGreen}
//         />

//         <StatCard
//           title="Total Buyers"
//           value={dashboardCounts.users.buyers}
//           icon="👤"
//           color={style.statBlue}
//         />

//       </div>

//       {/* =======================
//           CHARTS
//       ======================= */}
//       <div className={style.mainContentGrid}>
//         <div className={style.revenueChartCard}>
//           <h3>Revenue Overview</h3>

//           {revenueChart.length > 0 ? (
//             <ResponsiveContainer width="100%" height={250}>
//               <AreaChart data={revenueChart}>
//                 <XAxis
//                   dataKey="date"
//                   tickFormatter={(d) =>
//                     new Date(d).toLocaleDateString("en-IN", {
//                       day: "2-digit",
//                       month: "short",
//                     })
//                   }
//                 />
//                 <YAxis
//                   tickFormatter={(v) => `₹${Number(v).toLocaleString("en-IN")}`}
//                 />
//                 <Tooltip
//                   formatter={(v) => `₹${Number(v).toLocaleString("en-IN")}`}
//                   labelFormatter={(d) =>
//                     new Date(d).toLocaleDateString("en-IN", {
//                       day: "2-digit",
//                       month: "short",
//                       year: "numeric",
//                     })
//                   }
//                 />
//                 <Area
//                   type="monotone"
//                   dataKey="revenue"
//                   stroke="#4F46E5"
//                   fill="#4F46E5"
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           ) : (
//             <p className={style.noData}>No revenue data available</p>
//           )}
//         </div>

//         <div className={style.categoryCard}>
//           <h3>Sales by Category</h3>

//           {categoryStats.length > 0 ? (
//             <>
//               <ResponsiveContainer width="100%" height={200}>
//                 <PieChart>
//                   <Pie
//                     data={categoryStats}
//                     dataKey="percentage"
//                     nameKey="name"
//                     innerRadius={60}
//                     outerRadius={80}
//                   >
//                     {categoryStats.map((_, i) => (
//                       <Cell key={i} fill={COLORS[i % COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </ResponsiveContainer>

//               {categoryStats.length === 1 && (
//                 <p className={style.categoryNote}>
//                   Category-wise breakup will appear once more data is available
//                 </p>
//               )}
//             </>
//           ) : (
//             <p className={style.noData}>No category data</p>
//           )}
//         </div>


//         {/* =======================
//           BOTTOM SECTION
//       ======================= */}
//         <div className={style.bottomContentGrid}>
//           <RecentOrdersTable orders={recentOrders} />

//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default Admin;

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import style from "./Admin.module.css";

// =======================
// ⭐ PAGINATION
// =======================
const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className={style.pagination}>
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
    >
      ◀ Prev
    </button>
    <span>{currentPage} / {totalPages}</span>
    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
    >
      Next ▶
    </button>
  </div>
);

// =======================
// ⭐ STAT CARD
// =======================
const StatCard = ({ title, value, change, color, icon }) => (
  <motion.div
    className={`${style.statCard} ${color}`}
    whileHover={{ scale: 1.03 }}
  >
    <div className={style.statHeader}>
      <div className={style.iconCircle}>{icon}</div>
      <span className={style.positiveChange}>{change}</span>
    </div>
    <div className={style.statBody}>
      <p className={style.value}>{value}</p>
      <h4>{title}</h4>
    </div>
  </motion.div>
);

// =======================
// ⭐ RECENT ORDERS
// =======================
const RecentOrdersTable = ({ orders }) => (
  <div className={style.recentOrdersCard}>
    <h3>Recent Orders</h3>
    {orders.map((order, i) => (
      <div key={i} className={style.orderRow}>
        <div className={style.orderIdName}>
          <p className={style.orderId}>{order.order_id}</p>
          <p className={style.customerName}>{order.buyer_name}</p>
          <span className={style.orderDate}>
            {order.order_date?.substring(0, 10)}
          </span>
        </div>
        <div className={style.orderTotalStatus}>
          <p className={style.orderTotal}>₹{order.amount}</p>
          <span
            className={`${style.statusBadge} ${style[order.status?.toUpperCase()]}`}
          >
            {order.status}
          </span>
        </div>
      </div>
    ))}
  </div>
);

// =================================
//        MAIN DASHBOARD
// =================================
const Admin = () => {
  const [stats, setStats] = useState(null);
  const [dashboardCounts, setDashboardCounts] = useState(null);
  const [revenueChart, setRevenueChart] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Pagination states
  const [orderPage, setOrderPage] = useState(1);
  const [orderTotalPages, setOrderTotalPages] = useState(1);

  // ✅ Ref for auto scroll
  const ordersRef = useRef(null);

  const token = localStorage.getItem("adminToken");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchDashboardData();
    fetchOrders(1);
  }, []);

  // ✅ Orders — paginated + auto scroll to top
  const fetchOrders = async (page = 1) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/admin/orders?page=${page}&limit=10`,
        { headers }
      );
      setRecentOrders(res.data.orders);
      setOrderTotalPages(res.data.pagination.totalPages);
      setOrderPage(page);

      // ✅ Auto scroll to orders section top
      setTimeout(() => {
        ordersRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);

    } catch (error) {
      console.error("Fetch Orders Error:", error);
    }
  };

  // ✅ Baaki sab data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, categoryRes, dashboardRes] = await Promise.all([
        axios.get("http://localhost:3000/api/admin/analytics?range=365", { headers }),
        axios.get("http://localhost:3000/api/admin/category-stats", { headers }),
        axios.get("http://localhost:3000/api/admin/dashboard-stats", { headers }),
      ]);

      setStats(analyticsRes.data.metrics);
      setRevenueChart(analyticsRes.data.chartData);
      setCategoryStats(categoryRes.data.categories);
      setDashboardCounts(dashboardRes.data.data);
    } catch (error) {
      console.error("Dashboard Load Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ["#4F46E5", "#8B5CF6", "#10B981", "#F59E0B", "#4B5563"];

  if (loading || !dashboardCounts?.orders || !dashboardCounts?.products) {
    return <p className={style.loading}>Loading dashboard...</p>;
  }

  return (
    <motion.div
      className={style.adminContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className={style.header}>
        <h2 className={style.dashboardTitle}>Dashboard Overview</h2>
      </div>

      {/* STAT CARDS */}
      <div className={style.statsGrid}>
        <StatCard
          title="Total Revenue"
          value={`₹${dashboardCounts.orders.revenue}`}
          icon="💰"
          color={style.statGreen}
        />
        <StatCard
          title="Total Orders"
          value={dashboardCounts.orders.total}
          icon="🛒"
          color={style.statBlue}
        />
        <StatCard
          title="Total Products"
          value={dashboardCounts.products.total}
          icon="📦"
          color={style.statPurple}
        />
        <StatCard
          title="Seller Products"
          value={dashboardCounts.products.seller}
          icon="🏪"
          color={style.statOrange}
        />
        <StatCard
          title="Supplier Products"
          value={dashboardCounts.products.supplier}
          icon="🏭"
          color={style.statGreen}
        />
        <StatCard
          title="Total Buyers"
          value={dashboardCounts.users.buyers}
          icon="👤"
          color={style.statBlue}
        />
      </div>

      {/* CHARTS */}
      <div className={style.mainContentGrid}>
        <div className={style.revenueChartCard}>
          <h3>Revenue Overview</h3>
          {revenueChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={revenueChart}>
                <XAxis
                  dataKey="date"
                  tickFormatter={(d) =>
                    new Date(d).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                    })
                  }
                />
                <YAxis
                  tickFormatter={(v) =>
                    `₹${Number(v).toLocaleString("en-IN")}`
                  }
                />
                <Tooltip
                  formatter={(v) => `₹${Number(v).toLocaleString("en-IN")}`}
                  labelFormatter={(d) =>
                    new Date(d).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  }
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4F46E5"
                  fill="#4F46E5"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className={style.noData}>No revenue data available</p>
          )}
        </div>

        <div className={style.categoryCard}>
          <h3>Sales by Category</h3>
          {categoryStats.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryStats}
                    dataKey="percentage"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={80}
                  >
                    {categoryStats.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              {categoryStats.length === 1 && (
                <p className={style.categoryNote}>
                  Category-wise breakup will appear once more data is available
                </p>
              )}
            </>
          ) : (
            <p className={style.noData}>No category data</p>
          )}
        </div>

        {/* ✅ BOTTOM — Sirf Recent Orders, Top Products hata diya */}
        <div className={style.bottomContentGrid}>
          <div ref={ordersRef}>  {/* ✅ Scroll yahan aayega */}
            <RecentOrdersTable orders={recentOrders} />
            <Pagination
              currentPage={orderPage}
              totalPages={orderTotalPages}
              onPageChange={fetchOrders}
            />
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default Admin;
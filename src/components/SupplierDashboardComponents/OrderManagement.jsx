

// import React, { useState, useEffect } from "react";
// import styles from "./Order.module.css";
// import { statusColors } from "../statusColors/statusColors";
// import {
//   Eye,
//   Search,
//   ChevronDown,
//   Check,
//   Download,
// } from "lucide-react";
// import api from "../../store/APi/axiosInstance"; // ✅ axiosInstance

// const filterOptions = [
//   "All Orders",
//   "placed",
//   "confirmed",
//   "shipped",
//   "delivered",
// ];

// const optionsRecents = [
//   "Most Recent",
//   "Oldest First",
//   "Highest Value",
//   "Lowest Value",
// ];

// const ITEMS_PER_PAGE = 10;

// const getNextStatus = (status) => {
//   if (status === "placed") return "confirmed";
//   if (status === "confirmed") return "shipped";
//   if (status === "shipped") return "delivered";
//   return null;
// };

// const OrderManagement = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState("All Orders");
//   const [dropdown, setDropdown] = useState(false);
//   const [option, setOption] = useState("Most Recent");

//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedOrder, setSelectedOrder] = useState(null);

//   /* =========================
//      FETCH ORDERS
//   ========================== */
//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const res = await api.get("/supplier/orders");
//         setOrders(res.data.data || []); // ✅ FIX
//       } catch (err) {
//         console.error("Fetch Orders Error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchOrders();
//   }, []);

//   /* =========================
//      UPDATE STATUS
//   ========================== */
// //   const updateStatus = async (orderItemId, status) => {
// //     try {
// //       console.log("ID:", orderItemId);
// //       await api.put(`/supplier/orders/${orderItemId}/status`, { status });

// //       // 🔁 Optimistic update
// //       setOrders((prev) =>
// //         prev.map((o) =>
// //           o.orderItemId === orderItemId ? { ...o, status } : o
// //         )
// //       );
// //     }catch (err) {
// //   console.error("Update status error:", err.response?.data || err.message);
// //   alert(err.response?.data?.message || "Failed to update order status");
// // }

// //   };

// const updateStatus = async (orderId, status) => {
//   try {
//     await api.put(`/supplier/orders/${orderId}/status`, { status });

//     // ✅ CORRECT OPTIMISTIC UPDATE
//     setOrders((prev) =>
//       prev.map((o) =>
//         o.orderId === orderId ? { ...o, status } : o
//       )
//     );
//   } catch (err) {
//     console.error(
//       "Update status error:",
//       err.response?.data || err.message
//     );
//     alert(err.response?.data?.message || "Failed to update order status");
//   }
// };


//   /* =========================
//      RESET PAGE
//   ========================== */
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [filter, search, option]);

//   /* =========================
//      FILTER + SEARCH
//   ========================== */
//   const filteredOrders = orders.filter((order) => {
//     const matchStatus =
//       filter === "All Orders" ? true : order.status === filter;

//     const buyerName = order.buyer?.name || "";
//     const buyerPhone = order.buyer?.phone || "";

//     const matchSearch =
//       buyerName.toLowerCase().includes(search.toLowerCase()) ||
//       buyerPhone.includes(search);

//     return matchStatus && matchSearch;
//   });

//   /* =========================
//      SORT
//   ========================== */
//   const sortedOrders = [...filteredOrders].sort((a, b) => {
//     if (option === "Most Recent")
//       return new Date(b.date) - new Date(a.date);
//     if (option === "Oldest First")
//       return new Date(a.date) - new Date(b.date);
//     if (option === "Highest Value")
//       return Number(b.amount) - Number(a.amount);
//     if (option === "Lowest Value")
//       return Number(a.amount) - Number(b.amount);
//     return 0;
//   });

//   /* =========================
//      PAGINATION
//   ========================== */
//   const totalPages = Math.ceil(sortedOrders.length / ITEMS_PER_PAGE);

//   const paginatedOrders = sortedOrders.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE
//   );

//   if (loading) return <p>Loading orders...</p>;

//   return (
//     <div>
//       <h2>Orders</h2>

//       {/* FILTER */}
//       <div className={styles.orderTabs}>
//         {filterOptions.map((btn) => {
//           const isActive = filter === btn;
//           return (
//             <button
//               key={btn}
//               onClick={() => setFilter(btn)}
//               className={`${styles.tabBtn} ${isActive ? styles.activeTab : ""}`}
//             >
//               {btn === "All Orders"
//                 ? "All"
//                 : btn.charAt(0).toUpperCase() + btn.slice(1)}
//             </button>
//           );
//         })}
//       </div>


//       <div className={styles.contSecond}>
//         {/* TOP BAR */}
//         <div className={styles.topBar}>
//           <div className={styles.searchCustomerWrap}>
//             <Search width={18} />
//             <input
//               type="text"
//               placeholder="Search buyer"
//               onChange={(e) => setSearch(e.target.value)}
//               className={styles.searchCustomer}
//             />
//           </div>

//           <div className={styles.gapping}>
//             {/* SORT */}
//             <div className={styles.wrap}>
//               <div
//                 className={styles.dropdownBtn}
//                 onClick={() => setDropdown(!dropdown)}
//               >
//                 <div>{option}</div>
//                 <ChevronDown width={16} />
//               </div>

//               {dropdown && (
//                 <div className={styles.drop}>
//                   {optionsRecents.map((opt) => (
//                     <p
//                       key={opt}
//                       onClick={() => {
//                         setOption(opt);
//                         setDropdown(false);
//                       }}
//                     >
//                       {opt} {opt === option && <Check width={16} />}
//                     </p>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* TABLE */}
//         <table className={styles.table}>
//           <thead>
//             <tr>
//               <th>Order ID</th>
//               <th>Buyer</th>
//               <th>Date</th>
//               <th>Qty</th>
//               <th>Amount</th>
//               <th>Payment</th>
//               <th>Status</th>
//               <th>Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {paginatedOrders.map((ord) => {
//               const nextStatus = getNextStatus(ord.status);
//               const statusStyle =
//                 statusColors.find((s) => s.status === ord.status) || {};

//               return (
//                 <tr key={ord.orderItemId}>
//                   <td>{ord.orderId}</td>

//                   <td>
//                     {ord.buyer?.name}
//                     <br />
//                     <small>{ord.buyer?.phone}</small>
//                   </td>

//                   <td>{new Date(ord.date).toLocaleDateString()}</td>
//                   <td>{ord.quantity}</td>
//                   <td>₹{ord.amount}</td>
//                   <td>{ord.paymentMode}</td>

//                   <td>
//                     <span
//                       style={{
//                         backgroundColor: statusStyle.bgCol,
//                         padding: "0.4rem 0.8rem",
//                         borderRadius: "1rem",
//                       }}
//                     >
//                       {ord.status}
//                     </span>
//                   </td>

//                   <td>
//                     {nextStatus ? (
//                       <button
//                         className={styles.actionBtn}
//                         // onClick={() =>
//                         //   updateStatus(ord.orderItemId, nextStatus)
//                         // }
//                          onClick={() =>
//                           updateStatus(ord.orderId, nextStatus)
//                         }
//                       >
//                         Mark {nextStatus}
//                       </button>
//                     ) : (
//                       <Eye onClick={() => setSelectedOrder(ord)} />
//                     )}
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>

//         {/* PAGINATION */}
//         {totalPages > 1 && (
//           <div className={styles.pagination}>
//             <button className={styles.pageBtnPrev}
//               disabled={currentPage === 1}
//               onClick={() => setCurrentPage((p) => p - 1)}
//             >
//               Prev
//             </button>

//             <span>
//               Page {currentPage} of {totalPages}
//             </span>

//             <button className={styles.pageBtnNext}
//               disabled={currentPage === totalPages}
//               onClick={() => setCurrentPage((p) => p + 1)}
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </div>

//       {/* VIEW MODAL */}
//       {selectedOrder && (
//         <div className={styles.overlay}>
//           <div className={styles.modal}>
//             <h3>Order Details</h3>
//             <p><b>Order ID:</b> {selectedOrder.orderId}</p>
//             <p><b>Buyer:</b> {selectedOrder.buyer?.name}</p>
//             <p><b>Phone:</b> {selectedOrder.buyer?.phone}</p>
//             <p><b>Status:</b> {selectedOrder.status}</p>
//             <button onClick={() => setSelectedOrder(null)}>Close</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrderManagement;


import React, { useState, useEffect } from "react";
import styles from "./Order.module.css";
import { statusColors } from "../statusColors/statusColors";
import { Eye, Search, ChevronDown, Check } from "lucide-react";
import api from "../../store/APi/axiosInstance";

const filterOptions = [
  "All Orders",
  "placed",
  "confirmed",
  "shipped",
  "delivered",
];

const optionsRecents = [
  "Most Recent",
  "Oldest First",
  "Highest Value",
  "Lowest Value",
];

const ITEMS_PER_PAGE = 10;

const getNextStatus = (status) => {
  if (status === "placed") return "confirmed";
  if (status === "confirmed") return "shipped";
  if (status === "shipped") return "delivered";
  return null;
};

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Orders");
  const [dropdown, setDropdown] = useState(false);
  const [option, setOption] = useState("Most Recent");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState("");


  /* ================= FETCH ================= */
  const fetchOrders = async (page = 1) => {
    
    try {
      setLoading(true);
      

      const res = await api.get(`/supplier/orders`, {
        params: {
          page,
          limit: ITEMS_PER_PAGE,
          search,
          status: filter === "All Orders" ? "" : filter,
          sort: option,
        },
      });

      const data = res.data;
      console.log("API RESPONSE:", data);
console.log("TOTAL PAGES:", data.pagination?.totalPages);
console.log("TOTAL RECORDS:", data.pagination?.totalRecords);


      setOrders(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalRecords(data.pagination?.totalRecords || 0);
      setCurrentPage(page);
    } catch (err) {
      console.error("Fetch Orders Error:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(search);
  }, 400); // 400ms delay

  return () => clearTimeout(timer);
}, [search]);


useEffect(() => {
  fetchOrders(1);
}, [debouncedSearch, filter, option]);


  /* ================= STATUS ================= */
  const updateStatus = async (orderItemId, status) => {
    try {
      await api.put(`/supplier/orders/${orderItemId}/status`, { status });

      setOrders((prev) =>
        prev.map((o) =>
          o.orderItemId === orderItemId ? { ...o, status } : o
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div>
      <h2>Orders</h2>
      <p style={{ color: "#888", fontSize: "0.85rem" }}>
        Total Orders: {totalRecords}
      </p>

      {/* FILTER */}
      <div className={styles.orderTabs}>
        {filterOptions.map((btn) => {
          const isActive = filter === btn;
          return (
            <button
              key={btn}
              onClick={() => {
                setCurrentPage(1);
                setFilter(btn);
              }}
              className={`${styles.tabBtn} ${isActive ? styles.activeTab : ""}`}
            >
              {btn === "All Orders"
                ? "All"
                : btn.charAt(0).toUpperCase() + btn.slice(1)}
            </button>
          );
        })}
      </div>

      <div className={styles.contSecond}>
        {/* TOP BAR */}
        <div className={styles.topBar}>
          <div className={styles.searchCustomerWrap}>
            <Search width={18} />
            <input
              type="text"
              placeholder="Search buyer"
              value={search}
              onChange={(e) => {
                setCurrentPage(1);
                setSearch(e.target.value);
              }}
              className={styles.searchCustomer}
            />
          </div>

          <div className={styles.wrap}>
            <div
              className={styles.dropdownBtn}
              onClick={() => setDropdown(!dropdown)}
            >
              <div>{option}</div>
              <ChevronDown width={16} />
            </div>

            {dropdown && (
              <div className={styles.drop}>
                {optionsRecents.map((opt) => (
                  <p
                    key={opt}
                    onClick={() => {
                      setOption(opt);
                      setDropdown(false);
                      setCurrentPage(1);
                    }}
                  >
                    {opt} {opt === option && <Check width={16} />}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* TABLE */}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Buyer</th>
              <th>Date</th>
              <th>Qty</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "2rem" }}>
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((ord) => {
                const nextStatus = getNextStatus(ord.status);
                const statusStyle =
                  statusColors.find((s) => s.status === ord.status) || {};

                return (
                  <tr key={ord.orderItemId}>
                    <td>{ord.orderId}</td>

                    <td>
                      {ord.buyer?.name || "—"}
                      <br />
                      <small>{ord.buyer?.phone || "—"}</small>
                    </td>

                    <td>
                      {ord.date
                        ? new Date(ord.date).toLocaleDateString("en-IN")
                        : "—"}
                    </td>

                    <td>{ord.quantity}</td>
                    <td>₹{ord.amount}</td>
                    <td>{ord.paymentMode}</td>

                    <td>
                      <span
                        style={{
                          backgroundColor: statusStyle.bgCol,
                          padding: "0.4rem 0.8rem",
                          borderRadius: "1rem",
                        }}
                      >
                        {ord.status}
                      </span>
                    </td>

                    <td>
                      {nextStatus ? (
                        <button
                          className={styles.actionBtn}
                          onClick={() =>
                            updateStatus(ord.orderItemId, nextStatus)
                          }
                        >
                          Mark {nextStatus}
                        </button>
                      ) : (
                        <Eye onClick={() => setSelectedOrder(ord)} />
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              disabled={currentPage === 1}
              onClick={() => fetchOrders(currentPage - 1)}
            >
              Prev
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => fetchOrders(currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedOrder && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h3>Order Details</h3>
            <p><b>Order ID:</b> {selectedOrder.orderId}</p>
            <p><b>Product:</b> {selectedOrder.product?.name}</p>
            <p><b>Buyer:</b> {selectedOrder.buyer?.name}</p>
            <p><b>Phone:</b> {selectedOrder.buyer?.phone}</p>
            <p><b>Status:</b> {selectedOrder.status}</p>
            <p><b>Amount:</b> ₹{selectedOrder.amount}</p>
            <p><b>Quantity:</b> {selectedOrder.quantity}</p>
            <button onClick={() => setSelectedOrder(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;

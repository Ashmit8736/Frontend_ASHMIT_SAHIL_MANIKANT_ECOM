
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import styles from "./Orders.module.css";

// const API_BASE = "http://localhost:3000/api/seller";

// const Orders = () => {
//     const [search, setSearch] = useState("");
//     const [orders, setOrders] = useState([]);
//     const [selectedOrder, setSelectedOrder] = useState(null);
//     const [updateOrder, setUpdateOrder] = useState(null);

//     const token = localStorage.getItem("sellerToken");

//     const config = {
//         headers: { Authorization: `Bearer ${token}` },
//         withCredentials: true,
//     };

//     /* =========================
//        FETCH ORDERS
//     ========================= */
//     const fetchOrders = async () => {
//         try {
//             const res = await axios.get(`${API_BASE}/orders`, config);
//             setOrders(res.data.orders || []);
//         } catch (err) {
//             console.error("FETCH ORDERS ERROR:", err);
//         }
//     };

//     useEffect(() => {
//         fetchOrders();
//     }, []);

//     /* =========================
//        UPDATE STATUS
//     ========================= */
//     const handleStatusUpdate = async () => {
//         try {
//             await axios.put(
//                 `${API_BASE}/orders/${updateOrder.order_id}/status`,
//                 { status: updateOrder.status },
//                 config
//             );

//             setUpdateOrder(null);
//             fetchOrders();
//         } catch (err) {
//             console.error("Update failed", err);
//             alert("Failed to update order");
//         }
//     };

//     /* =========================
//        SEARCH
//     ========================= */
//     const filtered = orders.filter(
//         (order) =>
//             String(order.order_id).includes(search) ||
//             (order.buyer_name || "").toLowerCase().includes(search.toLowerCase())
//     );

//     const getStatusStyle = (status) => {
//         switch (status) {
//             case "placed":
//                 return styles.statusPending;
//             case "confirmed":
//                 return styles.statusPacked;
//             case "shipped":
//                 return styles.statusShipped;
//             case "delivered":
//                 return styles.statusDelivered;
//             default:
//                 return "";
//         }
//     };

//     return (
//         <div className={styles.ordersContainer}>
//             <h1 className={styles.heading}>Order Management</h1>

//             <div className={styles.controls}>
//                 <input
//                     type="text"
//                     placeholder="Search by order ID or customer..."
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     className={styles.searchInput}
//                 />
//             </div>

//             <div className={styles.tableWrapper}>
//                 <table className={styles.ordersTable}>
//                     <thead>
//                         <tr>
//                             <th>Order</th>
//                             <th>Customer</th>
//                             <th>Product</th>
//                             <th>Amount</th>
//                             <th>Status</th>
//                             <th>Type</th>
//                             <th>Actions</th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {filtered.map((order) => (
//                             <tr key={order.order_id}>
//                                 <td>{order.order_id}</td>

//                                 <td>
//                                     {order.buyer_name || "—"} <br />
//                                     {order.buyer_phone || ""}
//                                 </td>

//                                 <td>{order.product_name}</td>

//                                 <td>₹{order.amount}</td>

//                                 <td>
//                                     <span
//                                         className={`${styles.statusBadge} ${getStatusStyle(
//                                             order.status
//                                         )}`}
//                                     >
//                                         {order.status}
//                                     </span>
//                                 </td>

//                                 <td>{order.fulfillment_type}</td>

//                                 <td>
//                                     <button
//                                         className={styles.viewBtn}
//                                         onClick={() => setSelectedOrder(order)}
//                                     >
//                                         View
//                                     </button>

//                                     <button
//                                         className={styles.updateBtn}
//                                         onClick={() => setUpdateOrder(order)}
//                                     >
//                                         Update
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             {/* ================= MODAL : VIEW ================= */}
//             {selectedOrder && (
//                 <div className={styles.modalOverlay}>
//                     <div className={styles.modal}>
//                         <h2>Order Details</h2>

//                         <p><b>Order:</b> {selectedOrder.order_id}</p>
//                         <p><b>Product:</b> {selectedOrder.product_name}</p>
//                         <p><b>Quantity:</b> {selectedOrder.quantity}</p>
//                         <p><b>Amount:</b> ₹{selectedOrder.amount}</p>
//                         <p><b>Payment:</b> {selectedOrder.payment_mode}</p>
//                         <p><b>Type:</b> {selectedOrder.fulfillment_type}</p>

//                         {selectedOrder.fulfillment_type === "delivery" && (
//                             <>
//                                 <p><b>Address:</b></p>
//                                 <p>
//                                     {selectedOrder.address?.address_line},{" "}
//                                     {selectedOrder.address?.city},{" "}
//                                     {selectedOrder.address?.state} -{" "}
//                                     {selectedOrder.address?.pincode}
//                                 </p>
//                             </>
//                         )}
//                         <button
//                             className={styles.closeBtn}
//                             onClick={() => setSelectedOrder(null)}
//                         >
//                             Close
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {/* ================= MODAL : UPDATE ================= */}
//             {updateOrder && (
//                 <div className={styles.modalOverlay}>
//                     <div className={styles.modal}>
//                         <h2>Update Status</h2>

//                         <select
//                             className={styles.updateSelect}
//                             value={updateOrder.status}
//                             onChange={(e) =>
//                                 setUpdateOrder({
//                                     ...updateOrder,
//                                     status: e.target.value,
//                                 })
//                             }
//                         >
//                             <option value="placed">Placed</option>
//                             <option value="confirmed">Confirmed</option>
//                             <option value="shipped">Shipped</option>
//                             <option value="delivered">Delivered</option>
//                         </select>

//                         <div className={styles.modalActions}>
//                             <button className={styles.saveBtn} onClick={handleStatusUpdate}>
//                                 Save
//                             </button>
//                             <button
//                                 className={styles.closeBtn}
//                                 onClick={() => setUpdateOrder(null)}
//                             >
//                                 Cancel
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Orders;  


import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Orders.module.css";

const API_BASE = "http://localhost:3000/api/seller";
const ITEMS_PER_PAGE = 10;

const Orders = () => {
    const [search, setSearch] = useState("");
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updateOrder, setUpdateOrder] = useState(null);
    const [statusFilter, setStatusFilter] = useState("all");

    const [page, setPage] = useState(1);

    const token = localStorage.getItem("sellerToken");

    const config = {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
    };

    /* =========================
       FETCH ORDERS
    ========================= */
    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${API_BASE}/orders`, config);
            setOrders(res.data.orders || []);
        } catch (err) {
            console.error("FETCH ORDERS ERROR:", err);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    

    /* =========================
       UPDATE STATUS
    ========================= */
    const handleStatusUpdate = async () => {
        try {
            await axios.put(
                `${API_BASE}/orders/${updateOrder.order_id}/status`,
                { status: updateOrder.status },
                config
            );

            setUpdateOrder(null);
            fetchOrders();
        } catch (err) {
            console.error("Update failed", err);
            alert("Failed to update order");
        }
    };

    /* =========================
       SEARCH
    ========================= */
const filtered = orders.filter((order) => {
    const matchSearch =
        String(order.order_id).includes(search) ||
        (order.buyer_name || "").toLowerCase().includes(search.toLowerCase());

    const matchStatus =
        statusFilter === "all" || order.status === statusFilter;

    return matchSearch && matchStatus;
});

    /* =========================
       PAGINATION
    ========================= */
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedOrders = filtered.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE
    );

    const getStatusStyle = (status) => {
        switch (status) {
            case "placed":
                return styles.statusPending;
            case "confirmed":
                return styles.statusPacked;
            case "shipped":
                return styles.statusShipped;
            case "delivered":
                return styles.statusDelivered;
            default:
                return "";
        }
    };

    return (
        <div className={styles.ordersContainer}>
            <h1 className={styles.heading}>Order Management</h1>

            <div className={styles.controls}>
                <input
                    type="text"
                    placeholder="Search by order ID or customer..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    className={styles.searchInput}
                />

                    <select
        className={styles.statusFilter}
        value={statusFilter}
        onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
        }}
    >
        <option value="all">All Status</option>
        <option value="placed">Placed</option>
        <option value="confirmed">Confirmed</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
    </select>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.ordersTable}>
                    <thead>
                        <tr>
                            <th>Order</th>
                            <th>Customer</th>
                            <th>Product</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Type</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {paginatedOrders.map((order) => (
                            <tr key={order.order_id}>
                                <td>{order.order_id}</td>

                                <td>
                                    {order.buyer_name || "—"} <br />
                                    {order.buyer_phone || ""}
                                </td>

                                <td>{order.product_name}</td>

                                <td>₹{order.amount}</td>

                                <td>
                                    <span
                                        className={`${styles.statusBadge} ${getStatusStyle(
                                            order.status
                                        )}`}
                                    >
                                        {order.status}
                                    </span>
                                </td>

                                <td>{order.fulfillment_type}</td>

                                <td>
                                    <button
                                        className={styles.viewBtn}
                                        onClick={() => setSelectedOrder(order)}
                                    >
                                        View
                                    </button>

                                    <button
                                        className={styles.updateBtn}
                                        onClick={() => setUpdateOrder(order)}
                                    >
                                        Update
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {paginatedOrders.length === 0 && (
                            <tr>
                                <td colSpan="7" style={{ textAlign: "center" }}>
                                    No orders found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ================= PAGINATION ================= */}
            {totalPages > 1 && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px",
                        marginTop: "20px",
                    }}
                >
                    <button
                        className={styles.updateBtn}
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    >
                        Prev
                    </button>

                    <span style={{ padding: "8px 12px" }}>
                        Page {page} of {totalPages}
                    </span>

                    <button
                        className={styles.viewBtn}
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* ================= MODAL : VIEW ================= */}
            {selectedOrder && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2>Order Details</h2>

                        <p><b>Order:</b> {selectedOrder.order_id}</p>
                        <p><b>Product:</b> {selectedOrder.product_name}</p>
                        <p><b>Quantity:</b> {selectedOrder.quantity}</p>
                        <p><b>Amount:</b> ₹{selectedOrder.amount}</p>
                        <p><b>Payment:</b> {selectedOrder.payment_mode}</p>
                        <p><b>Type:</b> {selectedOrder.fulfillment_type}</p>

                        {selectedOrder.fulfillment_type === "delivery" && (
                            <>
                                <p><b>Address:</b></p>
                                <p>
                                    {selectedOrder.address?.address_line},{" "}
                                    {selectedOrder.address?.city},{" "}
                                    {selectedOrder.address?.state} -{" "}
                                    {selectedOrder.address?.pincode}
                                </p>
                            </>
                        )}

                        <button
                            className={styles.closeBtn}
                            onClick={() => setSelectedOrder(null)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* ================= MODAL : UPDATE ================= */}
            {updateOrder && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2>Update Status</h2>

                        <select
                            className={styles.updateSelect}
                            value={updateOrder.status}
                            onChange={(e) =>
                                setUpdateOrder({
                                    ...updateOrder,
                                    status: e.target.value,
                                })
                            }
                        >
                            <option value="placed">Placed</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                        </select>

                        <div className={styles.modalActions}>
                            <button
                                className={styles.saveBtn}
                                onClick={handleStatusUpdate}
                            >
                                Save
                            </button>
                            <button
                                className={styles.closeBtn}
                                onClick={() => setUpdateOrder(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
